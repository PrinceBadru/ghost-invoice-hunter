import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ReconciliationCard } from "@/components/reconciliation/ReconciliationCard";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();

  const invoice = await prisma.document.findFirst({
    where: { id, environmentId: user.environmentId, type: "INVOICE" },
    include: {
      business: true,
      lineItems: true,
      uploadedBy: true,
      discrepancies: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  if (!invoice) notFound();

  const discrepancy = invoice.discrepancies[0];
  const reasons: string[] = discrepancy ? JSON.parse(discrepancy.reasons) : [];

  const po = invoice.linkedPoRef
    ? await prisma.document.findFirst({
        where: {
          environmentId: user.environmentId,
          businessId: invoice.businessId,
          type: "PURCHASE_ORDER",
          reference: invoice.linkedPoRef,
        },
        include: { lineItems: true },
      })
    : null;

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto">
      <Link
        href="/invoices"
        className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to invoices
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[var(--border-color)]">
        <div>
          <h1 className="text-2xl font-display font-bold text-[var(--text-primary)] font-mono">
            {invoice.reference}
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            {invoice.business.name} &middot; uploaded by{" "}
            {invoice.uploadedBy.name} &middot;{" "}
            {invoice.createdAt.toISOString().slice(0, 10)}
          </p>
        </div>
        <StatusBadge status={invoice.status} severity={discrepancy?.severity} />
      </div>

      {discrepancy && (
        <ReconciliationCard
          quoteAmount={
            discrepancy.quoteAmount ??
            discrepancy.poAmount ??
            invoice.totalAmount
          }
          poAmount={discrepancy.poAmount ?? invoice.totalAmount}
          invoiceAmount={invoice.totalAmount}
        />
      )}

      {reasons.length > 0 && (
        <div className="p-4 rounded-xl border border-[var(--danger)] bg-[var(--danger-soft)] space-y-1">
          <div className="text-xs font-semibold text-[var(--danger)]">
            Detected issues
          </div>
          <ul className="text-xs text-[var(--text-secondary)] list-disc pl-4 space-y-0.5">
            {reasons.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">
            Invoice line items
          </h2>
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--bg-surface-alt)] text-[var(--text-muted)] font-mono">
                <tr>
                  <th className="p-2 font-medium">Item</th>
                  <th className="p-2 font-medium text-right">Qty</th>
                  <th className="p-2 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {invoice.lineItems.map((li) => (
                  <tr key={li.id}>
                    <td className="p-2 text-[var(--text-primary)]">
                      {li.description}
                    </td>
                    <td className="p-2 text-right font-mono text-[var(--text-secondary)]">
                      {li.quantity}
                    </td>
                    <td className="p-2 text-right font-mono text-[var(--text-primary)]">
                      $
                      {li.amount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">
            {po ? `Matched PO ${po.reference}` : "Purchase order"}
          </h2>
          {po ? (
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--bg-surface-alt)] text-[var(--text-muted)] font-mono">
                  <tr>
                    <th className="p-2 font-medium">Item</th>
                    <th className="p-2 font-medium text-right">Qty</th>
                    <th className="p-2 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {po.lineItems.map((li) => (
                    <tr key={li.id}>
                      <td className="p-2 text-[var(--text-primary)]">
                        {li.description}
                      </td>
                      <td className="p-2 text-right font-mono text-[var(--text-secondary)]">
                        {li.quantity}
                      </td>
                      <td className="p-2 text-right font-mono text-[var(--text-primary)]">
                        $
                        {li.amount.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-[var(--text-muted)] p-4 rounded-xl border border-dashed border-[var(--border-color)]">
              No purchase order on file for reference "
              {invoice.linkedPoRef ?? "none provided"}".
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
