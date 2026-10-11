import { db } from "@/server/db/client";
import { seats, plans } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";

/**
 * Find all seat allocations for a given roll number across ACTIVE plans only.
 */
export async function findSeatsByRoll(rollNo: string) {
  const normalizedRoll = rollNo.trim().toUpperCase();

  return await db
    .select({
      id: seats.id,
      rollNo: seats.rollNo,
      courseCode: seats.courseCode,
      department: seats.department,
      roomNumber: seats.roomNumber,
      rowNo: seats.rowNo,
      position: seats.position,
      pageNumber: seats.pageNumber,
      examDate: plans.examDate,
      session: plans.session,
      planTitle: plans.title,
    })
    .from(seats)
    .innerJoin(plans, eq(seats.planId, plans.id))
    .where(and(eq(seats.rollNo, normalizedRoll), eq(plans.status, "active")));
}

/**
 * List all seats in a specific room for a plan.
 */
export async function listRoom(planId: string, roomNumber: string) {
  return await db
    .select()
    .from(seats)
    .where(and(eq(seats.planId, planId), eq(seats.roomNumber, roomNumber)));
}

/**
 * Get all students taking a specific course code on a given exam date.
 */
export async function studentsInCourse(courseCode: string, examDate: string) {
  return await db
    .select({
      rollNo: seats.rollNo,
      roomNumber: seats.roomNumber,
      session: plans.session,
    })
    .from(seats)
    .innerJoin(plans, eq(seats.planId, plans.id))
    .where(
      and(
        eq(seats.courseCode, courseCode.trim().toUpperCase()),
        eq(plans.examDate, examDate),
        eq(plans.status, "active")
      )
    );
}
