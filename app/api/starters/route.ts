import { NextResponse } from "next/server";

/** Canned starters for the embedded Sena prototype (public/design/sena). */
export async function POST() {
  return NextResponse.json({
    starters: [
      "Where is shelf availability slipping this quarter, and in which outlet type?",
      "Compare energy-drink share between Lagos and Nairobi across the last two studies",
      "Which sustainability messages moved purchase intent among Gen Z?",
      "What changed since last month in the markets I track?",
      "Show price compliance by city for the Kilima core range",
      "Draft a two-slide summary of the Q4 brand tracker",
    ],
  });
}
