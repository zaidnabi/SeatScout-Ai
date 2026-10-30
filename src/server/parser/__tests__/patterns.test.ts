import { describe, it, expect, beforeEach } from "vitest";
import {
  PATTERNS,
  setRollNumberPattern,
  resetRollNumberPattern,
  getRollNumberPattern,
} from "../patterns";

describe("Task 2: RegEx Patterns", () => {
  beforeEach(() => {
    resetRollNumberPattern();
  });

  it("should match standard roll numbers correctly", () => {
    expect(PATTERNS.rollNumber.test("F24607069")).toBe(true);
    expect(PATTERNS.rollNumber.test("F23605010")).toBe(true);
    expect(PATTERNS.rollNumber.test("INVALID123")).toBe(false);
  });

  it("should support configurable roll number patterns", () => {
    expect(PATTERNS.rollNumber.test("B21101001")).toBe(false);

    // Reconfigure to match B-prefixed rolls
    setRollNumberPattern(/^[FB]\d{8}$/i);
    expect(getRollNumberPattern().test("B21101001")).toBe(true);
    expect(PATTERNS.rollNumber.test("B21101001")).toBe(true);

    resetRollNumberPattern();
    expect(PATTERNS.rollNumber.test("B21101001")).toBe(false);
  });

  it("should match room, date, and session header strings correctly", () => {
    const roomMatch = "Room: 301".match(PATTERNS.roomHeader);
    expect(roomMatch).not.toBeNull();
    expect(roomMatch![1]).toBe("301");

    const dateMatch = "Date: 1 July 26".match(PATTERNS.dateHeader);
    expect(dateMatch).not.toBeNull();
    expect(dateMatch![1]).toBe("1 July 26");

    const sessionMatch = "Session: Evening".match(PATTERNS.sessionHeader);
    expect(sessionMatch).not.toBeNull();
    expect(sessionMatch![1]).toBe("Evening");
  });

  it("should match empty seat literals", () => {
    expect(PATTERNS.emptySeat.test("EMPTY")).toBe(true);
    expect(PATTERNS.emptySeat.test("empty")).toBe(true);
    expect(PATTERNS.emptySeat.test("FULL")).toBe(false);
  });

  it("should match row headers", () => {
    expect(PATTERNS.rowHeader.test("Row 1")).toBe(true);
    expect(PATTERNS.rowHeader.test("Row 5")).toBe(true);
    expect(PATTERNS.rowHeader.test("Row X")).toBe(false);
  });
});
