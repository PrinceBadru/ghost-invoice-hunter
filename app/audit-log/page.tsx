"use client";

import React, { useState } from "react";
import { MOCK_AUDIT_TRAIL } from "@/lib/data";
import { History, Search, Shield, Filter, User } from "lucide-react";

export default function AuditLogPage() {
  const [search, setSearch] = useState("");

  const logs = [
    ...MOCK_AUDIT_TRAIL,
    {
      id: "5",
      time: "15:18",
      user: "David M.",
      action: "Approved invoice INV-10492",
      reason: "Manual review cleared 7.08% variance after manager sign-off.",
    },
    {
      id: "6",
      time: "16:05",
      user: "Sarah K.",
      action: "Updated baseline PO-8825",
      detail: "Adjusted threshold ceiling to $25,000.00",
    },
    {
      id: "7",
      time: "16:40",
      user: "System",
      action: "System Insight Generated",
      reason: "Vendor 'Global Cloud Services' flagged for recurring price discrepancies.",
    },
  ];

  const filteredLogs = logs.filter(
    (log) =>
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      (log.reason && log.reason.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-[var(--text-primary)]">
          Audit Log
        </h1>
        <p className="text-xs text-[var(--text-secondary)]">
          Immutable historical system trail tracking user actions, automated flags, and approvals.
        </p>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Filter by actor, action, or reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-md border border-[var(--border-color)] bg-[var(--bg-surface-alt)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          />
        </div>
        <div className="text-xs font-mono text-[var(--text-muted)] flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-[var(--success)]" /> Logs Encrypted & Signed
        </div>
      </div>

      {/* Activity Log Feed */}
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] overflow-hidden">
        <div className="divide-y divide-[var(--border-color)]">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-4 hover:bg-[var(--bg-surface-alt)] transition-colors space-y-1.5"
            >
              <div className="flex items-center justify-between font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[var(--text-primary)] inline-flex items-center gap-1">
                    <User className="w-3 h-3 text-[var(--color-primary)]" />
                    {log.user}
                  </span>
                  <span className="text-[var(--text-muted)]">•</span>
                  <span className="text-[var(--text-secondary)]">{log.action}</span>
                </div>
                <span className="text-[var(--text-muted)]">{log.time}</span>
              </div>

              {log.detail && (
                <p className="text-xs text-[var(--text-secondary)] pl-5">
                  {log.detail}
                </p>
              )}

              {log.reason && (
                <div className="ml-5 p-2 rounded bg-[var(--bg-surface-alt)] border border-[var(--border-color)] font-mono text-[11px] text-[var(--text-muted)]">
                  <span className="font-semibold text-[var(--text-primary)]">Reason: </span>
                  {log.reason}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}