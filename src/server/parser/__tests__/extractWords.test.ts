import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { extractWordsFromPdf } from "../extractWords";

describe("Task 1: extractWordsFromPdf", () => {
  const pdfPath = path.resolve(__dirname, "../../../../samples/Seating Plan 1 July 2026(Evening).pdf");

  it("should extract words from a valid PDF and flip Y coordinates", async () => {
    const pdfBuffer = fs.readFileSync(pdfPath);
    const pages = await extractWordsFromPdf(pdfBuffer);

    expect(pages.length).toBe(16);

    // Check page 3 (Room 201)
    const page3 = pages[2];
    expect(page3.pageNumber).toBe(3);
    expect(page3.page).toBe(3);
    expect(page3.words.length).toBeGreaterThan(50);

    // Verify word properties
    const firstWord = page3.words[0];
    expect(firstWord).toHaveProperty("text");
    expect(firstWord).toHaveProperty("x");
    expect(firstWord).toHaveProperty("y");
    expect(firstWord).toHaveProperty("pageNumber");
    expect(firstWord).toHaveProperty("page");

    // Y coordinate should be flipped (top of the page is near 0)
    // The Room header at the top has y around 36
    const roomWord = page3.words.find((w) => /Room:\s*201/i.test(w.text));
    expect(roomWord).toBeDefined();
    expect(roomWord!.y).toBeLessThan(100);
  });
});
