import type { InvoiceRecord } from "@/lib/types";

// Shared mapper from a Prisma Document (+ its business + latest discrepancy)
// into the flat InvoiceRecord shape the original UI components expect.
export function toInvoiceRecord(doc: {
  id: string;
  reference: string;
  linkedPoRef: string | null;
  documentDate: Date | null;
  createdAt: Date;
  totalAmount: number;
  status: string;
  business: { name: string; vendorCode: string };
  discrepancies: {
    poAmount: number | null;
    quoteAmount: number | null;
    quoteReference: string | null;
    severity: string;
    score: number;
    reasons: string;
  }[];
}): InvoiceRecord {
  const d = doc.discrepancies[0];
  const date = doc.documentDate ?? doc.createdAt;

  return {
    id: doc.id,
    invoiceNumber: doc.reference,
    vendor: doc.business.name,
    vendorId: doc.business.vendorCode,
    invoiceDate: date.toISOString().slice(0, 10),
    poNumber: doc.linkedPoRef ?? "",
    quoteNumber: d?.quoteReference ?? "",
    poAmount: d?.poAmount ?? 0,
    quoteAmount: d?.quoteAmount ?? 0,
    invoiceAmount: doc.totalAmount,
    status: doc.status as InvoiceRecord["status"],
    severity: (d?.severity as InvoiceRecord["severity"]) ?? null,
    discrepancyScore: d?.score ?? 0,
    scoreReasons: d ? JSON.parse(d.reasons) : [],
  };
}
