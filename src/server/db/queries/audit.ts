import { db } from "@/server/db/client";
import { auditLog } from "@/server/db/schema";
import { desc } from "drizzle-orm";
import crypto from "crypto";

export async function logAudit(action: string, details?: string | Record<string, unknown>) {
  const detailsStr = typeof details === "object" ? JSON.stringify(details) : details;
  const [entry] = await db
    .insert(auditLog)
    .values({
      id: crypto.randomUUID(),
      action,
      details: detailsStr,
    })
    .returning();
  return entry;
}

export async function listAuditLogs(limit = 100) {
  return await db
    .select()
    .from(auditLog)
    .orderBy(desc(auditLog.createdAt))
    .limit(limit);
}
