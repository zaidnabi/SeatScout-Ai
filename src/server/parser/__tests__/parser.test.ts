import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { parsePlanPdf } from "../index";

describe("Task 8 & 9: Full parsePlanPdf against Room 301 & Room 302 Fixtures", () => {
  const pdfPath = path.resolve(__dirname, "../../../../samples/Seating Plan 1 July 2026(Evening).pdf");
  const fixture301Path = path.resolve(__dirname, "../../../tests/fixtures/room-301.json");
  const fixture302Path = path.resolve(__dirname, "../../../tests/fixtures/room-302.json");

  it("should parse the full PDF with zero errors and match global counts", async () => {
    const pdfBuffer = fs.readFileSync(pdfPath);
    const plan = await parsePlanPdf(pdfBuffer);

    expect(plan.date).toBe("2026-07-01");
    expect(plan.session).toBe("Evening");
    expect(plan.summary.totalRooms).toBe(14);
    expect(plan.summary.totalStudents).toBe(754);
    expect(plan.summary.totalSeats).toBe(854);
    expect(plan.summary.errorsCount).toBe(0);
  });

  it("should match the saved fixture for Room 301 exactly", async () => {
    const pdfBuffer = fs.readFileSync(pdfPath);
    const plan = await parsePlanPdf(pdfBuffer);
    const room301 = plan.rooms.find((r) => r.room === "301");
    expect(room301).toBeDefined();

    const expected301 = JSON.parse(fs.readFileSync(fixture301Path, "utf-8"));
    expect(room301?.room).toBe(expected301.room);
    expect(room301?.pageNumber).toBe(expected301.pageNumber);
    expect(room301?.statedTotal).toBe(expected301.statedTotal);
    expect(room301?.parsedTotal).toBe(expected301.parsedTotal);
    expect(room301?.seats).toHaveLength(expected301.seats.length);
    expect(room301?.issues).toHaveLength(0);

    // Verify first seat in Room 301
    expect(room301?.seats[0].rollNo).toBe(expected301.seats[0].rollNo);
    expect(room301?.seats[0].rowNo).toBe(expected301.seats[0].rowNo);
    expect(room301?.seats[0].position).toBe(expected301.seats[0].position);
    expect(room301?.seats[0].courseCode).toBe(expected301.seats[0].courseCode);
  });

  it("should match the saved fixture for Room 302 exactly", async () => {
    const pdfBuffer = fs.readFileSync(pdfPath);
    const plan = await parsePlanPdf(pdfBuffer);
    const room302 = plan.rooms.find((r) => r.room === "302");
    expect(room302).toBeDefined();

    const expected302 = JSON.parse(fs.readFileSync(fixture302Path, "utf-8"));
    expect(room302?.room).toBe(expected302.room);
    expect(room302?.pageNumber).toBe(expected302.pageNumber);
    expect(room302?.statedTotal).toBe(expected302.statedTotal);
    expect(room302?.parsedTotal).toBe(expected302.parsedTotal);
    expect(room302?.seats).toHaveLength(expected302.seats.length);
    expect(room302?.issues).toHaveLength(0);

    // Verify first seat in Room 302
    expect(room302?.seats[0].rollNo).toBe(expected302.seats[0].rollNo);
    expect(room302?.seats[0].rowNo).toBe(expected302.seats[0].rowNo);
    expect(room302?.seats[0].position).toBe(expected302.seats[0].position);
    expect(room302?.seats[0].courseCode).toBe(expected302.seats[0].courseCode);
  });
});

