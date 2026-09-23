"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export function InvoiceActions({ invoiceId }: { invoiceId: string }) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState<"RESOLVE" | "REJECT" | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOpen = (type: "RESOLVE" | "REJECT") => {
    setActionType(type);
    setModalOpen(true);
    setError("");
    setNote("");
  };

  const handleClose = () => {
    if (loading) return;
    setModalOpen(false);
    setActionType(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) {
      setError("Please provide a note or reason.");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/documents/${invoiceId}/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: actionType, note }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to process resolution");

      setModalOpen(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleOpen("RESOLVE")}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-[var(--success-soft)] text-[var(--success)] border border-[var(--success)] hover:bg-[var(--success)] hover:text-white transition-colors"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Mark as Resolved
        </button>
        <button
          onClick={() => handleOpen("REJECT")}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-[var(--danger-soft)] text-[var(--danger)] border border-[var(--danger)] hover:bg-[var(--danger)] hover:text-white transition-colors"
        >
          <XCircle className="w-3.5 h-3.5" />
          Reject
        </button>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--bg-surface)] rounded-xl border border-[var(--border-color)] shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-[var(--border-color)]">
              <h3 className="font-display font-semibold text-[var(--text-primary)]">
                {actionType === "RESOLVE" ? "Resolve Discrepancy" : "Reject Invoice"}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[var(--text-secondary)]">
                  Resolution Note <span className="text-[var(--danger)]">*</span>
                </label>
                <textarea
                  autoFocus
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={
                    actionType === "RESOLVE" 
                      ? "Explain how this discrepancy was cleared..." 
                      : "Reason for rejection..."
                  }
                  className="w-full h-24 p-2 text-sm rounded-md border border-[var(--border-color)] bg-[var(--bg-surface-alt)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                />
              </div>

              {error && (
                <div className="text-xs text-[var(--danger)] font-medium bg-[var(--danger-soft)] p-2 rounded">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="px-4 py-2 text-xs font-medium rounded-md text-[var(--text-secondary)] hover:bg-[var(--bg-surface-alt)] transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 text-xs font-medium rounded-md text-white transition-colors flex items-center gap-2 disabled:opacity-50 ${
                    actionType === "RESOLVE" 
                      ? "bg-[var(--success)] hover:bg-[var(--success)]/90" 
                      : "bg-[var(--danger)] hover:bg-[var(--danger)]/90"
                  }`}
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {actionType === "RESOLVE" ? "Submit Resolution" : "Confirm Rejection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
