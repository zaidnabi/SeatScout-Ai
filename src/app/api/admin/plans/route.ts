import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth/requireAdmin";
import { listPlansService, uploadAndParsePlan } from "@/server/services/planService";
import { BadRequestError, handleApiError } from "@/server/utils/errors";

/**
 * GET /api/admin/plans?status=draft|active|archived
 * List all plans.
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || undefined;

    const plans = await listPlansService(status);
    return NextResponse.json(plans, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/admin/plans
 * Upload seating plan PDF, parse spatial grid, save as draft, return planId and issues.
 */
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      throw new BadRequestError("A PDF file must be provided in the 'file' form field.");
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadAndParsePlan(fileBuffer, file.name, file.type);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
