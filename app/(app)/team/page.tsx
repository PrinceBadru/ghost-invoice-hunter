import { UserCheck } from "lucide-react";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { ROLES_THAT_CAN_MANAGE_USERS } from "@/lib/types";
import { AddUserForm } from "@/components/forms/AddUserForm";

export default async function TeamPage() {
  const user = await requireUser();

  const members = await prisma.user.findMany({
    where: { environmentId: user.environmentId },
    include: { _count: { select: { documents: true } } },
    orderBy: { createdAt: "asc" },
  });

  const canManage = ROLES_THAT_CAN_MANAGE_USERS.includes(user.role as any);

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-[var(--text-primary)]">Team Members</h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Everyone in this environment, their role, and documents uploaded.
          </p>
        </div>
        {canManage && <AddUserForm />}
      </div>

      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[var(--border-color)] bg-[var(--bg-surface-alt)] text-[var(--text-muted)] font-mono">
              <th className="p-3 font-medium">MEMBER</th>
              <th className="p-3 font-medium">ROLE</th>
              <th className="p-3 font-medium text-right">DOCUMENTS UPLOADED</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-[var(--bg-surface-alt)] transition-colors">
                <td className="p-3">
                  <div className="font-semibold text-[var(--text-primary)]">{member.name}</div>
                  <div className="text-[10px] font-mono text-[var(--text-muted)]">{member.email}</div>
                </td>
                <td className="p-3 text-[var(--text-secondary)]">
                  <span className="inline-flex items-center gap-1 text-[11px] text-[var(--success)]">
                    <UserCheck className="w-3.5 h-3.5" /> {member.role}
                  </span>
                </td>
                <td className="p-3 text-right font-mono font-semibold text-[var(--text-primary)]">
                  {member._count.documents}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
