"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, CheckCircle2, AlertTriangle, PlusCircle } from "lucide-react";

interface BusinessOption {
  id: string;
  name: string;
  vendorCode: string;
}

const DOC_TYPES = [
  { value: "INVOICE", label: "Invoice" },
  { value: "PURCHASE_ORDER", label: "Purchase Order" },
  { value: "QUOTE", label: "Quote" },
];

export function UploadForm({ businesses }: { businesses: BusinessOption[] }) {
  const router = useRouter();
  const [type, setType] = useState("INVOICE");
  const [businessId, setBusinessId] = useState(businesses[0]?.id ?? "");
  const [reference, setReference] = useState("");
  const [linkedPoRef, setLinkedPoRef] = useState("");
  const [linkedQuoteRef, setLinkedQuoteRef] = useState("");
  const [documentDate, setDocumentDate] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ status: string; total: number; rowCount: number; reasons: string[] } | null>(null);

  // Inline "add a new business" — master/admin only in practice, enforced server-side.
  const [showNewBusiness, setShowNewBusiness] = useState(false);
  const [newBusinessName, setNewBusinessName] = useState("");
  const [newBusinessCode, setNewBusinessCode] = useState("");
  const [businessOptions, setBusinessOptions] = useState(businesses);
  const [businessError, setBusinessError] = useState<string | null>(null);

  async function handleAddBusiness(e: React.FormEvent) {
    e.preventDefault();
    setBusinessError(null);
    const res = await fetch("/api/businesses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newBusinessName, vendorCode: newBusinessCode }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setBusinessError(body.error ?? "Could not add business");
      return;
    }
    setBusinessOptions((prev) => [...prev, body]);
    setBusinessId(body.id);
    setShowNewBusiness(false);
    setNewBusinessName("");
    setNewBusinessCode("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Choose a file first");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    formData.append("businessId", businessId);
    formData.append("reference", reference);
    if (type === "INVOICE") formData.append("linkedPoRef", linkedPoRef);
    formData.append("linkedQuoteRef", linkedQuoteRef);
    if (documentDate) formData.append("documentDate", documentDate);

    const res = await fetch("/api/documents", { method: "POST", body: formData });
    const body = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setError(body.error ?? "Upload failed");
      return;
    }
    setResult(body);
    router.refresh();
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <form
        onSubmit={handleSubmit}
        className="p-6 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--text-secondary)]">Document type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-md border border-[var(--border-color)] bg-[var(--bg-surface-alt)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            >
              {DOC_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--text-secondary)]">Business</label>
            <div className="flex gap-1.5">
              <select
                value={businessId}
                onChange={(e) => setBusinessId(e.target.value)}
                required
                className="flex-1 px-3 py-2 text-sm rounded-md border border-[var(--border-color)] bg-[var(--bg-surface-alt)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              >
                <option value="" disabled>
                  Select...
                </option>
                {businessOptions.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowNewBusiness((v) => !v)}
                className="px-2 rounded-md border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--color-primary)]"
                title="Track a new business"
              >
                <PlusCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {showNewBusiness && (
          <div className="p-3 rounded-lg border border-dashed border-[var(--border-color)] space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input
                placeholder="Business name"
                value={newBusinessName}
                onChange={(e) => setNewBusinessName(e.target.value)}
                className="px-2 py-1.5 text-xs rounded border border-[var(--border-color)] bg-[var(--bg-surface-alt)]"
              />
              <input
                placeholder="Short code"
                value={newBusinessCode}
                onChange={(e) => setNewBusinessCode(e.target.value)}
                className="px-2 py-1.5 text-xs rounded border border-[var(--border-color)] bg-[var(--bg-surface-alt)]"
              />
            </div>
            {businessError && <p className="text-[11px] text-[var(--danger)]">{businessError}</p>}
            <button
              type="button"
              onClick={handleAddBusiness}
              className="text-xs font-medium text-[var(--color-primary)] hover:underline"
            >
              Add business
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--text-secondary)]">
              {type === "INVOICE" ? "Invoice number" : type === "PURCHASE_ORDER" ? "PO number" : "Quote reference"}
            </label>
            <input
              required
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-md border border-[var(--border-color)] bg-[var(--bg-surface-alt)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--text-secondary)]">Document date (optional)</label>
            <input
              type="date"
              value={documentDate}
              onChange={(e) => setDocumentDate(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-md border border-[var(--border-color)] bg-[var(--bg-surface-alt)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>
        </div>

        {type === "INVOICE" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-[var(--text-secondary)]">Matching PO number</label>
              <input
                value={linkedPoRef}
                onChange={(e) => setLinkedPoRef(e.target.value)}
                placeholder="e.g. PO-8825"
                className="w-full px-3 py-2 text-sm rounded-md border border-[var(--border-color)] bg-[var(--bg-surface-alt)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-[var(--text-secondary)]">Original quote ref (optional)</label>
              <input
                value={linkedQuoteRef}
                onChange={(e) => setLinkedQuoteRef(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-md border border-[var(--border-color)] bg-[var(--bg-surface-alt)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              />
            </div>
          </div>
        )}

        <div className="space-y-1">
          <label className="text-xs font-medium text-[var(--text-secondary)]">Spreadsheet file (.xlsx or .csv)</label>
          <label className="flex items-center gap-2 px-3 py-6 rounded-md border border-dashed border-[var(--border-color)] bg-[var(--bg-surface-alt)] text-xs text-[var(--text-secondary)] cursor-pointer hover:border-[var(--color-primary)] justify-center">
            <UploadCloud className="w-4 h-4" />
            {file ? file.name : "Click to choose a file"}
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>

        {error && (
          <p className="text-xs text-[var(--danger)] flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium rounded-md bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] disabled:opacity-60"
        >
          {loading ? "Processing..." : "Upload & process"}
        </button>
      </form>

      {result && (
        <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
            <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
            Parsed {result.rowCount} line item(s) — total ${result.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-[var(--text-secondary)]">Resulting status: <span className="font-semibold text-[var(--text-primary)]">{result.status}</span></div>
          {result.reasons.length > 0 && (
            <ul className="text-xs text-[var(--text-muted)] list-disc pl-4 space-y-0.5">
              {result.reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
