import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { env } from "@/server/utils/env";
import { ADMIN_COOKIE_NAME, JWT_EXPIRY } from "@/lib/constants";

function getSecretKey(): Uint8Array {
  return new TextEncoder().encode(env.JWT_SECRET);
}

export const ADMIN_COOKIE_OPTIONS = {
  name: ADMIN_COOKIE_NAME,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
};

/**
 * Task 3: Sign a JWT for the admin session using jose.
 */
export async function signAdminToken(payload: Record<string, unknown> = {}): Promise<string> {
  const secretKey = getSecretKey();

  return await new SignJWT({ ...payload, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject("admin")
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .sign(secretKey);
}

/**
 * Task 3: Verify an admin JWT token using jose.
 * Returns payload if valid, null if expired or malformed.
 */
export async function verifyAdminToken(token: string): Promise<JWTPayload | null> {
  if (!token || typeof token !== "string") {
    return null;
  }

  try {
    const secretKey = getSecretKey();
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch {
    return null;
  }
}
