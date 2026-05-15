"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    const form = e.currentTarget;
    const fd = new FormData(form);

    // Honeypot: bots fill every field; humans skip the hidden one.
    if (fd.get("company")) {
      setStatus("sent");
      return;
    }

    setStatus("submitting");
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          email: fd.get("email"),
          organisation: fd.get("organisation"),
          projectType: fd.get("projectType"),
          budget: fd.get("budget"),
          message: fd.get("message"),
        }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Submission failed");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 ring-1 ring-black/5">
        <p className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500">
          Brief received
        </p>
        <h3 className="mt-3 text-2xl font-medium tracking-tight text-neutral-950">
          Thanks. I&apos;ll be in touch within 1 to 2 working days.
        </h3>
        <p className="mt-3 max-w-[52ch] text-base text-neutral-500">
          If it&apos;s urgent or you don&apos;t hear back, email me directly at
          elijahkasujja@gmail.com.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-medium text-neutral-950 underline-offset-4 hover:underline"
        >
          Send another <span className="icon ml-1" style={{ fontSize: "0.75em" }}>arrow-right</span>
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
        <Field
          label="Your name"
          name="name"
          autoComplete="name"
          required
          className="sm:col-span-1"
        />
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="sm:col-span-1"
        />
        <Field
          label="Organisation"
          name="organisation"
          autoComplete="organization"
          className="sm:col-span-2"
        />
        <Select
          label="Project type"
          name="projectType"
          className="sm:col-span-1"
          options={[
            "Organisation website",
            "Campaign or content site",
            "Brand site",
            "Redesign",
            "Other",
          ]}
        />
        <Select
          label="Budget"
          name="budget"
          className="sm:col-span-1"
          options={[
            "Under $5k",
            "$5k — $15k",
            "$15k — $30k",
            "$30k — $60k",
            "$60k+",
            "Not sure yet",
          ]}
        />
        <Textarea
          label="Tell me about the project"
          name="message"
          rows={6}
          required
          className="sm:col-span-2"
          hint="Audience, timeline, links, or anything else that gives useful context."
        />
        {/* honeypot */}
        <label
          aria-hidden="true"
          className="absolute left-[-9999px] h-0 w-0 overflow-hidden"
        >
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200 pt-8">
        <p className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500">
          {error ?? "Usually replies within 1 to 2 working days"}
        </p>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex min-h-10 items-center rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-medium text-white transition-[transform,background-color,color] duration-200 hover:bg-neutral-800 active:scale-[0.96] disabled:opacity-60"
        >
          {status === "submitting" ? "Sending…" : "Send brief"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  required,
  className = "",
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500">
        {label}
        {required ? <span className="text-neutral-400"> ·required</span> : null}
      </span>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-base text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none focus:ring-2 focus:ring-neutral-950/10"
      />
    </label>
  );
}

function Textarea({
  label,
  name,
  rows = 5,
  required,
  className = "",
  hint,
}: {
  label: string;
  name: string;
  rows?: number;
  required?: boolean;
  className?: string;
  hint?: string;
}) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500">
        {label}
        {required ? <span className="text-neutral-400"> ·required</span> : null}
      </span>
      <textarea
        name={name}
        rows={rows}
        required={required}
        className="resize-y rounded-xl border border-neutral-200 bg-white px-4 py-3 text-base text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none focus:ring-2 focus:ring-neutral-950/10"
      />
      {hint ? <span className="text-sm text-neutral-500">{hint}</span> : null}
    </label>
  );
}

function Select({
  label,
  name,
  options,
  className = "",
}: {
  label: string;
  name: string;
  options: string[];
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500">
        {label}
      </span>
      <select
        name={name}
        defaultValue=""
        className="appearance-none rounded-xl border border-neutral-200 bg-white bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%270%200%2012%208%27%20fill%3D%27none%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cpath%20d%3D%27M1%201l5%205%205-5%27%20stroke%3D%27%23737373%27%20stroke-width%3D%271.5%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_8px] bg-[position:right_1rem_center] bg-no-repeat px-4 py-2.5 pr-10 text-base text-neutral-950 focus:border-neutral-950 focus:outline-none focus:ring-2 focus:ring-neutral-950/10"
      >
        <option value="" disabled className="text-neutral-400">
          Choose one…
        </option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}
