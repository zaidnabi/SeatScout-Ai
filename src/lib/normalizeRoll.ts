import { BadRequestError } from "@/server/utils/errors";

export const ROLL_NUMBER_REGEX = /^F\d{8}$/i;

/**
 * Checks whether a given string matches the standard roll number format.
 */
export function isValidRoll(roll: string): boolean {
  if (!roll || typeof roll !== "string") return false;
  return ROLL_NUMBER_REGEX.test(roll.trim());
}

/**
 * Task 1: Trim, uppercase and validate the roll format.
 * Throws a friendly BadRequestError for invalid input.
 */
export function normalizeRoll(input: unknown): string {
  if (typeof input !== "string" || !input.trim()) {
    throw new BadRequestError("Roll number is required. Please provide a roll number (e.g. F23605033).");
  }

  const cleaned = input.trim().toUpperCase();

  if (!ROLL_NUMBER_REGEX.test(cleaned)) {
    throw new BadRequestError(
      `"${cleaned}" is not a valid roll number. Roll numbers must start with 'F' followed by 8 digits (e.g. F23605033).`
    );
  }

  return cleaned;
}

/**
 * Safe version that returns an object instead of throwing.
 */
export function safeNormalizeRoll(input: unknown): { roll: string } | { error: string } {
  try {
    return { roll: normalizeRoll(input) };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid roll number";
    return { error: message };
  }
}
