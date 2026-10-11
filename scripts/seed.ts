import { eq } from "drizzle-orm";
import { db } from "../src/server/db/client";
import { plans, seats } from "../src/server/db/schema";
import { findSeatsByRoll } from "../src/server/db/queries/seats";

async function seed() {
  console.log("🌱 Seeding test seating plan...");

  const planId = "seed-plan-001";

  // Clean existing seed data if present
  await db.delete(plans).where(eq(plans.id, planId));

  // 1. Insert active plan
  await db.insert(plans).values({
    id: planId,
    title: "Midterm Exams - June 2026",
    examDate: "24-06-2026",
    session: "Morning",
    status: "active",
    version: 1,
  });

  // 2. Insert fake student allocation
  await db.insert(seats).values({
    id: "seat-001",
    planId: planId,
    rollNo: "F22605004",
    courseCode: "CS4111",
    department: "Computer Science",
    roomNumber: "301",
    rowNo: 1,
    position: 1,
    pageNumber: 1,
  });

  console.log("✅ Seed completed.");

  // 3. Benchmark search speed
  const startTime = performance.now();
  const results = await findSeatsByRoll("F22605004");
  const endTime = performance.now();
  const duration = (endTime - startTime).toFixed(2);

  console.log(`🔎 Search Result:`, results);
  console.log(`⏱️ Query Time: ${duration} ms`);

  if (Number(duration) < 100) {
    console.log("🚀 Benchmark PASSED: Response returned in under 100 ms!");
  }

  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});