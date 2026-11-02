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
 * List all seats for a plan.
 */
export async function listSeatsByPlanId(planId: string) {
  return await db
    .select()
    .from(seats)
    .where(eq(seats.planId, planId));
}

/**
 * Get a single seat by ID.
 */
export async function getSeatById(seatId: string, planId?: string) {
  const conditions = planId
    ? and(eq(seats.id, seatId), eq(seats.planId, planId))
    : eq(seats.id, seatId);

  const [seat] = await db.select().from(seats).where(conditions);
  return seat || null;
}

/**
 * Update a seat.
 */
export async function updateSeat(
  seatId: string,
  planId: string,
  data: Partial<{
    rollNo: string;
    courseCode: string;
    department: string;
    roomNumber: string;
    rowNo: number;
    position: number;
  }>
) {
  const [updated] = await db
    .update(seats)
    .set(data)
    .where(and(eq(seats.id, seatId), eq(seats.planId, planId)))
    .returning();
  return updated || null;
}

/**
 * Batch insert seats.
 */
export async function insertSeats(
  newSeats: (typeof seats.$inferInsert)[]
) {
  if (newSeats.length === 0) return [];
  // Insert in batches of 500 to avoid parameter limits
  const batchSize = 500;
  const results: (typeof seats.$inferSelect)[] = [];

  for (let i = 0; i < newSeats.length; i += batchSize) {
    const batch = newSeats.slice(i, i + batchSize);
    const inserted = await db.insert(seats).values(batch).returning();
    results.push(...inserted);
  }

  return results;
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
