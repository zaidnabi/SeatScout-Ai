import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/constants";
import { verifyAdminToken } from "./session";
import { UnauthorizedError } from "@/server/utils/errors";
import { JWTPayload } from "jose";

export interface AdminAuthResult {
  isAdmin: true;
  payload: JWTPayload;
}

/**
 * Task 3: Defense-in-depth admin authorization check.
 * Called inside every admin API handler.
 */
export async function requireAdmin(request?: NextRequest): Promise<AdminAuthResult> {
  let token: string | undefined;

  if (request) {
    token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    // Also check Authorization header as fallback (Bearer <token>)
    if (!token) {
      const authHeader = request.headers.get("authorization");
      if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
        token = authHeader.substring(7).trim();
      }
    }
  } else {
    const cookieStore = await cookies();
    token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  }

  if (!token) {
    throw new UnauthorizedError("Admin authorization required. Please log in.");
  }

  const payload = await verifyAdminToken(token);
  if (!payload || payload.sub !== "admin") {
    throw new UnauthorizedError("Invalid or expired session. Please log in again.");
  }

  return { isAdmin: true, payload };
}
