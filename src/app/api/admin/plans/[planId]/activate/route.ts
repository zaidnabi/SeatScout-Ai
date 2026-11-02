import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth/requireAdmin";
import { activatePlanService } from "@/server/services/planService";
import { handleApiError } from "@/server/utils/errors";

interface RouteParams {
  params: Promise<{ planId: string }>;
}

/**
 * POST /api/admin/plans/[planId]/activate
 * Refuses if any errors remain, activates plan in one transaction, writes audit log.
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin(request);
    const { planId } = await params;

    const activated = await activatePlanService(planId);
    return NextResponse.json(activated, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
