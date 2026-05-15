import { NextResponse } from "next/server";

// Receives explicit "Send Annotations" submissions from the agentation
// toolbar. The toolbar already streams annotations live to the MCP server
// via the `endpoint` prop; this route only exists to make the visible
// "Send" button functional so the user gets explicit submit feedback.
//
// The body is the rendered markdown report plus the annotation list.
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.log("[agentation] submission received", {
        annotations: body?.annotations?.length ?? 0,
      });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
