import { describe, it, expect } from "vitest";
import { validateRoom, validatePlanDuplicates } from "@/server/parser/validate";
import { ParsedHeader, ParsedSeat } from "@/server/parser/types";

describe("Task 7: validate", () => {
  const baseHeader: ParsedHeader = {
    room: "302",
    roomName: "302",
    date: "2026-07-01",
    examDate: "2026-07-01",
    session: "Evening",
    courseCounts: [
      { courseCode: "CS 25-A", statedCount: 25 },
      { courseCode: "AI-24A", statedCount: 25 },
    ],
    statedTotal: 50,
    headerWords: [],
  };

  const createMockSeat = (
    rollNo: string,
    rawClass: string,
    courseCode: string,
    rowNo = 1,
    position = 1
  ): ParsedSeat => ({
    rollNo,
    courseCode,
    department: rawClass.split(/[- ]/)[0],
    program: rawClass.split(/[- ]/)[0],
    batch: "25",
    rawClass,
    rawCourse: `${courseCode}-${rawClass}`,
    room: "302",
    roomNumber: "302",
    rowNo,
    position,
    pageNumber: 7,
    isEmpty: false,
    x: 50,
    y: 200,
  });

  it("should return zero issues for a completely matching room", () => {
    const seats: ParsedSeat[] = [];
    for (let i = 1; i <= 25; i++) {
      seats.push(createMockSeat(`F25605${String(i).padStart(3, "0")}`, "CS 25-A", "CS122", 1, i));
    }
    for (let i = 1; i <= 25; i++) {
      seats.push(createMockSeat(`F24607${String(i).padStart(3, "0")}`, "AI-24A", "CS284", 2, i));
    }

    const issues = validateRoom(baseHeader, seats, 0);
    expect(issues).toHaveLength(0);
  });

  it("should report COUNT_MISMATCH error when parsed total does not match header total (e.g. 25 + 24 = 49 vs 50)", () => {
    const seats: ParsedSeat[] = [];
    // 25 CS 25-A seats
    for (let i = 1; i <= 25; i++) {
      seats.push(createMockSeat(`F25605${String(i).padStart(3, "0")}`, "CS 25-A", "CS122", 1, i));
    }
    // Only 24 AI-24A seats (giving 49 total instead of 50)
    for (let i = 1; i <= 24; i++) {
      seats.push(createMockSeat(`F24607${String(i).padStart(3, "0")}`, "AI-24A", "CS284", 2, i));
    }

    const issues = validateRoom(baseHeader, seats, 0);
    const errors = issues.filter((i) => i.type === "error");
    expect(errors.length).toBeGreaterThanOrEqual(1);

    const countMismatch = errors.find((e) => e.code === "COUNT_MISMATCH");
    expect(countMismatch).toBeDefined();
    expect(countMismatch?.message).toContain("stated 50, parsed 49");

    const courseMismatch = errors.find((e) => e.code === "COURSE_COUNT_MISMATCH");
    expect(courseMismatch).toBeDefined();
  });

  it("should report UNKNOWN_CELL_SHAPE as an error", () => {
    const seats: ParsedSeat[] = [];
    for (let i = 1; i <= 50; i++) {
      seats.push(createMockSeat(`F25605${String(i).padStart(3, "0")}`, "CS 25-A", "CS122", 1, i));
    }

    const issues = validateRoom(baseHeader, seats, 2);
    const unknownShapeError = issues.find((i) => i.code === "UNKNOWN_CELL_SHAPE");
    expect(unknownShapeError).toBeDefined();
    expect(unknownShapeError?.type).toBe("error");
  });

  it("should report duplicate roll numbers as WARNINGS, not errors", () => {
    const seats: ParsedSeat[] = [];
    for (let i = 1; i <= 49; i++) {
      seats.push(createMockSeat(`F25605${String(i).padStart(3, "0")}`, "CS 25-A", "CS122", 1, i));
    }
    // Duplicate roll number: F25605001 appears again (total 50 seats)
    seats.push(createMockSeat("F25605001", "AI-24A", "CS284", 2, 50));

    const issues = validateRoom(baseHeader, seats, 0);
    const duplicateWarnings = issues.filter((i) => i.code === "DUPLICATE_ROLL");
    expect(duplicateWarnings).toHaveLength(1);
    expect(duplicateWarnings[0].type).toBe("warning");
  });

  it("should detect duplicate roll numbers across different rooms as timetable clash warnings", () => {
    const roomA = {
      roomName: "301",
      seats: [createMockSeat("F24607001", "AI-24A", "CS284")],
    };
    const roomB = {
      roomName: "302",
      seats: [createMockSeat("F24607001", "CS 25-A", "CS122")],
    };

    const clashIssues = validatePlanDuplicates([roomA, roomB]);
    expect(clashIssues).toHaveLength(1);
    expect(clashIssues[0].type).toBe("warning");
    expect(clashIssues[0].code).toBe("DUPLICATE_ROLL");
  });
});
