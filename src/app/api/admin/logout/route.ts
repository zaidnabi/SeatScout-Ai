import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth/requireAdmin";
import { ADMIN_COOKIE_NAME } from "@/lib/constants";
import { handleApiError } from "@/server/utils/errors";

/**
 * POST /api/admin/logout
 * Clears the admin session cookie.
 */
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);

    const response = NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 }
    );

    response.cookies.delete(ADMIN_COOKIE_NAME);

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
