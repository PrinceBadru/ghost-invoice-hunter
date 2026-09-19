import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { toInvoiceRecord } from "@/lib/present";
import { InvoicesClient } from "@/components/invoices/InvoicesClient";

export default async function InvoicesPage() {
  const user = await requireUser();

  const docs = await prisma.document.findMany({
    where: { environmentId: user.environmentId, type: "INVOICE" },
    include: { business: true, discrepancies: { orderBy: { createdAt: "desc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  const invoices = docs.map(toInvoiceRecord);

  return <InvoicesClient invoices={invoices} />;
}
