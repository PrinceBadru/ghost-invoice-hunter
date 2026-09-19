import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, signSession, SESSION_COOKIE } from "@/lib/auth";

// Creates a brand-new closed environment plus its master account in one
// step. This is the ONLY way an environment comes into existence — there
// is no "join an existing environment" signup path, by design.
const schema = z.object({
  environmentName: z.string().min(2),
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }
  const { environmentName, name, email, password } = parsed.data;

  const normalizedEmail = email.toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    return NextResponse.json({ error: "An account with that email already exists" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);

  const { environment, masterUser } = await prisma.$transaction(async (tx) => {
    const environment = await tx.environment.create({
      data: {
        name: environmentName,
        users: {
          create: { name, email: normalizedEmail, passwordHash, role: "MASTER" },
        },
      },
      include: { users: true },
    });

    const masterUser = environment.users[0];

    await tx.auditLog.create({
      data: {
        environmentId: environment.id,
        userId: masterUser.id,
        action: `Environment "${environment.name}" created`,
        reason: `${masterUser.name} signed up as master account`,
      },
    });

    return { environment, masterUser };
  });

  const token = await signSession({
    userId: masterUser.id,
    environmentId: environment.id,
    role: masterUser.role,
  });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
