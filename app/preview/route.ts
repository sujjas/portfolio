import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PREVIEW_COOKIE } from "@/proxy";

/**
 * Turns a private link into a cookie. Visiting
 *   /preview?key=<PRIVATE_PREVIEW_KEY>
 * sets the gate cookie and sends the visitor to the product index. A wrong
 * or missing key returns the same 404 the gate does, so the route itself
 * reveals nothing.
 */
export function GET(request: NextRequest) {
  const expected = process.env.PRIVATE_PREVIEW_KEY;
  const key = request.nextUrl.searchParams.get("key");

  if (!expected || !key || key !== expected) {
    return new NextResponse(null, { status: 404 });
  }

  const dest = request.nextUrl.searchParams.get("to") || "/product";
  const to = new URL(dest.startsWith("/") ? dest : "/product", request.url);
  const res = NextResponse.redirect(to);
  res.cookies.set({
    name: PREVIEW_COOKIE,
    value: expected,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}
