import { NextResponse } from "next/server";
import { Resend } from "resend";

type ContactBody = {
  name?: string;
  email?: string;
  organisation?: string;
  projectType?: string;
  budget?: string;
  message?: string;
};

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as ContactBody | null;
    if (!body || !body.name || !body.email || !body.message) {
      return NextResponse.json(
        { ok: false, error: "missing fields" },
        { status: 400 },
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_TO_EMAIL ?? "elijahkasujja@gmail.com";
    // Verified domain or onboarding@resend.dev while domain pending.
    const from = process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>";

    const safe = {
      name: escape(body.name),
      email: escape(body.email),
      organisation: body.organisation ? escape(body.organisation) : "—",
      projectType: body.projectType ? escape(body.projectType) : "—",
      budget: body.budget ? escape(body.budget) : "—",
      message: escape(body.message),
    };

    const subject = `New brief from ${safe.name}${
      body.organisation ? ` (${safe.organisation})` : ""
    }`;
    const text = [
      `New brief received from elijahkasujja.com`,
      ``,
      `Name:          ${body.name}`,
      `Email:         ${body.email}`,
      `Organisation:  ${body.organisation ?? "—"}`,
      `Project type:  ${body.projectType ?? "—"}`,
      `Budget:        ${body.budget ?? "—"}`,
      ``,
      `Message:`,
      body.message,
    ].join("\n");
    const html = `
      <div style="font-family:Inter,system-ui,sans-serif;max-width:560px;color:#171717;line-height:1.5">
        <p style="font:600 11px/1 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#737373">New brief — elijahkasujja.com</p>
        <h1 style="margin:8px 0 24px;font-size:20px;font-weight:600">${safe.name}<span style="color:#a3a3a3"> · ${safe.email}</span></h1>
        <table style="border-collapse:collapse;width:100%;margin-bottom:24px">
          <tbody>
            <tr><td style="padding:8px 0;color:#737373;width:140px;font:600 11px/1.4 ui-monospace,monospace;letter-spacing:.05em;text-transform:uppercase">Organisation</td><td style="padding:8px 0">${safe.organisation}</td></tr>
            <tr><td style="padding:8px 0;color:#737373;font:600 11px/1.4 ui-monospace,monospace;letter-spacing:.05em;text-transform:uppercase">Project type</td><td style="padding:8px 0">${safe.projectType}</td></tr>
            <tr><td style="padding:8px 0;color:#737373;font:600 11px/1.4 ui-monospace,monospace;letter-spacing:.05em;text-transform:uppercase">Budget</td><td style="padding:8px 0">${safe.budget}</td></tr>
          </tbody>
        </table>
        <p style="font:600 11px/1 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#737373;margin-bottom:8px">Message</p>
        <div style="white-space:pre-wrap;padding:16px;border:1px solid #e5e5e5;border-radius:12px;background:#fafafa">${safe.message}</div>
      </div>
    `;

    if (!apiKey) {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.log("[contact] RESEND_API_KEY missing — skipping send", { subject });
        return NextResponse.json({ ok: true, mailed: false });
      }
      return NextResponse.json(
        { ok: false, error: "mailer not configured" },
        { status: 500 },
      );
    }

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: body.email,
      subject,
      text,
      html,
    });

    if (error) {
      // eslint-disable-next-line no-console
      console.error("[contact] resend error", error);
      return NextResponse.json(
        { ok: false, error: "mail send failed" },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "server error" },
      { status: 500 },
    );
  }
}
