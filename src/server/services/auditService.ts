import { listAuditLogs } from "@/server/db/queries/audit";

export async function getAuditLogsService(limit = 100) {
  return await listAuditLogs(limit);
}
