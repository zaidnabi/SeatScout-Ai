import { pgTable, text, timestamp, integer, varchar } from "drizzle-orm/pg-core";

export const plans = pgTable("plans", {
  id: text("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  examDate: varchar("exam_date", { length: 20 }).notNull(), // DD-MM-YYYY
  session: varchar("session", { length: 10 }).notNull(), // Morning / Evening
  status: varchar("status", { length: 20 }).notNull().default("draft"), // draft | active | archived
  version: integer("version").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
