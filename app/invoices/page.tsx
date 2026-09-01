"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MOCK_INVOICES, InvoiceRecord } from "@/lib/data";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Search, Filter, ArrowUpDown, Eye } from "lucide-react";

export default function InvoicesPage() {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  const filteredInvoices = MOCK_INVOICES.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.vendor.toLowerCase().includes(search.toLowerCase()) ||
      inv.poNumber.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      selectedStatus === "ALL" || inv.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-[var(--text-primary)]">
            Invoices
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Manage and inspect incoming vendor invoices across all statuses.
          </p>
        </div>
      </div>

      {/* Control Bar: Search & Quick Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search invoice #, vendor, or PO..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-md border border-[var(--border-color)] bg-[var(--bg-surface-alt)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
          {["ALL", "Matched", "Needs Review", "Discrepancy"].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1 text-xs rounded-full border transition-colors whitespace-nowrap ${
                selectedStatus === status
                  ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] font-medium"
                  : "border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-alt)]"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Invoice Data Table */}
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-[var(--bg-surface-alt)] text-[var(--text-muted)] font-mono">
                <th className="p-3 font-medium">INVOICE</th>
                <th className="p-3 font-medium">VENDOR</th>
                <th className="p-3 font-medium">DATE</th>
                <th className="p-3 font-medium text-right">PO AMOUNT</th>
                <th className="p-3 font-medium text-right">INVOICE AMOUNT</th>
                <th className="p-3 font-medium">STATUS</th>
                <th className="p-3 font-medium text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {filteredInvoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="hover:bg-[var(--bg-surface-alt)] transition-colors"
                >
                  <td className="p-3 font-mono font-semibold text-[var(--text-primary)]">
                    {inv.invoiceNumber}
                  </td>
                  <td className="p-3 text-[var(--text-primary)]">
                    <div>{inv.vendor}</div>
                    <div className="text-[10px] text-[var(--text-muted)] font-mono">
                      {inv.vendorId}
                    </div>
                  </td>
                  <td className="p-3 text-[var(--text-secondary)] font-mono">
                    {inv.invoiceDate}
                  </td>
                  <td className="p-3 text-right font-mono text-[var(--text-secondary)]">
                    ${inv.poAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-3 text-right font-mono font-semibold text-[var(--text-primary)]">
                    ${inv.invoiceAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-3">
                    <StatusBadge status={inv.status} severity={inv.severity} />
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/invoices/${inv.id}`}
                      className="inline-flex items-center gap-1 text-xs text-[var(--color-primary)] hover:underline font-medium"
                    >
                      <Eye className="w-3.5 h-3.5" /> View
                    </Link>
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