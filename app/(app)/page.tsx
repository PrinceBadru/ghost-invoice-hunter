import Link from "next/link";
import { Filter } from "lucide-react";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ReconciliationCard } from "@/components/reconciliation/ReconciliationCard";
import { SystemInsight } from "@/components/ui/SystemInsight";

export default async function CommandCenterDashboard() {
  const user = await requireUser();
  const environmentId = user.environmentId;

  const [totalInvoices, matchedInvoices, discrepancyCount, pendingReview, priorityQueue, latestDiscrepancy] =
    await Promise.all([
      prisma.document.count({ where: { environmentId, type: "INVOICE" } }),
      prisma.document.count({ where: { environmentId, type: "INVOICE", status: "Matched" } }),
      prisma.document.count({
        where: { environmentId, type: "INVOICE", status: { in: ["Needs Review", "Discrepancy"] } },
      }),
      prisma.document.count({ where: { environmentId, type: "INVOICE", status: "Needs Review" } }),
      prisma.document.findMany({
        where: { environmentId, type: "INVOICE", status: { in: ["Needs Review", "Discrepancy"] } },
        include: {
          business: true,
          discrepancies: { orderBy: { createdAt: "desc" }, take: 1 },
        },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
      prisma.discrepancy.findFirst({
        where: { environmentId, status: { in: ["Needs Review", "Discrepancy"] } },
        orderBy: { createdAt: "desc" },
        include: { invoiceDoc: { include: { business: true } } },
      }),
    ]);

  const reconciledRate = totalInvoices > 0 ? (matchedInvoices / totalInvoices) * 100 : 0;

  const featured = priorityQueue[0];
  const featuredDiscrepancy = featured?.discrepancies[0];

  return (
    <div className="min-h-screen p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-center pb-6 border-b border-[var(--border-color)]">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-[var(--text-primary)]">
            Command Center
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Quiet operational overview. Flagged items prioritized.
          </p>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-3 py-2 text-xs rounded-md border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)]">
            <Filter className="w-3.5 h-3.5" /> Filters
          </button>
          <Link
            href="/upload"
            className="px-4 py-2 text-xs font-medium rounded-md bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]"
          >
            + Process Invoices
          </Link>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Volume", value: totalInvoices.toLocaleString(), detail: "Invoices on file" },
          { label: "Reconciled Rate", value: `${reconciledRate.toFixed(1)}%`, detail: "Matched within tolerance" },
          { label: "Discrepancies", value: String(discrepancyCount), detail: "Requires attention", highlight: discrepancyCount > 0 },
          { label: "Pending Review", value: String(pendingReview), detail: "Needs a second look" },
        ].map((metric, i) => (
          <div
            key={i}
            className={`p-4 rounded-xl border bg-[var(--bg-surface)] ${
              metric.highlight ? "border-[var(--danger)]" : "border-[var(--border-color)]"
            }`}
          >
            <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">{metric.label}</span>
            <div className={`text-3xl font-display font-semibold mt-1 ${metric.highlight ? "text-[var(--danger)]" : "text-[var(--text-primary)]"}`}>
              {metric.value}
            </div>
            <span className="text-xs text-[var(--text-secondary)] mt-1 block">{metric.detail}</span>
          </div>
        ))}
      </section>

      {featured && featuredDiscrepancy ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Active Flagged Reconciliation</h2>
          <ReconciliationCard
            quoteAmount={featuredDiscrepancy.quoteAmount ?? featuredDiscrepancy.poAmount ?? featured.totalAmount}
            poAmount={featuredDiscrepancy.poAmount ?? featured.totalAmount}
            invoiceAmount={featured.totalAmount}
          />
        </section>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-semibold">Priority Queue</h3>
            <span className="text-xs font-mono text-[var(--text-muted)]">
              Showing {priorityQueue.length} of {discrepancyCount} Flagged
            </span>
          </div>

          <div className="border border-[var(--border-color)] rounded-xl overflow-hidden bg-[var(--bg-surface)]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--bg-surface-alt)] border-b border-[var(--border-color)] text-[var(--text-muted)] uppercase">
                <tr>
                  <th className="p-3 font-mono">Invoice #</th>
                  <th className="p-3">Vendor</th>
                  <th className="p-3 text-right">Amount</th>
                  <th className="p-3 text-right">Variance</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)] font-mono">
                {priorityQueue.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-[var(--text-muted)] font-sans">
                      Nothing flagged. Upload invoices to get started.
                    </td>
                  </tr>
                )}
                {priorityQueue.map((inv) => {
                  const d = inv.discrepancies[0];
                  return (
                    <tr key={inv.id}>
                      <td className="p-3 font-medium">
                        <Link href={`/invoices/${inv.id}`} className="hover:underline text-[var(--color-primary)]">
                          {inv.reference}
                        </Link>
                      </td>
                      <td className="p-3 font-sans text-[var(--text-primary)]">{inv.business.name}</td>
                      <td className="p-3 text-right">
                        ${inv.totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                      <td
                        className={`p-3 text-right ${
                          d && d.variancePercent > 0 ? "text-[var(--danger)]" : "text-[var(--success)]"
                        }`}
                      >
                        {d ? `${d.variancePercent >= 0 ? "+" : ""}${d.variancePercent.toFixed(2)}%` : "—"}
                      </td>
                      <td className="p-3 font-sans">
                        <StatusBadge status={inv.status} severity={d?.severity} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-base font-semibold">Automated Insights</h3>
          {latestDiscrepancy ? (
            <SystemInsight
              title="Variance Threshold Exceeded"
              description={`Invoice ${latestDiscrepancy.invoiceDoc.reference} from ${latestDiscrepancy.invoiceDoc.business.name} — ${
                JSON.parse(latestDiscrepancy.reasons)[0] ?? "flagged for review"
              }`}
              actionText="Review Invoice"
              actionHref={`/invoices/${latestDiscrepancy.invoiceDocId}`}
            />
          ) : (
            <p className="text-xs text-[var(--text-muted)]">No insights yet — nothing has been flagged.</p>
          )}
        </section>
      </div>
    </div>
  );
}
