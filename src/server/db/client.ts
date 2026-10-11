import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { env } from "@/server/utils/env";
import * as schema from "@/server/db/schema";

// Guard against importing client-side in Next.js without breaking standalone CLI scripts
if (typeof window !== "undefined") {
  throw new Error("This module can only be imported on the server.");
}

const globalForDb = globalThis as unknown as {
  pool: Pool | undefined;
};

const pool = globalForDb.pool ?? new Pool({ connectionString: env.DATABASE_URL });

if (process.env.NODE_ENV !== "production") {
  globalForDb.pool = pool;
}

export const db = drizzle(pool, { schema });