import { NextResponse } from "next/server";
import { getLatestActivePlan } from "@/server/db/queries/plans";
import { handleApiError } from "@/server/utils/errors";

/**
 * GET /api/plans/latest
 * Public endpoint to fetch date, session and metadata of the latest active plan.
 */
export async function GET() {
  try {
    const latestPlan = await getLatestActivePlan();
    return NextResponse.json({ latestPlan }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
