import crypto from "crypto";
import { db } from "@/server/db/client";
import { plans, seats, planFiles } from "@/server/db/schema";
import { parsePlanPdf } from "@/server/parser";
import { validateRoom, validatePlanDuplicates } from "@/server/parser/validate";
import {
  getPlanById,
  activatePlan,
  rollbackPlan,
  deletePlan,
  listPlans,
} from "@/server/db/queries/plans";
import {
  listSeatsByPlanId,
  updateSeat as updateSeatDb,
  getSeatById,
} from "@/server/db/queries/seats";
import { getPlanFile, savePlanFile } from "@/server/db/queries/planFiles";
import { logAudit } from "@/server/db/queries/audit";
import {
  BadRequestError,
  NotFoundError,
} from "@/server/utils/errors";
import { MAX_UPLOAD_SIZE_BYTES } from "@/lib/constants";
import { ParsedSeat, ValidationIssue } from "@/server/parser/types";

export interface PlanUploadResult {
  planId: string;
  title: string;
  examDate: string;
  session: string;
  status: string;
  summary: {
    totalRooms: number;
    totalSeats: number;
    totalStudents: number;
    totalEmptySeats: number;
    errorsCount: number;
    warningsCount: number;
  };
  issues: ValidationIssue[];
}

/**
 * Task 5: Upload and parse PDF seating plan.
 * Checks file type & size, runs parsePlanPdf, saves draft plan, seats, and file in 1 transaction.
 */
export async function uploadAndParsePlan(
  fileBuffer: Buffer,
  filename: string,
  mimeType?: string
): Promise<PlanUploadResult> {
  // 1. Validate file size
  if (fileBuffer.length > MAX_UPLOAD_SIZE_BYTES) {
    throw new BadRequestError(
      `File size (${(fileBuffer.length / (1024 * 1024)).toFixed(2)} MB) exceeds maximum allowed limit of 10 MB.`
    );
  }

  // 2. Validate file type
  const isPdf =
    (mimeType && mimeType.includes("pdf")) ||
    filename.toLowerCase().endsWith(".pdf") ||
    fileBuffer.subarray(0, 4).toString() === "%PDF";

  if (!isPdf) {
    throw new BadRequestError("Invalid file type. Only PDF seating plans are accepted.");
  }

  // 3. Parse PDF with spatial coordinate parser
  const parsedPlan = await parsePlanPdf(fileBuffer);
  const planId = crypto.randomUUID();
  const planTitle = `Seating Plan - ${parsedPlan.date} (${parsedPlan.session})`;

  // 4. Save plan, file, and seats in a single SQL transaction
  await db.transaction(async (tx) => {
    // Insert draft plan
    await tx.insert(plans).values({
      id: planId,
      title: planTitle,
      examDate: parsedPlan.date,
      session: parsedPlan.session,
      status: "draft",
      version: 1,
    });

    // Save original PDF file
    await tx.insert(planFiles).values({
      id: crypto.randomUUID(),
      planId,
      filename,
      fileData: fileBuffer,
    });

    // Flatten student seats across all rooms
    const allStudentSeats = parsedPlan.rooms.flatMap((room) =>
      room.seats
        .filter((s) => !s.isEmpty)
        .map((s) => ({
          id: crypto.randomUUID(),
          planId,
          rollNo: s.rollNo,
          courseCode: s.courseCode,
          department: s.department || s.program,
          roomNumber: s.room,
          rowNo: s.rowNo,
          position: s.position,
          pageNumber: s.pageNumber,
        }))
    );

    // Batch insert student seats
    const batchSize = 500;
    for (let i = 0; i < allStudentSeats.length; i += batchSize) {
      const batch = allStudentSeats.slice(i, i + batchSize);
      await tx.insert(seats).values(batch);
    }
  });

  // Log audit action
  await logAudit("UPLOAD_PLAN_DRAFT", {
    planId,
    filename,
    examDate: parsedPlan.date,
    session: parsedPlan.session,
    totalStudents: parsedPlan.summary.totalStudents,
    errorsCount: parsedPlan.summary.errorsCount,
  });

  return {
    planId,
    title: planTitle,
    examDate: parsedPlan.date,
    session: parsedPlan.session,
    status: "draft",
    summary: parsedPlan.summary,
    issues: parsedPlan.issues,
  };
}

/**
 * Task 6: Apply manual seat correction and re-run validation.
 */
export async function updatePlanSeat(
  planId: string,
  seatId: string,
  updates: Partial<{
    rollNo: string;
    courseCode: string;
    department: string;
    roomNumber: string;
    rowNo: number;
    position: number;
  }>
) {
  const plan = await getPlanById(planId);
  if (!plan) throw new NotFoundError("Plan not found");

  const existingSeat = await getSeatById(seatId, planId);
  if (!existingSeat) throw new NotFoundError("Seat not found in this plan");

  // Apply update
  const updatedSeat = await updateSeatDb(seatId, planId, updates);

  // Re-run validation by loading original file or current seats
  const fileRecord = await getPlanFile(planId);
  let updatedIssues: ValidationIssue[] = [];

  if (fileRecord) {
    const reParsed = await parsePlanPdf(fileRecord.fileData);
    updatedIssues = reParsed.issues;
  }

  await logAudit("UPDATE_SEAT", {
    planId,
    seatId,
    previous: { rollNo: existingSeat.rollNo, room: existingSeat.roomNumber },
    updated: updates,
  });

  return {
    seat: updatedSeat,
    issues: updatedIssues,
  };
}

/**
 * Task 7: Activate plan inside a single transaction.
 * Refuses if any error issues remain.
 */
export async function activatePlanService(planId: string) {
  const plan = await getPlanById(planId);
  if (!plan) throw new NotFoundError("Plan not found");

  // Check validation issues: parse file and ensure zero errors
  const fileRecord = await getPlanFile(planId);
  if (fileRecord) {
    const parsed = await parsePlanPdf(fileRecord.fileData);
    const errors = parsed.issues.filter((i) => i.type === "error");
    if (errors.length > 0) {
      throw new BadRequestError(
        `Cannot activate plan. There are ${errors.length} unresolved validation errors.`,
        { errors }
      );
    }
  }

  // Activate in transaction (archives old active plan for same date/session)
  const activated = await activatePlan(planId);

  await logAudit("ACTIVATE_PLAN", {
    planId,
    examDate: plan.examDate,
    session: plan.session,
  });

  return activated;
}

/**
 * Task 8: Rollback an archived plan to active.
 */
export async function rollbackPlanService(planId: string) {
  const plan = await getPlanById(planId);
  if (!plan) throw new NotFoundError("Plan not found");

  const rolledBack = await rollbackPlan(planId);

  await logAudit("ROLLBACK_PLAN", {
    planId,
    examDate: plan.examDate,
    session: plan.session,
  });

  return rolledBack;
}

/**
 * Task 8: Delete plan.
 */
export async function deletePlanService(planId: string) {
  const plan = await getPlanById(planId);
  if (!plan) throw new NotFoundError("Plan not found");

  const deleted = await deletePlan(planId);

  await logAudit("DELETE_PLAN", {
    planId,
    examDate: plan.examDate,
    session: plan.session,
  });

  return { success: true, deletedPlanId: planId };
}

/**
 * Task 8: Get plan file for PDF viewer.
 */
export async function getPlanFileService(planId: string) {
  const plan = await getPlanById(planId);
  if (!plan) throw new NotFoundError("Plan not found");

  const file = await getPlanFile(planId);
  if (!file) throw new NotFoundError("Plan file not found");

  return file;
}

/**
 * Get plan details with validation report and seats.
 */
export async function getPlanDetailsService(planId: string) {
  const plan = await getPlanById(planId);
  if (!plan) throw new NotFoundError("Plan not found");

  const planSeats = await listSeatsByPlanId(planId);
  const fileRecord = await getPlanFile(planId);

  let issues: ValidationIssue[] = [];
  let summary = {
    totalRooms: 0,
    totalSeats: planSeats.length,
    totalStudents: planSeats.length,
    totalEmptySeats: 0,
    errorsCount: 0,
    warningsCount: 0,
  };

  if (fileRecord) {
    const parsed = await parsePlanPdf(fileRecord.fileData);
    issues = parsed.issues;
    summary = parsed.summary;
  }

  return {
    plan,
    seatsCount: planSeats.length,
    summary,
    issues,
  };
}

/**
 * List plans.
 */
export async function listPlansService(status?: string) {
  return await listPlans(status);
}
