import { pgTable, text, customType, varchar } from "drizzle-orm/pg-core";
import { plans } from "./plans";

// 768 dimensions for Google text-embedding-004
const vector = customType<{ data: number[] }>({
  dataType() {
    return "vector(768)";
  },
});

export const chunks = pgTable("chunks", {
  id: text("id").primaryKey(),
  planId: text("plan_id").notNull().references(() => plans.id, { onDelete: "cascade" }),
  roomNumber: varchar("room_number", { length: 20 }),
  content: text("content").notNull(),
  embedding: vector("embedding"),
});
