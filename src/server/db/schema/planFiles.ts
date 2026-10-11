import { pgTable, text, customType } from "drizzle-orm/pg-core";
import { plans } from "./plans";

const bytea = customType<{ data: Buffer }>({
  dataType() {
    return "bytea";
  },
});

export const planFiles = pgTable("plan_files", {
  id: text("id").primaryKey(),
  planId: text("plan_id").notNull().references(() => plans.id, { onDelete: "cascade" }),
  filename: text("filename").notNull(),
  fileData: bytea("file_data").notNull(),
});
