import { prisma } from "@/lib/prisma";
import type { DocStatus, Severity } from "@/lib/types";

const SEVERITY_HIGH = 15; // % variance
const SEVERITY_MEDIUM = 8; // % variance

/**
 * The discrepancy detection engine. Runs once an INVOICE document has been
 * parsed and totalled. Matches it against a Purchase Order (and optionally
 * a Quote) in the same environment + business by reference number, then
 * scores the variance.
 *
 * This is document-total matching (invoice total vs PO total) rather than
 * line-item-level matching — deliberately, to ship a working end-to-end
 * pipeline first. Line items are still stored per document, so upgrading
 * to line-item-level matching later doesn't require a schema change —
 * just a smarter version of this function (see Phase 11 of the build plan).
 */
export async function evaluateInvoice(invoiceDocId: string) {
  const invoice = await prisma.document.findUniqueOrThrow({
    where: { id: invoiceDocId },
    include: { environment: true },
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
      })
    : null;

  const reasons: string[] = [];
  let status: DocStatus;
  let severity: Severity;
  let score: number;
  let variance = 0;
  let variancePercent = 0;

  if (!po) {
    status = "Needs Review";
    severity = "High";
    score = 70;
    reasons.push(
      `No matching purchase order found for reference "${invoice.linkedPoRef ?? "(none provided)"}"`
    );
  } else {
    variance = invoice.totalAmount - po.totalAmount;
    variancePercent = po.totalAmount !== 0 ? (variance / po.totalAmount) * 100 : 0;
    const abs = Math.abs(variancePercent);

    if (abs <= tolerance) {
      status = "Matched";
      severity = "Low";
      score = 0;
    } else {
      status = abs > tolerance * 3 ? "Discrepancy" : "Needs Review";
      severity = abs > SEVERITY_HIGH ? "High" : abs > SEVERITY_MEDIUM ? "Medium" : "Low";
      score = Math.min(100, Math.round(abs * 4));
      reasons.push(
        `Invoice total exceeds PO baseline by ${variancePercent.toFixed(2)}% ($${variance.toFixed(2)})`
      );
    }
  }

  if (quote && po && Math.abs(quote.totalAmount - po.totalAmount) > 0.01) {
    reasons.push(
      `PO baseline differs from the original quote by $${(po.totalAmount - quote.totalAmount).toFixed(2)}`
    );
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
      reason: reasons[0],
    },
  });

  return { status, severity, score, reasons, variance, variancePercent, po, quote };
}
