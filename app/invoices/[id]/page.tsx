import React from "react";
import { MOCK_INVOICES, MOCK_AUDIT_TRAIL } from "@/lib/data";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ReconciliationCard } from "@/components/reconciliation/ReconciliationCard";
import { ActivityTimeline } from "@/components/audit/ActivityTimeline";
import { FileText, ArrowLeft, Download, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const invoice = MOCK_INVOICES.find((inv) => inv.id === id) || MOCK_INVOICES[0];

  return (
    <div className="p-8 space-y-6 max-w-6xl mx-auto">
      {/* Navigation Back */}
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Overview
      </Link>

      {/* Invoice Header */}
      <div className="flex flex-wrap justify-between items-start gap-4 p-6 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-mono font-bold text-[var(--text-primary)]">{invoice.invoiceNumber}</h1>
            <StatusBadge status={invoice.status} severity={invoice.severity} />
          </div>
          <p className="text-xs text-[var(--text-secondary)]">Vendor: <span className="font-semibold text-[var(--text-primary)]">{invoice.vendor}</span> ({invoice.vendorId})</p>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-xs border border-[var(--border-color)] rounded-md hover:bg-[var(--bg-surface-alt)] flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> Export PDF
          </button>
          <button className="px-3 py-1.5 text-xs rounded-md bg-[var(--danger)] text-white hover:opacity-90 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" /> Reject
          </button>
          <button className="px-3 py-1.5 text-xs rounded-md bg-[var(--success)] text-white hover:opacity-90 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> Approve
          </button>
        </div>
      </div>

      {/* Discrepancy Score Explanation (Rule 23) */}
      {invoice.discrepancyScore > 0 && (
        <div className="p-4 rounded-xl border border-[var(--danger)] bg-[var(--danger-soft)] flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[var(--danger)] uppercase tracking-wider">Discrepancy Score</span>
            <div className="text-xs text-[var(--text-primary)]">
              {invoice.scoreReasons.map((reason, idx) => (
                <div key={idx}>• {reason}</div>
              ))}
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-display font-bold text-[var(--danger)] font-mono">{invoice.discrepancyScore}</div>
            <span className="text-[10px] font-bold uppercase text-[var(--danger)]">{invoice.severity} RISK</span>
          </div>
        </div>
      )}

      {/* Signature Reconciliation Pipeline (Rule 21) */}
      <ReconciliationCard
        quoteAmount={invoice.quoteAmount}
        poAmount={invoice.poAmount}
        invoiceAmount={invoice.invoiceAmount}
      />

      {/* Details & Audit Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Linked Documents */}
          <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Associated Documents</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3 border border-[var(--border-color)] rounded-lg bg-[var(--bg-surface-alt)] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[var(--color-primary)]" />
                <div>
                  <div className="text-[10px] text-[var(--text-muted)]">QUOTE</div>
                  <div>{invoice.quoteNumber}</div>
                </div>
              </div>
              <div className="p-3 border border-[var(--border-color)] rounded-lg bg-[var(--bg-surface-alt)] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[var(--color-primary)]" />
                <div>
                  <div className="text-[10px] text-[var(--text-muted)]">PURCHASE ORDER</div>
                  <div>{invoice.poNumber}</div>
                </div>
              </div>
              <div className="p-3 border border-[var(--border-color)] rounded-lg bg-[var(--bg-surface-alt)] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[var(--color-primary)]" />
                <div>
                  <div className="text-[10px] text-[var(--text-muted)]">INVOICE FILE</div>
                  <div>{invoice.invoiceNumber}.pdf</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Audit History */}
        <div>
          <ActivityTimeline activities={MOCK_AUDIT_TRAIL} />
        </div>
      </div>
    </div>
  );
}