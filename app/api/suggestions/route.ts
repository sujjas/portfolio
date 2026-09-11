import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    suggestions: ["Show me by outlet type", "Compare with Nairobi", "Turn this into a chart"],
  });
}
