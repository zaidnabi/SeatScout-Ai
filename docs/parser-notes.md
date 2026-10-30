# Parser Documentation & Engineering Notes (Phase 2)

## Overview
The PDF parser extracts spatial text items from exam seating plan PDFs, reconstructs visual grid arrangements, extracts metadata and student allocations, and rigorously validates counts against room headers.

---

## 1. Coordinate System & Text Extraction (`extractWords.ts`)
- **Engine**: `pdfjs-dist` (legacy build with in-process worker).
- **Coordinate Transformation**:
  PDF origin `(0, 0)` starts at the bottom-left. The parser flips the Y-axis so `y = 0` is at the top-left of the page:
  $$\text{flippedY} = \text{pageHeight} - \text{rawY} - \text{itemHeight}$$
- **Output**: Returns an array of `{ text, x, y, width, height, pageNumber, page }` for each text item.

---

## 2. Regular Expressions & Pattern Matching (`patterns.ts`)
- **Roll Number**: Default `/^F\d{8}$/i` (supports dynamic configuration via `setRollNumberPattern()`).
- **Course Code**: `/^[A-Z]{2,4}\d{3,4}$/i` (e.g. `CS230`, `MATH2307`, `GE111`, `SS2005`).
- **Header Patterns**:
  - Room: `/Room\s*:\s*(\d{3,4})/i`
  - Date: `/(?:Date\s*:\s*)?(\d{1,2}\s+[A-Za-z]+\s+\d{2,4}|\d{2}[-/.]\d{2}[-/.]\d{4})/i`
  - Session: `/(?:Session\s*:\s*)?(Morning|Evening)/i`
- **Grid Anchors**:
  - Row Header: `/^Row\s*(\d+)$/i`
  - Empty Seat: `/^EMPTY$/i`

---

## 3. Room Splitting & Continuation (`splitRooms.ts`)
- Words are grouped by page and sorted top-to-bottom, left-to-right.
- Overview pages (e.g. "Seating Capacity of Academic Block" and "GLOBAL COURSE-WISE SEATING SUMMARY") are detected and skipped.
- Pages containing a `Room: <number>` header initiate a new `RoomBlock`.
- Subsequent pages without a new Room header are treated as room continuations, preserving the starting `pageNumber`.

---

## 4. Header Metadata Extraction (`parseHeader.ts`)
- **Session**: Extracted strictly from the header text (`Morning` or `Evening`), never from filenames.
- **Date**: Normalized into ISO `YYYY-MM-DD` (e.g. `1 July 26` $\to$ `2026-07-01`).
- **Per-Course / Batch Quotas**: Extracted from the visual table rows situated between the room title and the row column anchors.
- **Stated Total**: Extracted from the `Total` row (or computed from the sum of stated quotas).

---

## 5. Column & Row Assignment (`assignRows.ts`)
- Locates horizontal anchors `Row 1` through `Row 5` (or up to `Row 8` in larger halls like Room 504).
- **Horizontal Assignment**:
  Each student roll number and empty seat is assigned to the nearest column by minimizing horizontal distance:
  $$\text{rowNo} = \arg\min_r |x_{\text{seat}} - x_{\text{anchor}_r}|$$
- **Vertical Ordering & Position**:
  Within each assigned row, seats are sorted by:
  1. `y` ascending (top to bottom from front to back of room)
  2. `x` ascending (left to right tie-breaking on two-seater benches)
  Assigns 1-based sequential `position` ($1, 2, 3, \dots$).

---

## 6. Cell Content Structure (`parseSeatCell.ts`)
Each seat cell contains 3 vertical lines:
1. **Line 1 (Roll Number)**: e.g. `F23605033` (or `EMPTY` for unoccupied seats).
2. **Line 2 (Class / Program / Batch / Section)**:
   - **Shape 1 (Program + Year + Section)**: e.g. `CS24-B` (dept: `CS`, batch: `24`, section: `B`), `ME-25` (dept: `ME`, batch: `25`, section: `undefined`), `CS 25-A`, `AI-24A`, `AI 23`.
   - **Shape 2 (Batch Code)**: e.g. `BSCE-23-27`, `BSCE-23-27-A`.
3. **Line 3 (Course Code & Class Suffix)**:
   - e.g. `CS230-CS24B` $\to$ Course Code is `CS230`.
   - Text after hyphen is ignored since class/section is already captured in Line 2.
   - Handles multi-line wrapped text (e.g. `MATH2307-ME2` on line 1, `5` on line 2) cleanly by matching the course code prefix.

---

## 7. Validation & Defensive Checksums (`validate.ts`)
- **Checksum Errors**:
  - Total student count mismatch against `statedTotal` is an **ERROR**.
  - Per-course quota mismatch against stated header count is an **ERROR**.
  - Unknown / malformed cell shapes are **ERRORS**.
- **Warnings**:
  - Duplicate roll numbers (within the room or across rooms in the same exam session) are flagged as **WARNINGS**, allowing valid timetable clashes to be reviewed rather than failing the parse.

---

## 8. Verification Results on `Seating Plan 1 July 2026(Evening).pdf`
- **Total Rooms**: 14 (Rooms 201, 202, 204, 301, 302, 303, 304, 401, 402, 403, 404, 501, 503, 504)
- **Total Students Parsed**: 754 (Matches global PDF summary)
- **Total Capacity / Seats**: 854 (Matches global capacity overview)
- **Empty Seats Handled**: 100
- **Validation Errors**: 0
- **Validation Warnings**: 0
- **Execution Duration**: ~870 ms
- **Fixtures Saved**: `src/tests/fixtures/room-301.json` & `src/tests/fixtures/room-302.json`
