export interface ExtractedWord {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  pageNumber: number;
  page: number; // alias for pageNumber
}

export interface ExtractedPage {
  pageNumber: number;
  page: number; // alias
  width: number;
  height: number;
  words: ExtractedWord[];
}

export interface RoomBlock {
  roomName: string;
  pageNumber: number;
  words: ExtractedWord[];
}

export interface HeaderCourseCount {
  courseCode: string;
  statedCount: number;
}

export interface ParsedHeader {
  room: string;
  roomName: string;
  date: string; // ISO format YYYY-MM-DD
  examDate: string; // ISO format YYYY-MM-DD
  session: "Morning" | "Evening" | "UNKNOWN";
  courseCounts: HeaderCourseCount[];
  statedTotal: number;
  headerWords: ExtractedWord[];
}

export interface RowAnchor {
  rowNo: number;
  x: number;
  y: number;
  text: string;
}

export interface ParsedClassSection {
  department: string;
  program: string;
  batch: string;
  section?: string;
  raw: string;
}

export interface ParsedSeat {
  rollNo: string;
  courseCode: string;
  department: string;
  program: string;
  batch: string;
  section?: string;
  rawClass: string;
  rawCourse: string;
  room: string;
  roomNumber: string;
  rowNo: number;
  position: number;
  pageNumber: number;
  isEmpty: boolean;
  x: number;
  y: number;
}

export interface ValidationIssue {
  type: "error" | "warning";
  code: string;
  message: string;
  room?: string;
  details?: Record<string, unknown>;
}

export interface ParsedRoom {
  room: string;
  roomName: string;
  pageNumber: number;
  examDate: string;
  session: "Morning" | "Evening" | "UNKNOWN";
  headerCounts: HeaderCourseCount[];
  statedTotal: number;
  parsedTotal: number;
  seats: ParsedSeat[];
  issues: ValidationIssue[];
}

export interface ParserSummary {
  totalRooms: number;
  totalSeats: number;
  totalStudents: number;
  totalEmptySeats: number;
  errorsCount: number;
  warningsCount: number;
}

export interface ParsedPlan {
  date: string;
  examDate: string;
  session: "Morning" | "Evening" | "UNKNOWN";
  rooms: ParsedRoom[];
  summary: ParserSummary;
  issues: ValidationIssue[];
}
