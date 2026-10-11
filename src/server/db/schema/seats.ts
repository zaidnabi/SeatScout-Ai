import { pgTable, text, integer, varchar, index } from "drizzle-orm/pg-core";
import { plans } from "./plans";

export const seats = pgTable(
  "seats",
  {
    id: text("id").primaryKey(),
    planId: text("plan_id").notNull().references(() => plans.id, { onDelete: "cascade" }),
    rollNo: varchar("roll_no", { length: 30 }).notNull(),
    courseCode: varchar("course_code", { length: 20 }).notNull(),
    department: varchar("department", { length: 100 }),
    roomNumber: varchar("room_number", { length: 20 }).notNull(),
    rowNo: integer("row_no").notNull(),
    position: integer("position").notNull(),
    pageNumber: integer("page_number").notNull(),
  },
  (table) => [
    index("idx_roll_no").on(table.rollNo),
    index("idx_plan_room").on(table.planId, table.roomNumber),
  ]
);
