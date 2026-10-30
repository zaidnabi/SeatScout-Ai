import { describe, it, expect } from "vitest";
import { parseHeader } from "../parseHeader";
import { ExtractedWord } from "../types";

describe("Task 4: parseHeader (server/parser)", () => {
  it("should extract header details correctly", () => {
    const words: ExtractedWord[] = [
      { text: "Room: 301 | Date: 1 July 26 | Session: Evening", x: 221.8, y: 36.0, width: 200, height: 12, pageNumber: 6, page: 6 },
      { text: "AI-24A", x: 42.0, y: 77.0, width: 40, height: 10, pageNumber: 6, page: 6 },
      { text: "25", x: 247.0, y: 77.0, width: 20, height: 10, pageNumber: 6, page: 6 },
      { text: "CS 25-A", x: 42.0, y: 95.0, width: 40, height: 10, pageNumber: 6, page: 6 },
      { text: "25", x: 247.0, y: 95.0, width: 20, height: 10, pageNumber: 6, page: 6 },
      { text: "Total", x: 42.0, y: 113.0, width: 40, height: 10, pageNumber: 6, page: 6 },
      { text: "50", x: 247.0, y: 113.0, width: 20, height: 10, pageNumber: 6, page: 6 },
      { text: "Row 1", x: 93.46, y: 167.16, width: 30, height: 10, pageNumber: 6, page: 6 },
    ];

    const res = parseHeader(words);
    expect(res.roomName).toBe("301");
    expect(res.examDate).toBe("2026-07-01");
    expect(res.session).toBe("Evening");
    expect(res.statedTotal).toBe(50);
    expect(res.courseCounts).toHaveLength(2);
  });
});

