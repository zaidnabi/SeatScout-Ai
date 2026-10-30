import { HeaderCourseCount, ParsedHeader, ParsedSeat, ValidationIssue } from "./types";

export type { ValidationIssue };

/**
 * Normalizes course/class code by stripping spaces, hyphens, and converting to uppercase.
 * E.g., "CS 25-A" -> "CS25A", "AI-24A" -> "AI24A", "ME-24" -> "ME24"
 */
export function normalizeCode(code: string): string {
  return code.replace(/[\s-]/g, "").toUpperCase();
}

/**
 * Task 7: Validation layer.
 * Compares parsed counts per course and in total with the header.
 * - Count mismatches are ERRORS.
 * - Unknown cell shapes are ERRORS.
 * - Duplicate roll numbers are WARNINGS (real timetable clashes exist).
 */
export function validateRoom(
  header: ParsedHeader,
  seats: ParsedSeat[],
  unknownCellsCount = 0
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const studentSeats = seats.filter((s) => !s.isEmpty);

  // 1. Total Stated vs Parsed Checksum
  if (studentSeats.length !== header.statedTotal) {
    issues.push({
      type: "error",
      code: "COUNT_MISMATCH",
      room: header.roomName,
      message: `Room ${header.roomName} count mismatch: header stated ${header.statedTotal}, parsed ${studentSeats.length}`,
      details: {
        room: header.roomName,
        statedTotal: header.statedTotal,
        parsedTotal: studentSeats.length,
      },
    });
  }

  // 2. Per-course / Class Count Check
  for (const quota of header.courseCounts) {
    const quotaNorm = normalizeCode(quota.courseCode);

    const matchingSeats = studentSeats.filter((seat) => {
      const classNorm = normalizeCode(seat.rawClass || "");
      const courseNorm = normalizeCode(seat.courseCode || "");
      const rawCourseNorm = normalizeCode(seat.rawCourse || "");

      return (
        classNorm === quotaNorm ||
        courseNorm === quotaNorm ||
        rawCourseNorm.startsWith(quotaNorm) ||
        quotaNorm.startsWith(classNorm)
      );
    });

    if (matchingSeats.length !== quota.statedCount) {
      issues.push({
        type: "error",
        code: "COURSE_COUNT_MISMATCH",
        room: header.roomName,
        message: `Course ${quota.courseCode} in Room ${header.roomName} mismatch: stated ${quota.statedCount}, parsed ${matchingSeats.length}`,
        details: {
          room: header.roomName,
          course: quota.courseCode,
          statedCount: quota.statedCount,
          parsedCount: matchingSeats.length,
        },
      });
    }
  }

  // 3. Unknown Cell Shapes are Errors
  if (unknownCellsCount > 0) {
    issues.push({
      type: "error",
      code: "UNKNOWN_CELL_SHAPE",
      room: header.roomName,
      message: `Room ${header.roomName} contains ${unknownCellsCount} unknown or malformed cell shapes`,
      details: {
        room: header.roomName,
        count: unknownCellsCount,
      },
    });
  }

  // 4. Duplicate Roll Numbers within room are WARNINGS (timetable clashes)
  const rollCounts = new Map<string, number>();
  for (const s of studentSeats) {
    const r = s.rollNo.toUpperCase();
    rollCounts.set(r, (rollCounts.get(r) || 0) + 1);
  }

  for (const [rollNo, count] of rollCounts.entries()) {
    if (count > 1) {
      issues.push({
        type: "warning",
        code: "DUPLICATE_ROLL",
        room: header.roomName,
        message: `Student ${rollNo} appears ${count} times in Room ${header.roomName} (timetable clash warning)`,
        details: {
          room: header.roomName,
          rollNo,
          occurrences: count,
        },
      });
    }
  }

  return issues;
}

/**
 * Global cross-room plan validation (e.g. clashes across rooms in the same session).
 */
export function validatePlanDuplicates(rooms: { roomName: string; seats: ParsedSeat[] }[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const rollLocationMap = new Map<string, string[]>();

  for (const r of rooms) {
    for (const s of r.seats) {
      if (s.isEmpty) continue;
      const roll = s.rollNo.toUpperCase();
      if (!rollLocationMap.has(roll)) {
        rollLocationMap.set(roll, []);
      }
      rollLocationMap.get(roll)!.push(r.roomName);
    }
  }

  for (const [rollNo, roomList] of rollLocationMap.entries()) {
    if (roomList.length > 1) {
      // If student is in multiple different rooms
      const distinctRooms = Array.from(new Set(roomList));
      if (distinctRooms.length > 1) {
        issues.push({
          type: "warning",
          code: "DUPLICATE_ROLL",
          message: `Student ${rollNo} has seats in multiple rooms: ${distinctRooms.join(", ")} (timetable clash warning)`,
          details: {
            rollNo,
            rooms: distinctRooms,
          },
        });
      }
    }
  }

  return issues;
}

