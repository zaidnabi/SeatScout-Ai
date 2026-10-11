import { pgTable, text, integer } from "drizzle-orm/pg-core";

export const llmUsage = pgTable("llm_usage", {
  day: text("day").primaryKey(), // YYYY-MM-DD
  requestCount: integer("request_count").notNull().default(0),
});
