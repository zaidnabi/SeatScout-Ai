import { describe, it, expect } from "vitest";
import { normalizeRoll, isValidRoll, safeNormalizeRoll } from "@/lib/normalizeRoll";
import { BadRequestError } from "@/server/utils/errors";

describe("Task 1: normalizeRoll", () => {
  it("should trim, uppercase and return valid roll numbers", () => {
    expect(normalizeRoll("f23605033")).toBe("F23605033");
    expect(normalizeRoll("  F24607069  ")).toBe("F24607069");
    expect(normalizeRoll("f25602050\n")).toBe("F25602050");
  });

  it("should throw friendly BadRequestError for invalid formats", () => {
    expect(() => normalizeRoll("")).toThrow(BadRequestError);
    expect(() => normalizeRoll("   ")).toThrow(BadRequestError);
    expect(() => normalizeRoll("123456789")).toThrow(BadRequestError);
    expect(() => normalizeRoll("F123")).toThrow(BadRequestError);
    expect(() => normalizeRoll("F123456789999")).toThrow(BadRequestError);
    expect(() => normalizeRoll(null as any)).toThrow(BadRequestError);
  });

  it("should validate roll formats via isValidRoll helper", () => {
    expect(isValidRoll("F23605033")).toBe(true);
    expect(isValidRoll("f23605033")).toBe(true);
    expect(isValidRoll("INVALID")).toBe(false);
  });

  it("should safely normalize without throwing using safeNormalizeRoll", () => {
    const valid = safeNormalizeRoll("f23605033");
    expect("roll" in valid && valid.roll).toBe("F23605033");

    const invalid = safeNormalizeRoll("bad-input");
    expect("error" in invalid).toBe(true);
  });
});

