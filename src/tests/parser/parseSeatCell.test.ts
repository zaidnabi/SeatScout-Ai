import { describe, it, expect } from "vitest";
import {
  parseClassSection,
  parseCourseCode,
  parseSeatCells,
} from "@/server/parser/parseSeatCell";
import { ExtractedWord } from "@/server/parser/types";

describe("Task 6: parseSeatCell", () => {
  describe("parseClassSection", () => {
    it("should parse program + batch + section like CS24-B", () => {
      const res = parseClassSection("CS24-B");
      expect(res).toEqual({
        department: "CS",
        program: "CS",
        batch: "24",
        section: "B",
        raw: "CS24-B",
      });
    });

    it("should parse department + batch without section like ME-25 and AI 23", () => {
      const res1 = parseClassSection("ME-25");
      expect(res1).toEqual({
        department: "ME",
        program: "ME",
        batch: "25",
        section: undefined,
        raw: "ME-25",
      });

      const res2 = parseClassSection("AI 23");
      expect(res2).toEqual({
        department: "AI",
        program: "AI",
        batch: "23",
        section: undefined,
        raw: "AI 23",
      });
    });

    it("should parse spaced and hyphenated variants like CS 25-A and AI-24A", () => {
      const res1 = parseClassSection("CS 25-A");
      expect(res1?.section).toBe("A");
      expect(res1?.batch).toBe("25");

      const res2 = parseClassSection("AI-24A");
      expect(res2?.section).toBe("A");
      expect(res2?.batch).toBe("24");
    });

    it("should handle Shape 2 batch codes like BSCE-23-27 and BSCE-23-27-A", () => {
      const res1 = parseClassSection("BSCE-23-27");
      expect(res1).toEqual({
        department: "BSCE",
        program: "BSCE",
        batch: "23-27",
        section: undefined,
        raw: "BSCE-23-27",
      });

      const res2 = parseClassSection("BSCE-23-27-A");
      expect(res2).toEqual({
        department: "BSCE",
        program: "BSCE",
        batch: "23-27",
        section: "A",
        raw: "BSCE-23-27-A",
      });
    });
  });

  describe("parseCourseCode", () => {
    it("should extract pure course code before hyphen and ignore section suffix", () => {
      expect(parseCourseCode("CS230-CS24B")).toBe("CS230");
      expect(parseCourseCode("MATH2307-ME25")).toBe("MATH2307");
      expect(parseCourseCode("MATH2307-ME2")).toBe("MATH2307");
      expect(parseCourseCode("GE111-AI24B")).toBe("GE111");
      expect(parseCourseCode("SS2005-EE24")).toBe("SS2005");
      expect(parseCourseCode("CS4111")).toBe("CS4111");
    });
  });

  describe("parseSeatCells", () => {
    it("should parse 3-line student cells and EMPTY seats", () => {
      const words: ExtractedWord[] = [
        { text: "Row 1", x: 93, y: 167, width: 30, height: 10, pageNumber: 3, page: 3 },
        // Student Cell 1
        { text: "F24605068", x: 48.9, y: 218.5, width: 40, height: 8, pageNumber: 3, page: 3 },
        { text: "CS24-B", x: 55.1, y: 228.5, width: 28, height: 8, pageNumber: 3, page: 3 },
        { text: "CS230-CS24B", x: 42.9, y: 238.5, width: 52, height: 8, pageNumber: 3, page: 3 },
        // Empty Cell
        { text: "EMPTY", x: 127.0, y: 218.5, width: 40, height: 8, pageNumber: 3, page: 3 },
      ];

      const { seats, unknownWords } = parseSeatCells(words, "201", 3);
      expect(unknownWords).toHaveLength(0);
      expect(seats).toHaveLength(2);

      const student = seats.find((s) => !s.isEmpty);
      expect(student).toBeDefined();
      expect(student?.rollNo).toBe("F24605068");
      expect(student?.department).toBe("CS");
      expect(student?.batch).toBe("24");
      expect(student?.section).toBe("B");
      expect(student?.courseCode).toBe("CS230");

      const empty = seats.find((s) => s.isEmpty);
      expect(empty).toBeDefined();
      expect(empty?.rollNo).toBe("EMPTY");
      expect(empty?.isEmpty).toBe(true);
    });
  });
});

