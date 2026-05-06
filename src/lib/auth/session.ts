import "server-only";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import type { SessionPayload } from "./schema";

export const SESSION_COOKIE = "supportnest_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function getEncodedKey(): Uint8Array {
  const secret = process.env.SUPPORTNEST_SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "SUPPORTNEST_SESSION_SECRET is not set. Generate one with `openssl rand -base64 32` and add to .env.local."
    );
  }
  if (secret.length < 32) {
    throw new Error(
      "SUPPORTNEST_SESSION_SECRET must be at least 32 characters."
    );
  }
  return new TextEncoder().encode(secret);
}

export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getEncodedKey());
}

export async function decrypt(
  token: string | undefined
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getEncodedKey(), {
      algorithms: ["HS256"],
    });
    if (
      typeof payload.userId !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.expiresAt !== "string"
    ) {
      return null;
    }
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

export async function createSession(userId: string, email: string) {
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  const token = await encrypt({
    userId,
    email,
    expiresAt: expiresAt.toISOString(),
  });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

export async function deleteSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function readSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return decrypt(token);
}
