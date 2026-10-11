
import { z } from "zod";
import fs from "fs";
import path from "path";

// Auto-load .env.local if running standalone CLI scripts
if (!process.env.DATABASE_URL) {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    if (typeof process.loadEnvFile === "function") {
      process.loadEnvFile(envPath);
    }
  }
}

const envSchema = z.object({
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid PostgreSQL connection string"),
  GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY is required"),
  ADMIN_PASSWORD_HASH: z.string().min(1, "ADMIN_PASSWORD_HASH is required"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters long"),
  CRON_SECRET: z.string().min(1, "CRON_SECRET is required"),
  LLM_DAILY_BUDGET: z.coerce.number().default(500),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.format());
  throw new Error("Invalid environment variables. Check .env.local file.");
}

export const env = _env.data;