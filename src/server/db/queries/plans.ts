import { db } from "@/server/db/client";
import { plans, seats, planFiles, chunks } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";

export async function createDraftPlan(data: {
  id: string;
  title: string;
  examDate: string;
  session: string;
}) {
  const [newPlan] = await db
    .insert(plans)
    .values({
      ...data,
      status: "draft",
      version: 1,
    })
    .returning();
  return newPlan;
}

export async function getPlanById(planId: string) {
  const [plan] = await db.select().from(plans).where(eq(plans.id, planId));
  return plan || null;
}

/**
 * Activate a draft plan inside a single SQL transaction:
 * 1. Set status of currently active plans for the same date & session to 'archived'.
 * 2. Set the draft plan's status to 'active'.
 */
export async function activatePlan(planId: string) {
  return await db.transaction(async (tx) => {
    const [targetPlan] = await tx.select().from(plans).where(eq(plans.id, planId));
    if (!targetPlan) throw new Error("Plan not found");

    // Archive existing active plans for the same session and date
    await tx
      .update(plans)
      .set({ status: "archived", updatedAt: new Date() })
      .where(
        and(
          eq(plans.examDate, targetPlan.examDate),
          eq(plans.session, targetPlan.session),
          eq(plans.status, "active")
        )
      );

    // Activate target plan
    const [activated] = await tx
      .update(plans)
      .set({ status: "active", updatedAt: new Date() })
      .where(eq(plans.id, planId))
      .returning();

    return activated;
  });
}

/**
 * Rollback an archived plan to active status.
 */
export async function rollbackPlan(planId: string) {
  return await activatePlan(planId);
}

export async function deletePlan(planId: string) {
  return await db.delete(plans).where(eq(plans.id, planId));
}
