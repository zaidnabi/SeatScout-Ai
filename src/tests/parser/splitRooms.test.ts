import { describe, it, expect } from "vitest";
import { splitRooms } from "@/server/parser/splitRooms";
import { ExtractedPage } from "@/server/parser/types";

describe("Task 3: splitRooms", () => {
  it("should ignore global summary pages and split rooms by Room header", () => {
    const mockPages: ExtractedPage[] = [
      {
        pageNumber: 1,
        page: 1,
        width: 800,
        height: 600,
        words: [
          { text: "Seating Capacity of Academic Block", x: 100, y: 50, width: 200, height: 12, pageNumber: 1, page: 1 },
          { text: "Room 201 Capacity 60", x: 100, y: 100, width: 100, height: 10, pageNumber: 1, page: 1 },
        ],
      },
      {
        pageNumber: 2,
        page: 2,
        width: 800,
        height: 600,
        words: [
          { text: "GLOBAL COURSE-WISE SEATING SUMMARY", x: 100, y: 50, width: 200, height: 12, pageNumber: 2, page: 2 },
        ],
      },
      {
        pageNumber: 3,
        page: 3,
        width: 800,
        height: 600,
        words: [
          { text: "Room: 201 | Date: 1 July 26 | Session: Evening", x: 200, y: 30, width: 200, height: 12, pageNumber: 3, page: 3 },
          { text: "F24605068", x: 50, y: 200, width: 40, height: 10, pageNumber: 3, page: 3 },
        ],
      },
      {
        pageNumber: 4,
        page: 4,
        width: 800,
        height: 600,
        words: [
          { text: "Room: 202 | Date: 1 July 26 | Session: Evening", x: 200, y: 30, width: 200, height: 12, pageNumber: 4, page: 4 },
          { text: "F24605140", x: 50, y: 200, width: 40, height: 10, pageNumber: 4, page: 4 },
        ],
      },
    ];

    const rooms = splitRooms(mockPages);
    expect(rooms).toHaveLength(2);
    expect(rooms[0].roomName).toBe("201");
    expect(rooms[0].pageNumber).toBe(3);
    expect(rooms[1].roomName).toBe("202");
    expect(rooms[1].pageNumber).toBe(4);
  });

  it("should handle multi-page room continuations", () => {
    const mockPages: ExtractedPage[] = [
      {
        pageNumber: 3,
        page: 3,
        width: 800,
        height: 600,
        words: [
          { text: "Room: 201 | Date: 1 July 26 | Session: Evening", x: 200, y: 30, width: 200, height: 12, pageNumber: 3, page: 3 },
          { text: "Page 3 Seat", x: 50, y: 200, width: 40, height: 10, pageNumber: 3, page: 3 },
        ],
      },
      {
        pageNumber: 4,
        page: 4,
        width: 800,
        height: 600,
        words: [
          // No Room: header on page 4 -> continuation of Room 201
          { text: "Page 4 Seat Continuation", x: 50, y: 200, width: 40, height: 10, pageNumber: 4, page: 4 },
        ],
      },
    ];

    const rooms = splitRooms(mockPages);
    expect(rooms).toHaveLength(1);
    expect(rooms[0].roomName).toBe("201");
    expect(rooms[0].pageNumber).toBe(3);
    expect(rooms[0].words).toHaveLength(3);
  });
});

