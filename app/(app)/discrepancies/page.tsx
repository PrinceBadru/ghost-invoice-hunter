import Link from "next/link";
import { AlertTriangle, Eye } from "lucide-react";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default async function DiscrepanciesPage() {
  const user = await requireUser();

  const docs = await prisma.document.findMany({
    where: {
      environmentId: user.environmentId,
      type: "INVOICE",
      status: { in: ["Needs Review", "Discrepancy"] },
    },
    include: { business: true, discrepancies: { orderBy: { createdAt: "desc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[var(--danger)]" />
            <h1 className="text-2xl font-display font-bold text-[var(--text-primary)]">Flagged Discrepancies</h1>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Invoices exceeding variance thresholds or requiring immediate reconciliation.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {docs.length === 0 && (
          <p className="text-xs text-[var(--text-muted)] p-6 text-center rounded-xl border border-dashed border-[var(--border-color)]">
            Nothing flagged right now.
          </p>
        )}
        {docs.map((inv) => {
          const d = inv.discrepancies[0];
          const poAmount = d?.poAmount ?? 0;
          const variance = (poAmount !== null && poAmount !== undefined) ? inv.totalAmount - poAmount : 0;
          const reasons: string[] = d ? JSON.parse(d.reasons) : [];

          return (
            <div
              key={inv.id}
              className="p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[var(--danger)] transition-all space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-color)] pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-base font-mono font-bold text-[var(--text-primary)]">{inv.reference}</span>
                  <StatusBadge status={inv.status} severity={d?.severity} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[var(--text-muted)]">Score:</span>
                  <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-[var(--danger-soft)] text-[var(--danger)]">
                    {d?.score ?? 0} / 100
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
                <div>
                  <div className="text-[10px] text-[var(--text-muted)] uppercase">Vendor</div>
                  <div className="font-semibold text-[var(--text-primary)]">{inv.business.name}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[var(--text-muted)] uppercase">PO Baseline</div>
                  <div className="text-[var(--text-secondary)]">
                    {(poAmount !== null && poAmount !== undefined) ? `$${poAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "No PO found"}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-[var(--text-muted)] uppercase">Invoice Total</div>
                  <div className="font-semibold text-[var(--text-primary)]">
                    ${inv.totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-[var(--text-muted)] uppercase">Variance</div>
                  <div className="font-bold text-[var(--danger)]">
                    {(poAmount !== null && poAmount !== undefined) ? `${variance >= 0 ? "+" : ""}$${variance.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "—"}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs">
                <div className="text-[var(--text-secondary)]">
                  <span className="font-semibold text-[var(--danger)]">Detected: </span>
                  {reasons.join(" • ") || "—"}
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
