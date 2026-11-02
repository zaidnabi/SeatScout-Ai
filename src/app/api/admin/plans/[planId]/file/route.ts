import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth/requireAdmin";
import { getPlanFileService } from "@/server/services/planService";
import { handleApiError } from "@/server/utils/errors";

interface RouteParams {
  params: Promise<{ planId: string }>;
}

/**
 * GET /api/admin/plans/[planId]/file
 * Returns the original PDF bytes for inline display in PDF viewer.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin(request);
    const { planId } = await params;

    const file = await getPlanFileService(planId);

    return new NextResponse(file.fileData, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${file.filename}"`,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
