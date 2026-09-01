import React from "react";
import { UserCheck } from "lucide-react";

export default function TeamPage() {
  const teamMembers = [
    { name: "Sarah K.", role: "Senior Financial Analyst", status: "Active", reviewsCount: 42, email: "sarah.k@company.com" },
    { name: "David M.", role: "Reconciliation Specialist", status: "Active", reviewsCount: 89, email: "david.m@company.com" },
    { name: "System Auto-Import", role: "Automated Agent", status: "System", reviewsCount: 1204, email: "bot@system.internal" },
  ];

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-display font-bold text-[var(--text-primary)]">
          Team Members
        </h1>
        <p className="text-xs text-[var(--text-secondary)]">
          Operator attribution, review quotas, and access control permissions.
        </p>
      </div>

      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[var(--border-color)] bg-[var(--bg-surface-alt)] text-[var(--text-muted)] font-mono">
              <th className="p-3 font-medium">MEMBER</th>
              <th className="p-3 font-medium">ROLE</th>
              <th className="p-3 font-medium text-right">REVIEWS PROCESSED</th>
              <th className="p-3 font-medium">ACCOUNT STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {teamMembers.map((member) => (
              <tr key={member.email} className="hover:bg-[var(--bg-surface-alt)] transition-colors">
                <td className="p-3">
                  <div className="font-semibold text-[var(--text-primary)]">{member.name}</div>
                  <div className="text-[10px] font-mono text-[var(--text-muted)]">{member.email}</div>
                </td>
                <td className="p-3 text-[var(--text-secondary)]">{member.role}</td>
                <td className="p-3 text-right font-mono font-semibold text-[var(--text-primary)]">
                  {member.reviewsCount}
                </td>
                <td className="p-3 font-mono">
                  <span className="inline-flex items-center gap-1 text-[11px] text-[var(--success)]">
                    <UserCheck className="w-3.5 h-3.5" /> {member.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}