import { FileCheck } from "lucide-react";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export default async function PurchaseOrdersPage() {
  const user = await requireUser();

  const pos = await prisma.document.findMany({
    where: { environmentId: user.environmentId, type: "PURCHASE_ORDER" },
    include: { business: true },
    orderBy: { createdAt: "desc" },
  });

  // For each PO, find any invoice that references it (matched by business + reference).
  const matches = await prisma.document.findMany({
    where: {
      environmentId: user.environmentId,
      type: "INVOICE",
      linkedPoRef: { in: pos.map((p) => p.reference) },
    },
    select: { reference: true, linkedPoRef: true, businessId: true },
  });

  const invoiceByPoRef = new Map<string, string>();
  for (const m of matches) invoiceByPoRef.set(`${m.businessId}:${m.linkedPoRef}`, m.reference);

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-display font-bold text-[var(--text-primary)]">Purchase Orders</h1>
        <p className="text-xs text-[var(--text-secondary)]">
          Approved purchase order baselines registered for automated matching.
        </p>
      </div>

      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-[var(--bg-surface-alt)] text-[var(--text-muted)] font-mono">
                <th className="p-3 font-medium">PO NUMBER</th>
                <th className="p-3 font-medium">VENDOR</th>
                <th className="p-3 font-medium text-right">PO AMOUNT</th>
                <th className="p-3 font-medium">MATCHED INVOICE</th>
                <th className="p-3 font-medium">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {pos.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-[var(--text-muted)]">
                    No purchase orders uploaded yet.
                  </td>
                </tr>
              )}
              {pos.map((po) => {
                const matchedInvoice = invoiceByPoRef.get(`${po.businessId}:${po.reference}`);
                return (
                  <tr key={po.id} className="hover:bg-[var(--bg-surface-alt)] transition-colors">
                    <td className="p-3 font-mono font-semibold text-[var(--text-primary)]">{po.reference}</td>
                    <td className="p-3 text-[var(--text-primary)]">{po.business.name}</td>
                    <td className="p-3 text-right font-mono font-semibold text-[var(--text-primary)]">
                      ${po.totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 font-mono text-[var(--color-primary)]">{matchedInvoice ?? "—"}</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                        <FileCheck className="w-3 h-3" /> Active Baseline
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
