import { NextRequest, NextResponse } from "next/server";
import { searchSchema } from "@/lib/schemas";
import { searchSeatsByRoll } from "@/server/services/searchService";
import { handleApiError } from "@/server/utils/errors";

/**
 * GET /api/search?roll=F23605033
 * Seat lookup by roll number across ACTIVE plans.
 * Returns 200 with an empty array if unknown roll.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = searchSchema.parse({
      roll: searchParams.get("roll"),
    });

    const results = await searchSeatsByRoll(parsed.roll);
    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
