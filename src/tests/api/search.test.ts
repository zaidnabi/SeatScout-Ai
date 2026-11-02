import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/search/route";
import { NextRequest } from "next/server";
import * as searchService from "@/server/services/searchService";

vi.mock("@/server/services/searchService", () => ({
  searchSeatsByRoll: vi.fn(),
}));

describe("Task 2: GET /api/search", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 400 if roll query parameter is missing", async () => {
    const request = new NextRequest("http://localhost:3000/api/search");
    const response = await GET(request);

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBeDefined();
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  it("should return 200 with an empty array for an unknown roll number", async () => {
    vi.mocked(searchService.searchSeatsByRoll).mockResolvedValueOnce([]);

    const request = new NextRequest("http://localhost:3000/api/search?roll=F23605033");
    const response = await GET(request);

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual([]);
  });

  it("should return 200 with seats array for a known roll number", async () => {
    const mockResults = [
      {
        id: "seat-1",
        rollNo: "F23605033",
        courseCode: "CS230",
        department: "CS",
        roomNumber: "201",
        rowNo: 1,
        position: 1,
        pageNumber: 3,
        examDate: "2026-07-01",
        session: "Evening",
        planTitle: "Exam Plan",
        isClash: false,
      },
    ];

    vi.mocked(searchService.searchSeatsByRoll).mockResolvedValueOnce(mockResults);

    const request = new NextRequest("http://localhost:3000/api/search?roll=F23605033");
    const response = await GET(request);

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toHaveLength(1);
    expect(body[0].rollNo).toBe("F23605033");
    expect(body[0].roomNumber).toBe("201");
  });
});
