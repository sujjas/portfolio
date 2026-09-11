import { NextResponse } from "next/server";

/** Device-aware store redirect used by the embedded Ela quiz funnel's QR and buttons. */
export function GET(req: Request) {
  const ua = req.headers.get("user-agent") || "";
  const ios = /iPhone|iPad|iPod|Macintosh/.test(ua);
  const url = ios
    ? "https://apps.apple.com/us/app/ela-your-ai-companion/id6448012201"
    : "https://play.google.com/store/apps/details?id=com.rwazi.ela";
  return NextResponse.redirect(url, 302);
}
