import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { hashPassword } from "@/lib/auth";
import { ROLES_THAT_CAN_MANAGE_USERS } from "@/lib/types";

// A master/admin account creates a user directly bound to ITS OWN
// environment_id — there is no cross-environment invite to model, because
// a user can never belong to more than one environment.
const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["ADMIN", "UPLOADER", "VIEWER"]),
});

export async function POST(req: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!ROLES_THAT_CAN_MANAGE_USERS.includes(currentUser.role as any)) {
    return NextResponse.json(
      { error: "Only master or admin accounts can add users" },
      { status: 403 },
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }
  const { name, email, password, role } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "An account with that email already exists" },
      { status: 409 },
    );
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role,
      environmentId: currentUser.environmentId,
    },
  });

  await prisma.auditLog.create({
    data: {
      environmentId: currentUser.environmentId,
      userId: currentUser.id,
      action: `Added user ${name} (${role})`,
    },
  });

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
}
