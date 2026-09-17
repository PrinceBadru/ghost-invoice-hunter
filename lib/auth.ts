import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

// Kept dependency-light and edge-runtime compatible (uses `jose`, not
// `jsonwebtoken`) because this file is imported from middleware.ts, which
// runs on the Edge Runtime. Do NOT import Prisma or Node-only APIs here.

export const SESSION_COOKIE = "gih_session";

export interface SessionPayload {
  userId: string;
  environmentId: string;
  role: string;
  [key: string]: unknown;
}

function getSecret() {
  const secret = process.env.JWT_SECRET || "dev-secret-change-me-before-production";
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
