import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Private-preview gate for the product track.
 *
 * /product and /product/* are not linked from anywhere on the site and are
 * marked noindex, but that alone is guessable. This proxy also requires a
 * cookie that only /preview?key=<PRIVATE_PREVIEW_KEY> can set. Without it
 * the request is rewritten to a path that does not exist, so a visitor sees
 * the site's normal 404 and cannot tell the section is there.
 *
 * If the env var is unset, the gate fails closed.
 */
export const PREVIEW_COOKIE = "ek_preview";

export function proxy(request: NextRequest) {
  const expected = process.env.PRIVATE_PREVIEW_KEY;
  const got = request.cookies.get(PREVIEW_COOKIE)?.value;

  if (!expected || got !== expected) {
    const url = request.nextUrl.clone();
    url.pathname = "/__private";
    url.search = "";
    return NextResponse.rewrite(url, { status: 404 });
  }

  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  res.headers.set("Cache-Control", "private, no-store");
  return res;
}

export const config = {
  matcher: ["/product", "/product/:path*", "/design/:path*"],
};
