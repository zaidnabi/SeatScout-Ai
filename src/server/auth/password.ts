import bcrypt from "bcryptjs";
import { env } from "@/server/utils/env";

/**
 * Task 3: Compare candidate password against the configured admin bcrypt hash.
 */
export async function verifyAdminPassword(password: string): Promise<boolean> {
  if (!password || typeof password !== "string") {
    return false;
  }
  return await bcrypt.compare(password, env.ADMIN_PASSWORD_HASH);
}

/**
 * Utility to hash a password using bcrypt.
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}
