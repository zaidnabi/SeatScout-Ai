import fs from "fs";
import path from "path";
import { parsePlanPdf } from "../src/server/parser";

async function main() {
  const pdfPath = path.resolve(__dirname, "../samples/Seating Plan 1 July 2026(Evening).pdf");
  console.log(`📄 Loading PDF from ${pdfPath}...`);
  const buf = fs.readFileSync(pdfPath);

  console.log("⚙️ Parsing PDF...");
  const startTime = performance.now();
  const plan = await parsePlanPdf(buf);
  const duration = (performance.now() - startTime).toFixed(2);

  console.log(`\n🎉 Parsed in ${duration} ms!`);
  console.log(`📅 Date: ${plan.date}`);
  console.log(`🕒 Session: ${plan.session}`);
  console.log(`🏫 Total Rooms: ${plan.summary.totalRooms}`);
  console.log(`👥 Total Students: ${plan.summary.totalStudents}`);
  console.log(`🪑 Total Seats: ${plan.summary.totalSeats}`);
  console.log(`🛑 Total Errors: ${plan.summary.errorsCount}`);
  console.log(`⚠️ Total Warnings: ${plan.summary.warningsCount}`);

  console.log("\n--- Room Breakdown ---");
  for (const r of plan.rooms) {
    const studentCount = r.seats.filter(s => !s.isEmpty).length;
    const emptyCount = r.seats.filter(s => s.isEmpty).length;
    const status = r.issues.filter(i => i.type === "error").length === 0 ? "✅ OK" : "❌ ERROR";
    console.log(
      `Room ${r.room} (Page ${r.pageNumber}): ${status} | Stated: ${r.statedTotal} | Parsed: ${studentCount} students + ${emptyCount} empty seats`
    );
  }

  if (plan.issues.length > 0) {
    console.log("\n⚠️ Issues reported:");
    for (const issue of plan.issues) {
      console.log(`[${issue.type.toUpperCase()}] ${issue.code}: ${issue.message}`);
    }
  }

  // Save Room 301 and Room 302 fixtures
  const room301 = plan.rooms.find(r => r.room === "301");
  const room302 = plan.rooms.find(r => r.room === "302");

  if (room301) {
    const fixture301Path = path.resolve(__dirname, "../src/tests/fixtures/room-301.json");
    fs.writeFileSync(fixture301Path, JSON.stringify(room301, null, 2), "utf-8");
    console.log(`💾 Saved fixture: ${fixture301Path}`);
  }

  if (room302) {
    const fixture302Path = path.resolve(__dirname, "../src/tests/fixtures/room-302.json");
    fs.writeFileSync(fixture302Path, JSON.stringify(room302, null, 2), "utf-8");
    console.log(`💾 Saved fixture: ${fixture302Path}`);
  }
}

main().catch((err) => {
  console.error("❌ Parser failed:", err);
  process.exit(1);
});
