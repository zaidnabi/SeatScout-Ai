import { NextRequest, NextResponse } from "next/server";
import { env } from "@/server/utils/env";
import { db } from "@/server/db/client";
import { plans } from "@/server/db/schema";
import { and, eq, lt, sql } from "drizzle-orm";
import { handleApiError, UnauthorizedError } from "@/server/utils/errors";

/**
 * GET /api/cron/daily
 * Daily cron keep-alive ping and cleanup of stale drafts.
 * Protected by CRON_SECRET header or query parameter.
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret") || (authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null);

    if (secret !== env.CRON_SECRET) {
      throw new UnauthorizedError("Invalid cron secret.");
    }

    // 1. Database keep-alive ping
    await db.execute(sql`SELECT 1`);

    // 2. Delete draft plans older than 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const deletedDrafts = await db
      .delete(plans)
      .where(and(eq(plans.status, "draft"), lt(plans.createdAt, sevenDaysAgo)))
      .returning();

    return NextResponse.json({
      success: true,
      message: "Daily cron tasks completed successfully",
      staleDraftsRemoved: deletedDrafts.length,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
