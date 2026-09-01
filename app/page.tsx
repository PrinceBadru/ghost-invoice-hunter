import { StatusBadge } from "@/components/ui/StatusBadge";
import { ReconciliationCard } from "@/components/reconciliation/ReconciliationCard";
import { SystemInsight } from "@/components/ui/SystemInsight";
import { ArrowUpRight, Search, Filter } from "lucide-react";

export default function CommandCenterDashboard() {
  return (
    <div className="min-h-screen p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
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
          <button className="px-4 py-2 text-xs font-medium rounded-md bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]">
            + Process Invoices
          </button>
        </div>
      </header>

      {/* Hero Metric Grid */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Volume", value: "12,482", detail: "Last 30 days" },
          { label: "Reconciled Rate", value: "94.2%", detail: "Normal behavior" },
          { label: "Discrepancies", value: "23", detail: "Requires attention", highlight: true },
          { label: "Pending Review", value: "8", detail: "Assigned to team" },
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

      {/* Signature Component Feature */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Active Flagged Reconciliation</h2>
        <ReconciliationCard
          quoteAmount={12000}
          poAmount={12000}
          invoiceAmount={12850}
        />
      </section>

      {/* System Insight & Financial Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-semibold">Priority Queue</h3>
            <span className="text-xs font-mono text-[var(--text-muted)]">Showing 3 of 23 Flagged</span>
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
                <tr>
                  <td className="p-3 font-medium">INV-10492</td>
                  <td className="p-3 font-sans text-[var(--text-primary)]">Acme Logistics</td>
                  <td className="p-3 text-right">$12,850.00</td>
                  <td className="p-3 text-right text-[var(--danger)]">+7.08%</td>
                  <td className="p-3 font-sans"><StatusBadge status="Needs Review" severity="High" /></td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">INV-10488</td>
                  <td className="p-3 font-sans text-[var(--text-primary)]">Global Tech Inc</td>
                  <td className="p-3 text-right">$4,100.00</td>
                  <td className="p-3 text-right text-[var(--warning)]">+2.10%</td>
                  <td className="p-3 font-sans"><StatusBadge status="Needs Review" severity="Medium" /></td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">INV-10450</td>
                  <td className="p-3 font-sans text-[var(--text-primary)]">Vertex Cloud Services</td>
                  <td className="p-3 text-right">$8,230.00</td>
                  <td className="p-3 text-right text-[var(--success)]">0.00%</td>
                  <td className="p-3 font-sans"><StatusBadge status="Matched" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Sidebar Insights & Activity */}
        <section className="space-y-4">
          <h3 className="text-base font-semibold">Automated Insights</h3>
          <SystemInsight
            title="Variance Threshold Exceeded"
            description="Invoice INV-10492 exceeds the configured 5% approval limit by +2.08%. Review required before payment."
            actionText="Review Invoice"
          />
        </section>
      </div>
    </div>
  );
}