import React from "react";
import { CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

interface ReconciliationProps {
  quoteAmount: number;
  poAmount: number;
  invoiceAmount: number;
  currency?: string;
}

export const ReconciliationCard: React.FC<ReconciliationProps> = ({
  quoteAmount,
  poAmount,
  invoiceAmount,
  currency = "$",
}) => {
  const isPoMatch = quoteAmount === poAmount;
  const isInvoiceMatch = poAmount === invoiceAmount;
  const difference = invoiceAmount - poAmount;
  const variancePercentage = ((difference / poAmount) * 100).toFixed(2);
  const isDiscrepancy = difference !== 0;

  return (
    <div className="p-6 rounded-xl border bg-[var(--bg-surface)] border-[var(--border-color)]">
      <div className="text-xs font-semibold text-[var(--text-muted)] tracking-wider uppercase mb-4">
        Reconciliation Pipeline
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Quote */}
        <div className="p-3 rounded-lg bg-[var(--bg-surface-alt)] border border-[var(--border-color)]">
          <span className="text-xs text-[var(--text-muted)] block">QUOTE</span>
          <span className="text-base font-mono font-semibold text-[var(--text-primary)]">
            {currency}{quoteAmount.toLocaleString()}
          </span>
          <div className="mt-2 flex items-center text-xs text-[var(--success)]">
            <CheckCircle2 className="w-4 h-4 mr-1" /> Validated
          </div>
        </div>

        {/* Purchase Order */}
        <div className="p-3 rounded-lg bg-[var(--bg-surface-alt)] border border-[var(--border-color)]">
          <span className="text-xs text-[var(--text-muted)] block">PURCHASE ORDER</span>
          <span className="text-base font-mono font-semibold text-[var(--text-primary)]">
            {currency}{poAmount.toLocaleString()}
          </span>
          <div className="mt-2 flex items-center text-xs" style={{ color: isPoMatch ? "var(--success)" : "var(--warning)" }}>
            {isPoMatch ? <CheckCircle2 className="w-4 h-4 mr-1" /> : <AlertTriangle className="w-4 h-4 mr-1" />}
            {isPoMatch ? "Matched" : "PO Variance"}
          </div>
        </div>

        {/* Invoice */}
        <div className="p-3 rounded-lg bg-[var(--bg-surface-alt)] border border-[var(--border-color)]">
          <span className="text-xs text-[var(--text-muted)] block">INVOICE</span>
          <span className="text-base font-mono font-semibold text-[var(--text-primary)]">
            {currency}{invoiceAmount.toLocaleString()}
          </span>
          <div className="mt-2 flex items-center text-xs" style={{ color: isInvoiceMatch ? "var(--success)" : "var(--danger)" }}>
            {isInvoiceMatch ? <CheckCircle2 className="w-4 h-4 mr-1" /> : <AlertTriangle className="w-4 h-4 mr-1" />}
            {isInvoiceMatch ? "Matched" : "Discrepancy"}
          </div>
        </div>
      </div>

      {/* Discrepancy Breakdown Footer */}
      {isDiscrepancy && (
        <div className="mt-6 pt-4 border-t border-[var(--border-color)] flex flex-wrap justify-between items-center gap-4">
          <div>
            <div className="text-xs text-[var(--text-muted)]">Variance Details</div>
            <div className="text-sm font-mono font-semibold text-[var(--danger)]">
              Difference: {difference > 0 ? "+" : ""}{currency}{difference.toLocaleString()} ({difference > 0 ? "+" : ""}{variancePercentage}%)
            </div>
          </div>
          <div 
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold"
            style={{ backgroundColor: "var(--danger-soft)", color: "var(--danger)" }}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>PRICE DISCREPANCY DETECTED</span>
          </div>
        </div>
      )}
    </div>
  );
};