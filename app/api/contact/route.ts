import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || !body.name || !body.email || !body.message) {
      return NextResponse.json({ ok: false, error: "missing fields" }, { status: 400 });
    }

    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.log("[contact] new brief", {
        name: body.name,
        email: body.email,
        organisation: body.organisation ?? null,
        projectType: body.projectType ?? null,
        budget: body.budget ?? null,
        length: typeof body.message === "string" ? body.message.length : 0,
      });
    }

    // TODO: forward to Formspree / Resend / Postmark before launch.

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "server error" }, { status: 500 });
  }
}
