import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth/requireAdmin";
import { updatePlanSeat } from "@/server/services/planService";
import { updateSeatSchema } from "@/lib/schemas";
import { handleApiError } from "@/server/utils/errors";

interface RouteParams {
  params: Promise<{ planId: string; seatId: string }>;
}

/**
 * PATCH /api/admin/plans/[planId]/seats/[seatId]
 * Apply manual seat correction and re-run validation.
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin(request);
    const { planId, seatId } = await params;

    const body = await request.json();
    const validatedData = updateSeatSchema.parse(body);

    const result = await updatePlanSeat(planId, seatId, validatedData);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
