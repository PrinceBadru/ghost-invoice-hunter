import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Server-only: reads the session cookie, verifies it, and loads the full
// user + environment from the database. Safe to call from Server Components
// and Route Handlers; never import this from middleware.ts (Edge Runtime
// can't use the Prisma/SQLite client).
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const payload = await verifySession(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    include: { environment: true },
  });

  return user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireApiRole(allowedRoles: string[]) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } }) };
  }
  if (!allowedRoles.includes(user.role)) {
    return { error: new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { "Content-Type": "application/json" } }) };
  }
  return { user };
}
