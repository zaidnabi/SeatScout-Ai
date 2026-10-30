import { ExtractedPage, ExtractedWord, RoomBlock } from "./types";
import { PATTERNS } from "./patterns";

export type { RoomBlock };

/**
 * Task 3: Group words by page and split on the 'Room:' header.
 * Keeps the page number for every room and handles multi-page room continuations.
 */
export function splitRooms(pages: ExtractedPage[]): RoomBlock[] {
  const roomBlocks: RoomBlock[] = [];
  let currentRoom: RoomBlock | null = null;

  for (const page of pages) {
    // Sort words top-to-bottom, left-to-right
    const sortedWords = [...page.words].sort((a, b) => a.y - b.y || a.x - b.x);

    // Skip global summary / capacity overview pages
    const pageText = sortedWords.map((w) => w.text).join(" ");
    if (pageText.includes("Seating Capacity") || pageText.includes("GLOBAL COURSE-WISE")) {
      continue;
    }

    // Check if this page contains a Room header
    let pageRoomName: string | null = null;
    for (const w of sortedWords) {
      const match = w.text.match(PATTERNS.roomHeader);
      if (match) {
        pageRoomName = match[1].trim();
        break;
      }
    }

    // If no single word matched, check if adjacent text in header has "Room:"
    if (!pageRoomName) {
      const match = pageText.match(PATTERNS.roomHeader);
      if (match) {
        pageRoomName = match[1].trim();
      }
    }

    if (pageRoomName) {
      // New room found on this page
      if (currentRoom) {
        roomBlocks.push(currentRoom);
      }
      currentRoom = {
        roomName: pageRoomName,
        pageNumber: page.pageNumber,
        words: [...sortedWords],
      };
    } else if (currentRoom) {
      // Continuation of previous room on a new page
      currentRoom.words.push(...sortedWords);
    }
  }

  if (currentRoom) {
    roomBlocks.push(currentRoom);
  }

  return roomBlocks;
}
