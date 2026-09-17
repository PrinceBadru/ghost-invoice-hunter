import { AlertTriangle, ShieldCheck } from "lucide-react";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export default async function VendorsPage() {
  const user = await requireUser();

  const businesses = await prisma.business.findMany({
    where: { environmentId: user.environmentId },
    include: {
      documents: { where: { type: "INVOICE" }, select: { totalAmount: true, status: true } },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-display font-bold text-[var(--text-primary)]">Vendors</h1>
        <p className="text-xs text-[var(--text-secondary)]">
          Businesses tracked in this environment, discrepancy risk, and historical billing volume.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {businesses.length === 0 && (
          <p className="text-xs text-[var(--text-muted)] col-span-full p-6 text-center rounded-xl border border-dashed border-[var(--border-color)]">
            No businesses tracked yet.
          </p>
        )}
        {businesses.map((vendor) => {
          const invoiceCount = vendor.documents.length;
          const totalVolume = vendor.documents.reduce((acc, d) => acc + d.totalAmount, 0);
          const discrepancies = vendor.documents.filter((d) => d.status !== "Matched" && d.status !== "Processing").length;

          return (
            <div
              key={vendor.id}
              className="p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-4 hover:border-[var(--color-primary)] transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-semibold text-sm text-[var(--text-primary)]">{vendor.name}</h2>
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">{vendor.vendorCode}</span>
                </div>
                {discrepancies > 0 ? (
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
                  <div className="text-[var(--text-primary)]">{invoiceCount} processed</div>
                </div>
                <div>
                  <div className="text-[10px] text-[var(--text-muted)] uppercase">Total Volume</div>
                  <div className="font-semibold text-[var(--text-primary)]">
                    ${totalVolume.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
