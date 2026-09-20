import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { ROLES_THAT_CAN_MANAGE_SETTINGS } from "@/lib/types";

const schema = z.object({
  toleranceThreshold: z.number().min(0).max(100),
});

export async function PATCH(req: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!ROLES_THAT_CAN_MANAGE_SETTINGS.includes(currentUser.role as any)) {
    return NextResponse.json(
      { error: "Only master or admin accounts can change settings" },
      { status: 403 },
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  await prisma.environment.update({
    where: { id: currentUser.environmentId },
    data: { toleranceThreshold: parsed.data.toleranceThreshold },
  });

  await prisma.auditLog.create({
    data: {
      environmentId: currentUser.environmentId,
      userId: currentUser.id,
      action: `Updated price variance tolerance to ${parsed.data.toleranceThreshold}%`,
    },
  });

  return NextResponse.json({ ok: true });
}
