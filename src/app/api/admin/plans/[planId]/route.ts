import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth/requireAdmin";
import { getPlanDetailsService, deletePlanService } from "@/server/services/planService";
import { handleApiError } from "@/server/utils/errors";

interface RouteParams {
  params: Promise<{ planId: string }>;
}

/**
 * GET /api/admin/plans/[planId]
 * Retrieve plan details with validation issues and summary.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin(request);
    const { planId } = await params;

    const details = await getPlanDetailsService(planId);
    return NextResponse.json(details, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/admin/plans/[planId]
 * Delete a plan.
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin(request);
    const { planId } = await params;

    const result = await deletePlanService(planId);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
