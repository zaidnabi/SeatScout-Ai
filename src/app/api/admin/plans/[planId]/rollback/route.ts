import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth/requireAdmin";
import { rollbackPlanService } from "@/server/services/planService";
import { handleApiError } from "@/server/utils/errors";

interface RouteParams {
  params: Promise<{ planId: string }>;
}

/**
 * POST /api/admin/plans/[planId]/rollback
 * Roll back an archived plan to active status.
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin(request);
    const { planId } = await params;

    const rolledBack = await rollbackPlanService(planId);
    return NextResponse.json(rolledBack, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
