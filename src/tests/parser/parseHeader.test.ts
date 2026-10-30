import { describe, it, expect } from "vitest";
import { parseHeader, parseToIsoDate } from "@/server/parser/parseHeader";
import { ExtractedWord } from "@/server/parser/types";

describe("Task 4: parseHeader", () => {
  it("should normalize diverse date formats into ISO YYYY-MM-DD", () => {
    expect(parseToIsoDate("1 July 26")).toBe("2026-07-01");
    expect(parseToIsoDate("01 July 2026")).toBe("2026-07-01");
    expect(parseToIsoDate("24 June 2026")).toBe("2026-06-24");
    expect(parseToIsoDate("24-06-2026")).toBe("2026-06-24");
    expect(parseToIsoDate("2026-07-01")).toBe("2026-07-01");
  });

  it("should parse room, date, session, quotas and stated total correctly", () => {
    const mockWords: ExtractedWord[] = [
      { text: "Room: 201 | Date: 1 July 26 | Session: Evening", x: 221.8, y: 36.0, width: 200, height: 12, pageNumber: 3, page: 3 },
      { text: "CS24-B", x: 42.0, y: 77.0, width: 40, height: 10, pageNumber: 3, page: 3 },
      { text: "30", x: 247.0, y: 77.0, width: 20, height: 10, pageNumber: 3, page: 3 },
      { text: "EE-24", x: 42.0, y: 95.0, width: 40, height: 10, pageNumber: 3, page: 3 },
      { text: "30", x: 247.0, y: 95.0, width: 20, height: 10, pageNumber: 3, page: 3 },
      { text: "Total", x: 42.0, y: 113.0, width: 40, height: 10, pageNumber: 3, page: 3 },
      { text: "60", x: 247.0, y: 113.0, width: 20, height: 10, pageNumber: 3, page: 3 },
      // Row header to bound the header
      { text: "Row 1", x: 93.46, y: 167.16, width: 30, height: 10, pageNumber: 3, page: 3 },
    ];

    const header = parseHeader(mockWords);
    expect(header.room).toBe("201");
    expect(header.roomName).toBe("201");
    expect(header.examDate).toBe("2026-07-01");
    expect(header.session).toBe("Evening");
    expect(header.statedTotal).toBe(60);
    expect(header.courseCounts).toEqual([
      { courseCode: "CS24-B", statedCount: 30 },
      { courseCode: "EE-24", statedCount: 30 },
    ]);
  });

  it("should extract session from header and not depend on filename", () => {
    const morningWords: ExtractedWord[] = [
      { text: "Room: 101 | Date: 24 June 2026 | Session: Morning", x: 200, y: 30, width: 200, height: 12, pageNumber: 1, page: 1 },
      { text: "CS4111", x: 40, y: 60, width: 40, height: 10, pageNumber: 1, page: 1 },
      { text: "45", x: 200, y: 60, width: 20, height: 10, pageNumber: 1, page: 1 },
      { text: "Total", x: 40, y: 80, width: 40, height: 10, pageNumber: 1, page: 1 },
      { text: "45", x: 200, y: 80, width: 20, height: 10, pageNumber: 1, page: 1 },
      { text: "Row 1", x: 100, y: 120, width: 30, height: 10, pageNumber: 1, page: 1 },
    ];

    const header = parseHeader(morningWords);
    expect(header.session).toBe("Morning");
    expect(header.statedTotal).toBe(45);
  });
});

