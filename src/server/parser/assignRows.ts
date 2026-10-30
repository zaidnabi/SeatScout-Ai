import { ExtractedWord, ParsedSeat, RowAnchor } from "./types";
import { PATTERNS } from "./patterns";

export type { RowAnchor };

/**
 * Extract Row 1 to Row N anchors and their X coordinates from page words.
 */
export function extractRowAnchors(words: ExtractedWord[]): RowAnchor[] {
  const rowWords = words.filter((w) => PATTERNS.rowHeader.test(w.text));

  const anchors: RowAnchor[] = [];
  for (const w of rowWords) {
    const match = w.text.match(PATTERNS.rowHeader);
    if (match) {
      anchors.push({
        rowNo: parseInt(match[1], 10),
        x: w.x,
        y: w.y,
        text: w.text,
      });
    }
  }

  // Sort anchors by row number (Row 1, Row 2, Row 3...)
  return anchors.sort((a, b) => a.rowNo - b.rowNo);
}

/**
 * Task 5: Find the x positions of the Row 1 to Row 5 (or N) labels,
 * assign each roll number / seat to the nearest column, and order by y for position.
 */
export function assignRows(
  seats: ParsedSeat[],
  rowAnchorsOrWords: RowAnchor[] | ExtractedWord[]
): ParsedSeat[] {
  if (seats.length === 0) return seats;

  // Determine row anchors
  let anchors: RowAnchor[];
  if (rowAnchorsOrWords.length > 0 && "rowNo" in rowAnchorsOrWords[0]) {
    anchors = rowAnchorsOrWords as RowAnchor[];
  } else {
    anchors = extractRowAnchors(rowAnchorsOrWords as ExtractedWord[]);
  }

  // If no row anchors found, default to Row 1
  if (anchors.length === 0) {
    return seats.map((s, idx) => ({
      ...s,
      rowNo: 1,
      position: idx + 1,
    }));
  }

  // 1. Assign each seat to the nearest row column based on horizontal distance
  const assigned = seats.map((seat) => {
    let nearestRow = anchors[0].rowNo;
    let minDistance = Infinity;

    for (const anchor of anchors) {
      const distance = Math.abs(seat.x - anchor.x);
      if (distance < minDistance) {
        minDistance = distance;
        nearestRow = anchor.rowNo;
      }
    }

    return {
      ...seat,
      rowNo: nearestRow,
    };
  });

  // 2. Group by rowNo
  const rowGroups = new Map<number, ParsedSeat[]>();
  for (const seat of assigned) {
    if (!rowGroups.has(seat.rowNo)) {
      rowGroups.set(seat.rowNo, []);
    }
    rowGroups.get(seat.rowNo)!.push(seat);
  }

  // 3. Order each row by y ascending (and tie-break by x ascending), then assign position 1..N
  const result: ParsedSeat[] = [];
  // Sort row groups by rowNo
  const sortedRowNos = Array.from(rowGroups.keys()).sort((a, b) => a - b);

  for (const rowNo of sortedRowNos) {
    const seatsInRow = rowGroups.get(rowNo)!;
    seatsInRow.sort((a, b) => {
      // Primary: Y coordinate (top to bottom)
      const dy = a.y - b.y;
      if (Math.abs(dy) > 4) {
        return dy;
      }
      // Secondary: X coordinate (left to right within same bench)
      return a.x - b.x;
    });

    seatsInRow.forEach((seat, idx) => {
      seat.position = idx + 1;
      result.push(seat);
    });
  }

  return result;
}

