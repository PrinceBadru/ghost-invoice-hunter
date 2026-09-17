import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { AuditLogClient } from "@/components/audit/AuditLogClient";
import type { AuditEntry } from "@/lib/types";

export default async function AuditLogPage() {
  const user = await requireUser();

  const entries = await prisma.auditLog.findMany({
    where: { environmentId: user.environmentId },
    include: { user: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const logs: AuditEntry[] = entries.map((e) => ({
    id: e.id,
    time: e.createdAt.toISOString().slice(11, 16),
    user: e.user?.name ?? "System",
    action: e.action,
    detail: e.detail ?? undefined,
    reason: e.reason ?? undefined,
  }));

  return <AuditLogClient logs={logs} />;
}
