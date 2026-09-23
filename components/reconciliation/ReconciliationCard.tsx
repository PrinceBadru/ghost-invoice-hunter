import React from "react";

// Three-way visual comparison of quote → PO → invoice amounts, used on the
// dashboard and on the invoice drill-down page.
export function ReconciliationCard({
  quoteAmount,
  poAmount,
  invoiceAmount,
}: {
  quoteAmount: number;
  poAmount: number | null;
  invoiceAmount: number;
}) {
  const safePoAmount = poAmount ?? 0;
  const max = Math.max(quoteAmount, safePoAmount, invoiceAmount, 1);
  const variance =
    poAmount !== null && poAmount !== undefined ? invoiceAmount - poAmount : 0;
  const variancePercent =
    poAmount !== null && poAmount !== undefined && poAmount !== 0
      ? (variance / poAmount) * 100
      : 0;
  const flagged = Math.abs(variancePercent) > 0.01;

  const rows = [
    { label: "Quote", value: quoteAmount, color: "var(--insight)" },
    {
      label: "Purchase Order",
      value: safePoAmount,
      color: "var(--color-primary)",
    },
    {
      label: "Invoice",
      value: invoiceAmount,
      color: flagged ? "var(--danger)" : "var(--success)",
    },
  ];

  return (
    <div className="p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-4">
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[var(--text-secondary)]">{row.label}</span>
              <span className="font-semibold text-[var(--text-primary)]">
                UGX 
                {row.value.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-[var(--bg-surface-alt)] overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(row.value / max) * 100}%`,
                  backgroundColor: row.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-[var(--border-color)] text-xs font-mono">
        <span className="text-[var(--text-muted)] uppercase">
          Invoice vs PO Variance
        </span>
        <span
          className={`font-bold ${flagged ? "text-[var(--danger)]" : "text-[var(--success)]"}`}
        >
          {variance >= 0 ? "+" : ""}UGX 
          {variance.toLocaleString("en-US", { minimumFractionDigits: 2 })} (
          {variancePercent.toFixed(2)}%)
        </span>
      </div>
    </div>
  );
}
