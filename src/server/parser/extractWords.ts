import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import "pdfjs-dist/legacy/build/pdf.worker.mjs";
import { ExtractedPage, ExtractedWord } from "./types";

export type { ExtractedPage, ExtractedWord };

/**
 * Task 1: Extract all text items from a PDF buffer with spatial coordinates.
 * Uses pdfjs legacy build with worker disabled.
 * Flips the Y-axis so y=0 is at the top of the page.
 */
export async function extractWordsFromPdf(pdfBuffer: Buffer): Promise<ExtractedPage[]> {
  const data = new Uint8Array(pdfBuffer);

  const loadingTask = pdfjsLib.getDocument({
    data,
    useSystemFonts: true,
    disableFontFace: true,
    verbosity: 0,
  });

  const pdfDocument = await loadingTask.promise;
  const pages: ExtractedPage[] = [];

  for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
    const page = await pdfDocument.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.0 });
    const pageHeight = viewport.height;
    const textContent = await page.getTextContent();

    const words: ExtractedWord[] = [];

    for (const item of textContent.items) {
      if (!("str" in item) || !item.str.trim()) continue;

      const tx = item.transform;
      const rawX = tx[4];
      const rawY = tx[5];
      const itemWidth = item.width || 0;
      const itemHeight = item.height || Math.abs(tx[3]) || 10;

      // Flip Y axis so y=0 is at the top of the page
      const flippedY = pageHeight - rawY - itemHeight;

      words.push({
        text: item.str.trim(),
        x: Math.round(rawX * 100) / 100,
        y: Math.round(flippedY * 100) / 100,
        width: Math.round(itemWidth * 100) / 100,
        height: Math.round(itemHeight * 100) / 100,
        pageNumber: pageNum,
        page: pageNum,
      });
    }

    pages.push({
      pageNumber: pageNum,
      page: pageNum,
      width: Math.round(viewport.width),
      height: Math.round(pageHeight),
      words,
    });
  }

  return pages;
}
