import React from "react";
import { MOCK_INVOICES } from "@/lib/data";
import { Quote, CheckCircle2 } from "lucide-react";

export default function QuotesPage() {
  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
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
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-[var(--bg-surface-alt)] text-[var(--text-muted)] font-mono">
                <th className="p-3 font-medium">QUOTE REF</th>
                <th className="p-3 font-medium">VENDOR</th>
                <th className="p-3 font-medium text-right">QUOTED AMOUNT</th>
                <th className="p-3 font-medium">LINKED PO</th>
                <th className="p-3 font-medium">PIPELINE STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {MOCK_INVOICES.map((item) => (
                <tr key={item.quoteNumber} className="hover:bg-[var(--bg-surface-alt)] transition-colors">
                  <td className="p-3 font-mono font-semibold text-[var(--text-primary)]">
                    {item.quoteNumber}
                  </td>
                  <td className="p-3 text-[var(--text-primary)]">
                    {item.vendor}
                  </td>
                  <td className="p-3 text-right font-mono font-semibold text-[var(--text-primary)]">
                    ${item.quoteAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-3 font-mono text-[var(--text-secondary)]">
                    {item.poNumber}
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[var(--success)]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approved Baseline
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}