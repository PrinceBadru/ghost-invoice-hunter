import React from "react";
import { BarChart3, TrendingUp, DollarSign, AlertOctagon, Download } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-[var(--text-primary)]">
            Operational Reports
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Financial exposure summaries, variance leakage, and reconciliation throughput.
          </p>
        </div>
        <button className="px-3 py-1.5 text-xs rounded-md border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-alt)] inline-flex items-center gap-1.5 font-medium">
          <Download className="w-3.5 h-3.5" /> Export Audit Summary
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-1">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-[10px] font-mono uppercase">Prevented Leakage</span>
            <DollarSign className="w-4 h-4 text-[var(--success)]" />
          </div>
          <div className="text-2xl font-display font-bold text-[var(--text-primary)]">$7,350.00</div>
          <div className="text-[10px] text-[var(--success)] font-mono">+12.4% vs last month</div>
        </div>

        <div className="p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-1">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-[10px] font-mono uppercase">Discrepancy Rate</span>
            <AlertOctagon className="w-4 h-4 text-[var(--danger)]" />
          </div>
          <div className="text-2xl font-display font-bold text-[var(--text-primary)]">4.2%</div>
          <div className="text-[10px] text-[var(--text-muted)] font-mono">23 invoices flagged</div>
        </div>

        <div className="p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-1">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-[10px] font-mono uppercase">Avg Resolution Time</span>
            <TrendingUp className="w-4 h-4 text-[var(--color-primary)]" />
          </div>
          <div className="text-2xl font-display font-bold text-[var(--text-primary)]">1.4 Hrs</div>
          <div className="text-[10px] text-[var(--success)] font-mono">-18 mins faster</div>
        </div>
      </div>

      {/* Structured Analytics Box */}
      <div className="p-6 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-4">
        <h2 className="text-sm font-semibold text-[var(--text-primary)]">Variance Breakdown by Category</h2>
        <div className="space-y-3 font-mono text-xs">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[var(--text-secondary)]">Price Discrepancy (&gt;5% Variance)</span>
              <span className="font-bold text-[var(--danger)]">68%</span>
            </div>
            <div className="w-full bg-[var(--bg-surface-alt)] h-2 rounded-full overflow-hidden">
              <div className="bg-[var(--danger)] h-full w-[68%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[var(--text-secondary)]">Unmatched Purchase Orders</span>
              <span className="font-bold text-[var(--warning)]">22%</span>
            </div>
            <div className="w-full bg-[var(--bg-surface-alt)] h-2 rounded-full overflow-hidden">
              <div className="bg-[var(--warning)] h-full w-[22%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[var(--text-secondary)]">Quantity Discrepancy</span>
              <span className="font-bold text-[var(--color-primary)]">10%</span>
            </div>
            <div className="w-full bg-[var(--bg-surface-alt)] h-2 rounded-full overflow-hidden">
              <div className="bg-[var(--color-primary)] h-full w-[10%]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}