import React from "react";
import { MOCK_INVOICES } from "@/lib/data";
import { ShoppingCart, FileCheck, CheckCircle, Clock } from "lucide-react";

export default function PurchaseOrdersPage() {
  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-[var(--text-primary)]">
          Purchase Orders
        </h1>
        <p className="text-xs text-[var(--text-secondary)]">
          Approved purchase order baselines registered for automated matching.
        </p>
      </div>

      {/* PO Data Table */}
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-[var(--bg-surface-alt)] text-[var(--text-muted)] font-mono">
                <th className="p-3 font-medium">PO NUMBER</th>
                <th className="p-3 font-medium">QUOTE REF</th>
                <th className="p-3 font-medium">VENDOR</th>
                <th className="p-3 font-medium text-right">PO AMOUNT</th>
                <th className="p-3 font-medium">MATCHED INVOICE</th>
                <th className="p-3 font-medium">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {MOCK_INVOICES.map((item) => (
                <tr key={item.poNumber} className="hover:bg-[var(--bg-surface-alt)] transition-colors">
                  <td className="p-3 font-mono font-semibold text-[var(--text-primary)]">
                    {item.poNumber}
                  </td>
                  <td className="p-3 font-mono text-[var(--text-secondary)]">
                    {item.quoteNumber}
                  </td>
                  <td className="p-3 text-[var(--text-primary)]">
                    {item.vendor}
                  </td>
                  <td className="p-3 text-right font-mono font-semibold text-[var(--text-primary)]">
                    ${item.poAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-3 font-mono text-[var(--color-primary)]">
                    {item.invoiceNumber}
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                      <FileCheck className="w-3 h-3" /> Active Baseline
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