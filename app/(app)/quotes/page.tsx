import { CheckCircle2 } from "lucide-react";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export default async function QuotesPage() {
  const user = await requireUser();

  const quotes = await prisma.document.findMany({
    where: { environmentId: user.environmentId, type: "QUOTE" },
    include: { business: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-display font-bold text-[var(--text-primary)]">
          Quotes
        </h1>
        <p className="text-xs text-[var(--text-secondary)]">
          Initial supplier estimates and rate commitments before PO issuance.
        </p>
      </div>

      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] overflow-hidden">
        <div className="overflow-x-auto">
          <div className="w-full overflow-x-auto pb-4">
<table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-[var(--bg-surface-alt)] text-[var(--text-muted)] font-mono">
                <th className="p-3 font-medium">QUOTE REF</th>
                <th className="p-3 font-medium">VENDOR</th>
                <th className="p-3 font-medium text-right">QUOTED AMOUNT</th>
                <th className="p-3 font-medium">LINKED QUOTE REF</th>
                <th className="p-3 font-medium">PIPELINE STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {quotes.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="p-6 text-center text-[var(--text-muted)]"
                  >
                    No quotes uploaded yet.
                  </td>
                </tr>
              )}
              {quotes.map((q) => (
                <tr
                  key={q.id}
                  className="hover:bg-[var(--bg-surface-alt)] transition-colors"
                >
                  <td className="p-3 font-mono font-semibold text-[var(--text-primary)]">
                    {q.reference}
                  </td>
                  <td className="p-3 text-[var(--text-primary)]">
                    {q.business.name}
                  </td>
                  <td className="p-3 text-right font-mono font-semibold text-[var(--text-primary)]">
                    $
                    {q.totalAmount.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="p-3 font-mono text-[var(--text-secondary)]">
                    {q.linkedQuoteRef ?? "—"}
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[var(--success)]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
</div>
        </div>
      </div>
    </div>
  );
}
