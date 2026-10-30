import { ExtractedWord, ParsedClassSection, ParsedSeat } from "./types";
import { PATTERNS } from "./patterns";

export type { ParsedClassSection, ParsedSeat };

/**
 * Task 6: Parse seat cell contents.
 * Reads roll number, program/department, batch, section, and course code.
 * Handles both cell shapes:
 * 1) Program plus year/batch & section: CS24-B, ME-25, CS 25-A, AI-24A, AI 23
 * 2) Batch code: BSCE-23-27, BSCE-23-27-A
 * And EMPTY seats.
 */

/**
 * Parse line 2: program/department, batch, and optional section.
 */
export function parseClassSection(raw: string): ParsedClassSection | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // Shape 2: Batch code like BSCE-23-27 or BSCE-23-27-A
  const batchCodeMatch = trimmed.match(/^([A-Z]{2,6})[- ](\d{2}-\d{2})(?:[- ]?([A-Z]))?$/i);
  if (batchCodeMatch) {
    const prog = batchCodeMatch[1].toUpperCase();
    return {
      department: prog,
      program: prog,
      batch: batchCodeMatch[2],
      section: batchCodeMatch[3] ? batchCodeMatch[3].toUpperCase() : undefined,
      raw: trimmed,
    };
  }

  // Shape 1: Program plus year & optional section (e.g. CS24-B, ME-25, CS 25-A, AI-24A, AI 23)
  const shape1Match = trimmed.match(/^([A-Z]{2,6})[- ]?(\d{2,4})(?:[- ]?([A-Z]))?$/i);
  if (shape1Match) {
    const prog = shape1Match[1].toUpperCase();
    return {
      department: prog,
      program: prog,
      batch: shape1Match[2],
      section: shape1Match[3] ? shape1Match[3].toUpperCase() : undefined,
      raw: trimmed,
    };
  }

  return null;
}

/**
 * Parse line 3: Course code.
 * Extracts the course code before any hyphen/section suffix.
 * e.g., "CS230-CS24B" -> "CS230", "MATH2307-ME25" -> "MATH2307"
 */
export function parseCourseCode(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";

  // Match course code prefix (e.g. CS230, CS4111, MATH2307, GE111, SS2005)
  const match = trimmed.match(/^([A-Z]{2,4}\d{3,4})/i);
  if (match) {
    return match[1].toUpperCase();
  }

  // Fallback: take portion before hyphen
  return trimmed.split("-")[0].trim().toUpperCase();
}

export interface ParseCellsResult {
  seats: ParsedSeat[];
  unknownWords: ExtractedWord[];
}

/**
 * Parses all seat cells (student seats and EMPTY seats) from room words.
 */
export function parseSeatCells(
  words: ExtractedWord[],
  roomName: string,
  pageNumber: number
): ParseCellsResult {
  const rowWords = words.filter((w) => PATTERNS.rowHeader.test(w.text));
  const firstRowY = rowWords.length > 0 ? Math.min(...rowWords.map((w) => w.y)) : 160;

  // Grid words are below the Row headers
  const gridWords = words.filter((w) => w.y > firstRowY + 10);

  const rollWords = gridWords.filter((w) => PATTERNS.rollNumber.test(w.text));
  const emptyWords = gridWords.filter((w) => PATTERNS.emptySeat.test(w.text));
  const otherWords = gridWords.filter(
    (w) => !PATTERNS.rollNumber.test(w.text) && !PATTERNS.emptySeat.test(w.text)
  );

  const seats: ParsedSeat[] = [];
  const unknownWords: ExtractedWord[] = [];
  const claimedWordIndices = new Set<number>();

  // Process student roll numbers
  for (const r of rollWords) {
    // Find text lines directly beneath this roll number
    const beneathIndices: number[] = [];
    for (let i = 0; i < otherWords.length; i++) {
      const w = otherWords[i];
      if (Math.abs(w.x - r.x) < 30 && w.y > r.y && w.y <= r.y + 35) {
        beneathIndices.push(i);
      }
    }

    beneathIndices.sort((a, b) => otherWords[a].y - otherWords[b].y);

    const line2Word = beneathIndices[0] !== undefined ? otherWords[beneathIndices[0]] : null;
    const line3Word = beneathIndices[1] !== undefined ? otherWords[beneathIndices[1]] : null;

    if (line2Word) claimedWordIndices.add(beneathIndices[0]);
    if (line3Word) claimedWordIndices.add(beneathIndices[1]);

    const line2 = line2Word ? line2Word.text : "";
    const line3 = line3Word ? line3Word.text : "";

    const parsedClass = parseClassSection(line2);
    const courseCode = parseCourseCode(line3);

    if (!parsedClass && line2) {
      unknownWords.push(line2Word!);
    }

    seats.push({
      rollNo: r.text.toUpperCase(),
      courseCode,
      department: parsedClass ? parsedClass.department : "",
      program: parsedClass ? parsedClass.program : "",
      batch: parsedClass ? parsedClass.batch : "",
      section: parsedClass ? parsedClass.section : undefined,
      rawClass: line2,
      rawCourse: line3,
      room: roomName,
      roomNumber: roomName,
      rowNo: 1, // updated by assignRows
      position: 1, // updated by assignRows
      pageNumber,
      isEmpty: false,
      x: r.x,
      y: r.y,
    });
  }

  // Process EMPTY seats
  for (const e of emptyWords) {
    seats.push({
      rollNo: "EMPTY",
      courseCode: "",
      department: "",
      program: "",
      batch: "",
      section: undefined,
      rawClass: "",
      rawCourse: "",
      room: roomName,
      roomNumber: roomName,
      rowNo: 1,
      position: 1,
      pageNumber,
      isEmpty: true,
      x: e.x,
      y: e.y,
    });
  }

  return { seats, unknownWords };
}

