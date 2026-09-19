import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { parseSpreadsheet } from "@/lib/parsing";
import { evaluateInvoice } from "@/lib/matching";

// The core ingestion endpoint: accepts a multipart upload (an .xlsx or
// .csv file, plus document metadata), parses it, stores the normalized
// line items, and — if the document is an INVOICE — immediately runs the
// discrepancy matching engine against any PO/quote already on file.
export async function POST(req: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file");
  const type = String(formData.get("type") ?? "");
  const businessId = String(formData.get("businessId") ?? "");
  const reference = String(formData.get("reference") ?? "").trim();
  const linkedPoRef = String(formData.get("linkedPoRef") ?? "").trim() || null;
  const linkedQuoteRef = String(formData.get("linkedQuoteRef") ?? "").trim() || null;
  const documentDateRaw = String(formData.get("documentDate") ?? "");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }
  if (!["PURCHASE_ORDER", "QUOTE", "INVOICE"].includes(type)) {
    return NextResponse.json({ error: "Invalid document type" }, { status: 400 });
  }
  if (!reference) {
    return NextResponse.json({ error: "A document reference number is required" }, { status: 400 });
  }

  const business = await prisma.business.findFirst({
    where: { id: businessId, environmentId: currentUser.environmentId },
  });
  if (!business) {
    return NextResponse.json({ error: "Unknown business for this environment" }, { status: 400 });
  }

  let parsed;
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    parsed = parseSpreadsheet(buffer);
  } catch (err) {
    return NextResponse.json({ error: "Could not parse that file as a spreadsheet" }, { status: 400 });
  }

  if (parsed.rows.length === 0) {
    return NextResponse.json({ error: "No rows could be read from that file" }, { status: 400 });
  }

  const document = await prisma.document.create({
    data: {
      type,
      reference,
      linkedPoRef: type === "INVOICE" ? linkedPoRef : null,
      linkedQuoteRef: linkedQuoteRef,
      fileName: file.name,
      totalAmount: parsed.total,
      documentDate: documentDateRaw ? new Date(documentDateRaw) : null,
      status: type === "INVOICE" ? "Processing" : "Matched",
      environmentId: currentUser.environmentId,
      businessId: business.id,
      uploadedById: currentUser.id,
      lineItems: { create: parsed.rows },
    },
  });

  await prisma.auditLog.create({
    data: {
      environmentId: currentUser.environmentId,
      userId: currentUser.id,
      action: `Uploaded ${type.replace("_", " ").toLowerCase()} ${reference}`,
      detail: `${parsed.rows.length} line item(s), total $${parsed.total.toFixed(2)}`,
    },
  });

  let result: Awaited<ReturnType<typeof evaluateInvoice>> | null = null;
  if (type === "INVOICE") {
    result = await evaluateInvoice(document.id);
  }

  return NextResponse.json({
    id: document.id,
    total: parsed.total,
    rowCount: parsed.rows.length,
    status: result?.status ?? document.status,
    reasons: result?.reasons ?? [],
  });
}
