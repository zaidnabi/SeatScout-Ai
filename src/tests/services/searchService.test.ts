import { describe, it, expect, vi, beforeEach } from "vitest";
import { searchSeatsByRoll } from "@/server/services/searchService";
import * as seatQueries from "@/server/db/queries/seats";
import { BadRequestError } from "@/server/utils/errors";

vi.mock("@/server/db/queries/seats", () => ({
  findSeatsByRoll: vi.fn(),
}));

describe("Task 2: searchService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should normalize roll number, query database and return empty array for unknown roll", async () => {
    vi.mocked(seatQueries.findSeatsByRoll).mockResolvedValueOnce([]);

    const result = await searchSeatsByRoll(" f23605033 ");
    expect(seatQueries.findSeatsByRoll).toHaveBeenCalledWith("F23605033");
    expect(result).toEqual([]);
  });

  it("should throw BadRequestError for invalid roll format", async () => {
    await expect(searchSeatsByRoll("INVALID_ROLL")).rejects.toThrow(BadRequestError);
    await expect(searchSeatsByRoll("")).rejects.toThrow(BadRequestError);
  });

  it("should sort multiple seats by examDate and session (Morning before Evening)", async () => {
    const mockSeats = [
      {
        id: "s1",
        rollNo: "F23605033",
        courseCode: "CS230",
        department: "CS",
        roomNumber: "201",
        rowNo: 1,
        position: 1,
        pageNumber: 3,
        examDate: "2026-07-02",
        session: "Evening",
        planTitle: "Exam 2",
      },
      {
        id: "s2",
        rollNo: "F23605033",
        courseCode: "CS122",
        department: "CS",
        roomNumber: "202",
        rowNo: 2,
        position: 3,
        pageNumber: 4,
        examDate: "2026-07-01",
        session: "Evening",
        planTitle: "Exam 1",
      },
      {
        id: "s3",
        rollNo: "F23605033",
        courseCode: "MATH2307",
        department: "ME",
        roomNumber: "501",
        rowNo: 3,
        position: 2,
        pageNumber: 14,
        examDate: "2026-07-01",
        session: "Morning",
        planTitle: "Exam 1",
      },
    ];

    vi.mocked(seatQueries.findSeatsByRoll).mockResolvedValueOnce(mockSeats as any);

    const result = await searchSeatsByRoll("F23605033");
    expect(result).toHaveLength(3);

    // 2026-07-01 Morning should come first
    expect(result[0].id).toBe("s3");
    expect(result[0].examDate).toBe("2026-07-01");
    expect(result[0].session).toBe("Morning");

    // 2026-07-01 Evening should come second
    expect(result[1].id).toBe("s2");
    expect(result[1].examDate).toBe("2026-07-01");
    expect(result[1].session).toBe("Evening");

    // 2026-07-02 Evening should come third
    expect(result[2].id).toBe("s1");
    expect(result[2].examDate).toBe("2026-07-02");
  });

  it("should detect timetable clashes when two seats share the same date and session", async () => {
    const mockClashSeats = [
      {
        id: "seat-clash-1",
        rollNo: "F23605033",
        courseCode: "CS230",
        department: "CS",
        roomNumber: "201",
        rowNo: 1,
        position: 1,
        pageNumber: 3,
        examDate: "2026-07-01",
        session: "Evening",
        planTitle: "Evening Plan",
      },
      {
        id: "seat-clash-2",
        rollNo: "F23605033",
        courseCode: "EE-24",
        department: "EE",
        roomNumber: "302",
        rowNo: 2,
        position: 4,
        pageNumber: 7,
        examDate: "2026-07-01",
        session: "Evening",
        planTitle: "Evening Plan",
      },
      {
        id: "seat-normal",
        rollNo: "F23605033",
        courseCode: "MATH2307",
        department: "ME",
        roomNumber: "501",
        rowNo: 1,
        position: 2,
        pageNumber: 14,
        examDate: "2026-07-02",
        session: "Morning",
        planTitle: "Next Day",
      },
    ];

    vi.mocked(seatQueries.findSeatsByRoll).mockResolvedValueOnce(mockClashSeats as any);

    const result = await searchSeatsByRoll("F23605033");
    expect(result).toHaveLength(3);

    const clash1 = result.find((s) => s.id === "seat-clash-1");
    const clash2 = result.find((s) => s.id === "seat-clash-2");
    const normal = result.find((s) => s.id === "seat-normal");

    expect(clash1?.isClash).toBe(true);
    expect(clash2?.isClash).toBe(true);
    expect(normal?.isClash).toBe(false);
  });
});
