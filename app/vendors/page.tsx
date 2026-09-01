import React from "react";
import { MOCK_INVOICES } from "@/lib/data";
import { AlertTriangle, ShieldCheck } from "lucide-react";

export default function VendorsPage() {
  const vendors = Array.from(new Set(MOCK_INVOICES.map((inv) => inv.vendor))).map((vendorName) => {
    const vendorInvoices = MOCK_INVOICES.filter((i) => i.vendor === vendorName);
    const totalVolume = vendorInvoices.reduce((acc, curr) => acc + curr.invoiceAmount, 0);
    const discrepancies = vendorInvoices.filter((i) => i.discrepancyScore > 0).length;
    const vendorId = vendorInvoices[0].vendorId;

    return {
      name: vendorName,
      id: vendorId,
      invoiceCount: vendorInvoices.length,
      totalVolume,
      discrepancies,
    };
  });

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-display font-bold text-[var(--text-primary)]">
          Vendors
        </h1>
        <p className="text-xs text-[var(--text-secondary)]">
          Supplier directory, discrepancy risk ratings, and historical billing volume.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {vendors.map((vendor) => (
          <div
            key={vendor.id}
            className="p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-4 hover:border-[var(--color-primary)] transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-semibold text-sm text-[var(--text-primary)]">{vendor.name}</h2>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">{vendor.id}</span>
              </div>
              {vendor.discrepancies > 0 ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--danger-soft)] text-[var(--danger)]">
                  <AlertTriangle className="w-3 h-3" /> Flagged
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--success-soft)] text-[var(--success)]">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-[var(--border-color)]">
              <div>
                <div className="text-[10px] text-[var(--text-muted)] uppercase">Invoices</div>
                <div className="text-[var(--text-primary)]">{vendor.invoiceCount} processed</div>
              </div>
              <div>
                <div className="text-[10px] text-[var(--text-muted)] uppercase">Total Volume</div>
                <div className="font-semibold text-[var(--text-primary)]">
                  ${vendor.totalVolume.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}