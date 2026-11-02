import { z } from "zod";

export const searchSchema = z.object({
  roll: z.string().min(1, "Roll number is required"),
});

export const loginSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export const updateSeatSchema = z.object({
  rollNo: z.string().min(1).optional(),
  courseCode: z.string().min(1).optional(),
  department: z.string().optional(),
  roomNumber: z.string().optional(),
  rowNo: z.coerce.number().min(1).optional(),
  position: z.coerce.number().min(1).optional(),
});
