import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { comparePassword, signSession, SESSION_COOKIE } from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const loginAttempts = new Map<string, { count: number; timestamp: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const { email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  // Rate limiting check
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const rateLimitKey = `${ip}:${normalizedEmail}`;
  const attemptInfo = loginAttempts.get(rateLimitKey);

  if (attemptInfo) {
    if (Date.now() - attemptInfo.timestamp < LOCKOUT_DURATION) {
      if (attemptInfo.count >= MAX_ATTEMPTS) {
        return NextResponse.json(
          { error: "Too many login attempts. Please try again later." },
          { status: 429 },
        );
      }
    } else {
      // Reset if lockout duration has passed
      loginAttempts.delete(rateLimitKey);
    }
  }

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user || !(await comparePassword(password, user.passwordHash))) {
    // Record failed attempt
    const currentCount = loginAttempts.get(rateLimitKey)?.count || 0;
    loginAttempts.set(rateLimitKey, {
      count: currentCount + 1,
      timestamp: Date.now(),
    });

    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 },
    );
  }

  // Clear failed attempts on successful login
  loginAttempts.delete(rateLimitKey);

  const token = await signSession({
    userId: user.id,
    environmentId: user.environmentId,
    role: user.role,
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
