import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth/requireAdmin";
import { getAuditLogsService } from "@/server/services/auditService";
import { handleApiError } from "@/server/utils/errors";

/**
 * GET /api/admin/audit
 * Retrieve recent audit logs.
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 100;

    const logs = await getAuditLogsService(limit);
    return NextResponse.json(logs, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
