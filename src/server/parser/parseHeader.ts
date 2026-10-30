import { ExtractedWord, HeaderCourseCount, ParsedHeader } from "./types";
import { PATTERNS } from "./patterns";

export type { HeaderCourseCount, ParsedHeader };

/**
 * Task 4: Parse header metadata from room words.
 * Extracts room number, ISO date, session (strictly from header, never from filename),
 * per-course quotas, and stated total count.
 */
export function parseHeader(words: ExtractedWord[]): ParsedHeader {
  // Identify the top header region (text above the first 'Row' anchor)
  const rowWords = words.filter((w) => PATTERNS.rowHeader.test(w.text));
  const firstRowY = rowWords.length > 0 ? Math.min(...rowWords.map((w) => w.y)) : 160;

  const headerWords = words.filter((w) => w.y < firstRowY);

  // Group header words into visual lines by Y coordinate (within ±4px)
  const lineMap = new Map<number, ExtractedWord[]>();
  for (const w of headerWords) {
    let matchedY: number | null = null;
    for (const y of lineMap.keys()) {
      if (Math.abs(y - w.y) <= 4) {
        matchedY = y;
        break;
      }
    }
    if (matchedY !== null) {
      lineMap.get(matchedY)!.push(w);
    } else {
      lineMap.set(w.y, [w]);
    }
  }

  const sortedY = Array.from(lineMap.keys()).sort((a, b) => a - b);

  let room = "UNKNOWN";
  let examDate = "UNKNOWN";
  let session: "Morning" | "Evening" | "UNKNOWN" = "UNKNOWN";
  const courseCounts: HeaderCourseCount[] = [];
  let statedTotal = 0;

  for (const y of sortedY) {
    const lineWords = lineMap.get(y)!.sort((a, b) => a.x - b.x);
    const lineText = lineWords.map((w) => w.text).join(" ");

    // 1. Extract Room
    const roomMatch = lineText.match(PATTERNS.roomHeader);
    if (roomMatch && room === "UNKNOWN") {
      room = roomMatch[1].trim();
    }

    // 2. Extract Session (Morning / Evening)
    const sessionMatch = lineText.match(PATTERNS.sessionHeader);
    if (sessionMatch && session === "UNKNOWN") {
      const s = sessionMatch[1].toLowerCase();
      session = s === "evening" ? "Evening" : "Morning";
    }

    // 3. Extract Exam Date
    const dateMatch = lineText.match(PATTERNS.dateHeader);
    if (dateMatch && examDate === "UNKNOWN") {
      examDate = parseToIsoDate(dateMatch[1]);
    }

    // 4. Extract Total Count row
    const totalMatch = lineText.match(/Total\s*[:|=-]?\s*(\d+)/i);
    if (totalMatch) {
      statedTotal = parseInt(totalMatch[1], 10);
      continue;
    }

    // 5. Extract Per-Course/Batch Table Quotas
    // Line typically ends with a count number, preceded by class/course label
    if (lineWords.length >= 2) {
      const lastWord = lineWords[lineWords.length - 1];
      const countNum = parseInt(lastWord.text, 10);

      if (!isNaN(countNum) && /^\d+$/.test(lastWord.text)) {
        const labelWords = lineWords.slice(0, lineWords.length - 1);
        const label = labelWords.map((w) => w.text).join(" ").trim();

        if (label && !/Room|Date|Session|Total/i.test(label)) {
          courseCounts.push({
            courseCode: label,
            statedCount: countNum,
          });
        }
      }
    }
  }

  // If stated total wasn't explicitly given in a "Total" row, compute sum
  if (statedTotal === 0 && courseCounts.length > 0) {
    statedTotal = courseCounts.reduce((sum, c) => sum + c.statedCount, 0);
  }

  return {
    room,
    roomName: room,
    date: examDate,
    examDate,
    session,
    courseCounts,
    statedTotal,
    headerWords,
  };
}

/**
 * Helper to normalize date strings into ISO format YYYY-MM-DD
 */
export function parseToIsoDate(rawDate: string): string {
  const trimmed = rawDate.trim();

  // Already ISO format YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  // DD-MM-YYYY or DD/MM/YYYY
  const dmyMatch = trimmed.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})$/);
  if (dmyMatch) {
    const day = dmyMatch[1].padStart(2, "0");
    const month = dmyMatch[2].padStart(2, "0");
    let year = dmyMatch[3];
    if (year.length === 2) year = `20${year}`;
    return `${year}-${month}-${day}`;
  }

  // E.g. "1 July 26" or "01 July 2026"
  const parts = trimmed.split(/\s+/);
  if (parts.length >= 3) {
    const day = parts[0].padStart(2, "0");
    const monthStr = parts[1].toLowerCase();
    let year = parts[2];
    if (year.length === 2) year = `20${year}`;

    const months: Record<string, string> = {
      jan: "01", january: "01",
      feb: "02", february: "02",
      mar: "03", march: "03",
      apr: "04", april: "04",
      may: "05", may_: "05",
      jun: "06", june: "06",
      jul: "07", july: "07",
      aug: "08", august: "08",
      sep: "09", september: "09",
      oct: "10", october: "10",
      nov: "11", november: "11",
      dec: "12", december: "12",
    };

    const month = months[monthStr.substring(0, 3)] || "01";
    return `${year}-${month}-${day}`;
  }

  return trimmed;
}
