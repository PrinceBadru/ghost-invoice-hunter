import Decimal from "decimal.js";
import { formatCurrency } from "@/lib/present";
import { prisma } from "@/lib/prisma";
import type { DocStatus, Severity } from "@/lib/types";

const SEVERITY_HIGH = 15; // % variance for total or unit price
const SEVERITY_MEDIUM = 8; // % variance

export async function evaluateInvoice(invoiceDocId: string) {
  const invoice = await prisma.document.findUniqueOrThrow({
    where: { id: invoiceDocId },
    include: { environment: true, lineItems: true },
  });

  const tolerance = invoice.environment.toleranceThreshold;

  const po = invoice.linkedPoRef
    ? await prisma.document.findFirst({
        where: {
          environmentId: invoice.environmentId,
          businessId: invoice.businessId,
          type: "PURCHASE_ORDER",
          reference: invoice.linkedPoRef,
        },
        include: { lineItems: true },
      })
    : null;

  const quote = invoice.linkedQuoteRef
    ? await prisma.document.findFirst({
        where: {
          environmentId: invoice.environmentId,
          businessId: invoice.businessId,
          type: "QUOTE",
          reference: invoice.linkedQuoteRef,
        },
        include: { lineItems: true },
      })
    : null;

  const reasons: string[] = [];
  let highestSeverityLevel = 0; // 0 = Low, 1 = Medium, 2 = High
  let score = 0;

  const addReason = (reason: string, level: number) => {
    reasons.push(reason);
    highestSeverityLevel = Math.max(highestSeverityLevel, level);
  };

  // 1. Duplicate Invoice Check
  const duplicates = await prisma.document.findMany({
    where: {
      environmentId: invoice.environmentId,
      businessId: invoice.businessId,
      type: "INVOICE",
      totalAmount: invoice.totalAmount,
      documentDate: invoice.documentDate,
      id: { not: invoice.id },
    },
  });

  if (duplicates.length > 0) {
    addReason(`Possible duplicate invoice detected (matches ${duplicates[0].reference})`, 2);
    score += 50;
  }

  let variance = 0;
  let variancePercent = 0;

  if (!po) {
    addReason(`No matching purchase order found for reference "${invoice.linkedPoRef ?? "(none provided)"}"`, 2);
    score += 70;
  } else {
    // 2. Total Variance
    variance = new Decimal(invoice.totalAmount).minus(po.totalAmount).toNumber();
    variancePercent = po.totalAmount !== 0 ? (variance / po.totalAmount) * 100 : 0;
    
    // 3. Line-Level Matching
    const poLines = [...po.lineItems];

    for (const invLine of invoice.lineItems) {
      const invDesc = invLine.description.toLowerCase();
      let matchedPoLineIdx = poLines.findIndex(p => p.description.toLowerCase() === invDesc);
      
      if (matchedPoLineIdx === -1) {
        matchedPoLineIdx = poLines.findIndex(p => 
          invDesc.includes(p.description.toLowerCase()) || 
          p.description.toLowerCase().includes(invDesc)
        );
      }

      if (matchedPoLineIdx === -1) {
        if (invDesc.includes('tax') || invDesc.includes('vat')) {
          addReason(`Unmatched Tax/VAT line added on invoice: ${invLine.description} (${formatCurrency(invLine.amount)})`, 1);
        } else if (invDesc.includes('ship') || invDesc.includes('freight')) {
          addReason(`Unmatched Shipping/Freight line added on invoice: ${invLine.description} (${formatCurrency(invLine.amount)})`, 1);
        } else {
          addReason(`Missing PO line: Billed for "${invLine.description}" (${formatCurrency(invLine.amount)}) which is not on the PO`, 2);
          score += 20;
        }
      } else {
        const poLine = poLines[matchedPoLineIdx];
        
        if (invLine.quantity > poLine.quantity) {
          addReason(`Quantity over-billed on "${invLine.description}": PO qty ${poLine.quantity}, Invoice qty ${invLine.quantity}`, 2);
          score += 25;
        }

        if (poLine.unitPrice > 0) {
          const priceVariance = new Decimal(invLine.unitPrice).minus(poLine.unitPrice).toNumber();
          const priceVarPercent = (priceVariance / poLine.unitPrice) * 100;
          
          if (priceVarPercent > tolerance) {
            addReason(`Unit price variance on "${invLine.description}": ${priceVarPercent.toFixed(1)}% above PO price`, priceVarPercent > SEVERITY_HIGH ? 2 : 1);
            score += Math.min(30, Math.round(priceVarPercent * 2));
          }
        }
        
        poLines.splice(matchedPoLineIdx, 1);
      }
    }

    if (poLines.length > 0) {
      addReason(`Partial invoice: ${poLines.length} line(s) from the PO are not included on this invoice`, 0);
    }

    const absTotalVarPercent = Math.abs(variancePercent);
    if (absTotalVarPercent > tolerance && variance > 0) {
      addReason(`Invoice total exceeds PO baseline by ${variancePercent.toFixed(2)}% (${formatCurrency(variance)})`, absTotalVarPercent > SEVERITY_HIGH ? 2 : 1);
      score += Math.min(50, Math.round(absTotalVarPercent * 3));
    }
  }

  if (quote && po && Math.abs(quote.totalAmount - po.totalAmount) > 0.01) {
    addReason(`PO baseline differs from the original quote by ${formatCurrency(Math.abs(po.totalAmount - quote.totalAmount))}`, 1);
  }

  score = Math.min(100, score);
  
  let status: DocStatus = "Matched";
  let severity: Severity = "Low";

  if (reasons.length > 0) {
    status = score > 40 || highestSeverityLevel === 2 ? "Discrepancy" : "Needs Review";
    severity = highestSeverityLevel === 2 ? "High" : highestSeverityLevel === 1 ? "Medium" : "Low";
  }

  await prisma.discrepancy.create({
    data: {
      environmentId: invoice.environmentId,
      invoiceDocId: invoice.id,
      poReference: po?.reference,
      poAmount: po?.totalAmount,
      quoteReference: quote?.reference,
      quoteAmount: quote?.totalAmount,
      invoiceAmount: invoice.totalAmount,
      variance,
      variancePercent,
      severity,
      status,
      reasons: JSON.stringify(reasons),
      score,
    },
  });

  await prisma.document.update({ where: { id: invoice.id }, data: { status } });

  await prisma.auditLog.create({
    data: {
      environmentId: invoice.environmentId,
      userId: invoice.uploadedById,
      action: `Processed invoice ${invoice.reference}`,
      reason: reasons[0] ?? "Automatically matched perfectly",
    },
  });

  return {
    status,
    severity,
    score,
    reasons,
    variance,
    variancePercent,
    po,
    quote,
  };
}
