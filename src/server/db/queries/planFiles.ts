import { db } from "@/server/db/client";
import { planFiles } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

export async function savePlanFile(planId: string, filename: string, fileData: Buffer) {
  const [file] = await db
    .insert(planFiles)
    .values({
      id: crypto.randomUUID(),
      planId,
      filename,
      fileData,
    })
    .returning();
  return file;
}

export async function getPlanFile(planId: string) {
  const [file] = await db.select().from(planFiles).where(eq(planFiles.planId, planId));
  return file || null;
}
