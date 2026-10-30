/**
 * Task 2: Centralized Regular Expressions for Spatial Parsing
 */

// Default roll number pattern (e.g., F24607069, F23605010)
export const DEFAULT_ROLL_PATTERN = /^F\d{8}$/i;

// Default course code pattern (e.g., CS230, CS4111, MATH2307, GE111, SS2005)
export const DEFAULT_COURSE_PATTERN = /^[A-Z]{2,4}\d{3,4}$/i;

let currentRollPattern = DEFAULT_ROLL_PATTERN;

export const PATTERNS = {
  // Configurable Roll Number Pattern
  get rollNumber(): RegExp {
    return currentRollPattern;
  },

  // Course Code Pattern
  courseCode: DEFAULT_COURSE_PATTERN,

  // Header metadata extractors
  roomHeader: /Room\s*:\s*(\d{3,4})/i,
  dateHeader: /(?:Date\s*:\s*)?(\d{1,2}\s+[A-Za-z]+\s+\d{2,4}|\d{2}[-/.]\d{2}[-/.]\d{4})/i,
  sessionHeader: /(?:Session\s*:\s*)?(Morning|Evening)/i,

  // Column Anchors
  rowHeader: /^Row\s*(\d+)$/i,

  // Empty Seat Literal
  emptySeat: /^EMPTY$/i,
};

/**
 * Configure or update roll number pattern dynamically.
 */
export function setRollNumberPattern(pattern: RegExp): void {
  currentRollPattern = pattern;
}

/**
 * Get current configured roll number pattern.
 */
export function getRollNumberPattern(): RegExp {
  return currentRollPattern;
}

/**
 * Reset roll pattern back to default.
 */
export function resetRollNumberPattern(): void {
  currentRollPattern = DEFAULT_ROLL_PATTERN;
}
