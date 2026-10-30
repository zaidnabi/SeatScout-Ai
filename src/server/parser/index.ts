import { extractWordsFromPdf } from "./extractWords";
import { splitRooms } from "./splitRooms";
import { parseHeader } from "./parseHeader";
import { parseSeatCells } from "./parseSeatCell";
import { assignRows, extractRowAnchors } from "./assignRows";
import { validateRoom, validatePlanDuplicates } from "./validate";
import { ParsedPlan, ParsedRoom, ParserSummary, ValidationIssue } from "./types";

export * from "./types";
export * from "./extractWords";
export * from "./patterns";
export * from "./splitRooms";
export * from "./parseHeader";
export * from "./assignRows";
export * from "./parseSeatCell";
export * from "./validate";

/**
 * Task 8: Main Entry Point - parsePlanPdf(buffer)
 * Turns a PDF buffer into validated, structured exam seating data.
 * Returns date, session, rooms (with seats, header counts, and issues) and summary.
 */
export async function parsePlanPdf(pdfBuffer: Buffer): Promise<ParsedPlan> {
  // 1. Extract words with flipped coordinates
  const pages = await extractWordsFromPdf(pdfBuffer);

  // 2. Split into room blocks
  const roomBlocks = splitRooms(pages);

  const rooms: ParsedRoom[] = [];
  const allIssues: ValidationIssue[] = [];

  let planDate = "UNKNOWN";
  let planSession: "Morning" | "Evening" | "UNKNOWN" = "UNKNOWN";

  let totalSeats = 0;
  let totalStudents = 0;
  let totalEmptySeats = 0;

  // 3. Process each room
  for (const block of roomBlocks) {
    const header = parseHeader(block.words);

    if (planDate === "UNKNOWN" && header.examDate !== "UNKNOWN") {
      planDate = header.examDate;
    }
    if (planSession === "UNKNOWN" && header.session !== "UNKNOWN") {
      planSession = header.session;
    }

    // Parse cell contents
    const { seats: rawSeats, unknownWords } = parseSeatCells(
      block.words,
      header.roomName,
      block.pageNumber
    );

    // Assign Row 1 to Row N and positions
    const rowAnchors = extractRowAnchors(block.words);
    const assignedSeats = assignRows(rawSeats, rowAnchors);

    // Validate room
    const roomIssues = validateRoom(header, assignedSeats, unknownWords.length);
    allIssues.push(...roomIssues);

    const roomStudents = assignedSeats.filter((s) => !s.isEmpty).length;
    const roomEmpties = assignedSeats.filter((s) => s.isEmpty).length;

    totalSeats += assignedSeats.length;
    totalStudents += roomStudents;
    totalEmptySeats += roomEmpties;

    rooms.push({
      room: header.roomName,
      roomName: header.roomName,
      pageNumber: block.pageNumber,
      examDate: header.examDate,
      session: header.session,
      headerCounts: header.courseCounts,
      statedTotal: header.statedTotal,
      parsedTotal: roomStudents,
      seats: assignedSeats,
      issues: roomIssues,
    });
  }

  // 4. Validate cross-room duplicate timetable clashes
  const globalClashIssues = validatePlanDuplicates(
    rooms.map((r) => ({ roomName: r.roomName, seats: r.seats }))
  );
  allIssues.push(...globalClashIssues);

  // 5. Build summary
  const summary: ParserSummary = {
    totalRooms: rooms.length,
    totalSeats,
    totalStudents,
    totalEmptySeats,
    errorsCount: allIssues.filter((i) => i.type === "error").length,
    warningsCount: allIssues.filter((i) => i.type === "warning").length,
  };

  return {
    date: planDate,
    examDate: planDate,
    session: planSession,
    rooms,
    summary,
    issues: allIssues,
  };
}

