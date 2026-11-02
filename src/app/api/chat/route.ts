import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { message: "Chat service will be implemented in Phase 6." },
    { status: 200 }
  );
}
