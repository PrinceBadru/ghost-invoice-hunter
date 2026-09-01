import React from "react";
import Link from "next/link";
import { MOCK_INVOICES } from "@/lib/data";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AlertTriangle, ArrowUpRight, Eye } from "lucide-react";

export default function DiscrepanciesPage() {
  const discrepancyInvoices = MOCK_INVOICES.filter(
    (inv) => inv.status === "Needs Review" || inv.status === "Discrepancy"
  );

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header with High-Priority Callout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[var(--danger)]" />
            <h1 className="text-2xl font-display font-bold text-[var(--text-primary)]">
              Flagged Discrepancies
            </h1>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Invoices exceeding variance thresholds or requiring immediate reconciliation.
          </p>
        </div>
      </div>

      {/* High Risk Items List */}
      <div className="space-y-4">
        {discrepancyInvoices.map((inv) => {
          const variance = inv.invoiceAmount - inv.poAmount;
          const variancePercent = ((variance / inv.poAmount) * 100).toFixed(2);

          return (
            <div
              key={inv.id}
              className="p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[var(--danger)] transition-all space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-color)] pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-base font-mono font-bold text-[var(--text-primary)]">
                    {inv.invoiceNumber}
                  </span>
                  <StatusBadge status={inv.status} severity={inv.severity} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[var(--text-muted)]">
                    Score:
                  </span>
                  <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-[var(--danger-soft)] text-[var(--danger)]">
                    {inv.discrepancyScore} / 100
                  </span>
                </div>
              </div>

              {/* Grid Context */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
                <div>
                  <div className="text-[10px] text-[var(--text-muted)] uppercase">Vendor</div>
                  <div className="font-semibold text-[var(--text-primary)]">{inv.vendor}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[var(--text-muted)] uppercase">PO Baseline</div>
                  <div className="text-[var(--text-secondary)]">
                    ${inv.poAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-[var(--text-muted)] uppercase">Invoice Total</div>
                  <div className="font-semibold text-[var(--text-primary)]">
                    ${inv.invoiceAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-[var(--text-muted)] uppercase">Variance</div>
                  <div className="font-bold text-[var(--danger)]">
                    +${variance.toLocaleString("en-US", { minimumFractionDigits: 2 })} (+{variancePercent}%)
                  </div>
                </div>
              </div>

              {/* Trigger Reason + Action */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs">
                <div className="text-[var(--text-secondary)]">
                  <span className="font-semibold text-[var(--danger)]">Detected: </span>
                  {inv.scoreReasons.join(" • ")}
                </div>
                <Link
                  href={`/invoices/${inv.id}`}
                  className="px-3 py-1.5 rounded-md bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] inline-flex items-center gap-1 font-medium transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" /> Reconcile
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}