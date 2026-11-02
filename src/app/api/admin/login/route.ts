import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/schemas";
import { verifyAdminPassword } from "@/server/auth/password";
import { signAdminToken, ADMIN_COOKIE_OPTIONS } from "@/server/auth/session";
import { handleApiError, UnauthorizedError } from "@/server/utils/errors";

/**
 * POST /api/admin/login
 * Public admin authentication endpoint.
 * Sets an httpOnly, secure, sameSite session cookie.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = loginSchema.parse(body);

    const isValid = await verifyAdminPassword(password);
    if (!isValid) {
      throw new UnauthorizedError("Invalid admin password.");
    }

    const token = await signAdminToken();

    const response = NextResponse.json(
      { success: true, message: "Logged in successfully" },
      { status: 200 }
    );

    response.cookies.set(
      ADMIN_COOKIE_OPTIONS.name,
      token,
      ADMIN_COOKIE_OPTIONS
    );

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
