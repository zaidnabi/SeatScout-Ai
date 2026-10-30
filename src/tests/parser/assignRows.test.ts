import { describe, it, expect } from "vitest";
import { assignRows, extractRowAnchors } from "@/server/parser/assignRows";
import { ExtractedWord, ParsedSeat, RowAnchor } from "@/server/parser/types";

describe("Task 5: assignRows", () => {
  const mockRowWords: ExtractedWord[] = [
    { text: "Row 1", x: 93.46, y: 167.16, width: 29.45, height: 10, pageNumber: 3, page: 3 },
    { text: "Row 2", x: 249.84, y: 167.16, width: 29.45, height: 10, pageNumber: 3, page: 3 },
    { text: "Row 3", x: 406.22, y: 167.16, width: 29.45, height: 10, pageNumber: 3, page: 3 },
    { text: "Row 4", x: 562.6, y: 167.16, width: 29.45, height: 10, pageNumber: 3, page: 3 },
    { text: "Row 5", x: 718.98, y: 167.16, width: 29.45, height: 10, pageNumber: 3, page: 3 },
  ];

  it("should extract row anchors correctly sorted by row number", () => {
    // Pass in reverse order to ensure sorting works
    const anchors = extractRowAnchors([...mockRowWords].reverse());
    expect(anchors).toHaveLength(5);
    expect(anchors[0].rowNo).toBe(1);
    expect(anchors[0].x).toBe(93.46);
    expect(anchors[4].rowNo).toBe(5);
    expect(anchors[4].x).toBe(718.98);
  });

  it("should assign each seat to the nearest column based on x coordinate", () => {
    const rawSeats: ParsedSeat[] = [
      // Close to Row 1 (x=93.46)
      {
        rollNo: "F24605068",
        courseCode: "CS230",
        department: "CS",
        program: "CS",
        batch: "24",
        section: "B",
        rawClass: "CS24-B",
        rawCourse: "CS230-CS24B",
        room: "201",
        roomNumber: "201",
        rowNo: 0,
        position: 0,
        pageNumber: 3,
        isEmpty: false,
        x: 48.9,
        y: 218.5,
      },
      {
        rollNo: "F24603051",
        courseCode: "SS2005",
        department: "EE",
        program: "EE",
        batch: "24",
        rawClass: "EE-24",
        rawCourse: "SS2005-EE24",
        room: "201",
        roomNumber: "201",
        rowNo: 0,
        position: 0,
        pageNumber: 3,
        isEmpty: false,
        x: 127.0,
        y: 218.5,
      },
      // Close to Row 2 (x=249.84)
      {
        rollNo: "F24605095",
        courseCode: "CS230",
        department: "CS",
        program: "CS",
        batch: "24",
        rawClass: "CS24-B",
        rawCourse: "CS230-CS24B",
        room: "201",
        roomNumber: "201",
        rowNo: 0,
        position: 0,
        pageNumber: 3,
        isEmpty: false,
        x: 205.2,
        y: 218.5,
      },
      // Close to Row 5 (x=718.98)
      {
        rollNo: "F24603034",
        courseCode: "SS2005",
        department: "EE",
        program: "EE",
        batch: "24",
        rawClass: "EE-24",
        rawCourse: "SS2005-EE24",
        room: "201",
        roomNumber: "201",
        rowNo: 0,
        position: 0,
        pageNumber: 3,
        isEmpty: false,
        x: 752.6,
        y: 218.5,
      },
    ];

    const result = assignRows(rawSeats, mockRowWords);
    expect(result.find((s) => s.rollNo === "F24605068")?.rowNo).toBe(1);
    expect(result.find((s) => s.rollNo === "F24603051")?.rowNo).toBe(1);
    expect(result.find((s) => s.rollNo === "F24605095")?.rowNo).toBe(2);
    expect(result.find((s) => s.rollNo === "F24603034")?.rowNo).toBe(5);
  });

  it("should order seats in each row by y ascending and assign sequential positions", () => {
    const rawSeats: ParsedSeat[] = [
      {
        rollNo: "SEAT_BOTTOM",
        courseCode: "CS230",
        department: "CS",
        program: "CS",
        batch: "24",
        rawClass: "CS24-B",
        rawCourse: "CS230-CS24B",
        room: "201",
        roomNumber: "201",
        rowNo: 0,
        position: 0,
        pageNumber: 3,
        isEmpty: false,
        x: 48.9,
        y: 500.0,
      },
      {
        rollNo: "SEAT_TOP_LEFT",
        courseCode: "CS230",
        department: "CS",
        program: "CS",
        batch: "24",
        rawClass: "CS24-B",
        rawCourse: "CS230-CS24B",
        room: "201",
        roomNumber: "201",
        rowNo: 0,
        position: 0,
        pageNumber: 3,
        isEmpty: false,
        x: 48.9,
        y: 200.0,
      },
      {
        rollNo: "SEAT_TOP_RIGHT",
        courseCode: "EE-24",
        department: "EE",
        program: "EE",
        batch: "24",
        rawClass: "EE-24",
        rawCourse: "SS2005-EE24",
        room: "201",
        roomNumber: "201",
        rowNo: 0,
        position: 0,
        pageNumber: 3,
        isEmpty: false,
        x: 127.0,
        y: 200.0,
      },
    ];

    const result = assignRows(rawSeats, mockRowWords);
    const row1Seats = result.filter((s) => s.rowNo === 1);
    expect(row1Seats).toHaveLength(3);
    expect(row1Seats[0].rollNo).toBe("SEAT_TOP_LEFT");
    expect(row1Seats[0].position).toBe(1);
    expect(row1Seats[1].rollNo).toBe("SEAT_TOP_RIGHT");
    expect(row1Seats[1].position).toBe(2);
    expect(row1Seats[2].rollNo).toBe("SEAT_BOTTOM");
    expect(row1Seats[2].position).toBe(3);
  });
});

