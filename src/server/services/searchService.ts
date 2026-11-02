import { findSeatsByRoll } from "@/server/db/queries/seats";
import { normalizeRoll } from "@/lib/normalizeRoll";

export interface StudentSeatResult {
  id: string;
  rollNo: string;
  courseCode: string;
  department: string | null;
  roomNumber: string;
  rowNo: number;
  position: number;
  pageNumber: number;
  examDate: string;
  session: string;
  planTitle: string;
  isClash: boolean;
}

/**
 * Task 2: Search service for student seat lookup.
 * - Normalizes and validates roll number.
 * - Calls findSeatsByRoll (active plans only).
 * - Detects timetable clashes (two seats in the same date and session).
 * - Returns results sorted by date and session.
 * - An unknown roll returns an empty array.
 */
export async function searchSeatsByRoll(rawRoll: string): Promise<StudentSeatResult[]> {
  const normalizedRoll = normalizeRoll(rawRoll);
  const seats = await findSeatsByRoll(normalizedRoll);

  if (!seats || seats.length === 0) {
    return [];
  }

  // Count session occurrences to detect clashes
  const sessionCountMap = new Map<string, number>();
  for (const s of seats) {
    const key = `${s.examDate}_${s.session.toLowerCase()}`;
    sessionCountMap.set(key, (sessionCountMap.get(key) || 0) + 1);
  }

  // Attach clash flag
  const enrichedSeats: StudentSeatResult[] = seats.map((s) => {
    const key = `${s.examDate}_${s.session.toLowerCase()}`;
    const isClash = (sessionCountMap.get(key) || 0) > 1;
    return {
      ...s,
      isClash,
    };
  });

  // Sort by date ascending, then session (Morning before Evening)
  enrichedSeats.sort((a, b) => {
    const dateCmp = a.examDate.localeCompare(b.examDate);
    if (dateCmp !== 0) return dateCmp;
    if (a.session === b.session) return 0;
    return a.session.toLowerCase() === "morning" ? -1 : 1;
  });

  return enrichedSeats;
}
