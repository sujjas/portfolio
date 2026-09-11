/**
 * Shared HTML figure primitives for product case studies: step flows,
 * pipelines and labelled panels. SVG wireframes reuse ../primitives.tsx.
 */

export function Figure({
  title,
  meta,
  children,
  note,
}: {
  title: string;
  meta: string;
  children: React.ReactNode;
  note?: string;
}) {
  return (
    <figure className="rounded-2xl border border-neutral-200 bg-white p-5 ring-1 ring-black/5 md:p-6">
      <figcaption className="mb-4 flex items-center justify-between gap-4">
        <p className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500">{title}</p>
        <p className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500 tabular-nums">
          {meta}
        </p>
      </figcaption>
      {children}
      {note ? (
        <p className="mt-4 border-t border-neutral-200 pt-4 text-xs leading-relaxed text-neutral-500">
          {note}
        </p>
      ) : null}
    </figure>
  );
}

export function FlowSteps({
  steps,
  highlightLast = false,
}: {
  steps: { label: string; note: string }[];
  highlightLast?: boolean;
}) {
  return (
    <ol
      role="list"
      className="grid grid-cols-1 gap-3 sm:grid-flow-col sm:auto-cols-fr"
    >
      {steps.map((s, i) => {
        const hl = highlightLast && i === steps.length - 1;
        return (
          <li
            key={s.label}
            className={`rounded-xl border p-4 ${
              hl ? "border-neutral-950 bg-neutral-950 text-white" : "border-neutral-200 bg-neutral-50"
            }`}
          >
            <p className="font-mono text-[0.65rem] uppercase tracking-wider text-neutral-400 tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </p>
            <p className="mt-2 text-sm font-medium">{s.label}</p>
            <p className={`mt-1.5 text-xs leading-relaxed ${hl ? "text-neutral-300" : "text-neutral-600"}`}>
              {s.note}
            </p>
          </li>
        );
      })}
    </ol>
  );
}

export function Pipeline({
  nodes,
}: {
  nodes: { label: string; sub: string; tone?: "dark" | "accent" | "neutral" }[];
}) {
  return (
    <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
      {nodes.map((n, i) => (
        <div key={n.label} className="flex flex-1 flex-col items-stretch gap-2 sm:flex-row sm:items-center">
          <div
            className={`flex-1 rounded-xl border px-4 py-3 ${
              n.tone === "dark"
                ? "border-neutral-950 bg-neutral-950 text-white"
                : n.tone === "accent"
                  ? "border-violet-300 bg-violet-50 text-violet-900"
                  : "border-neutral-200 bg-neutral-50 text-neutral-900"
            }`}
          >
            <p className="text-sm font-medium">{n.label}</p>
            <p className={`mt-0.5 text-xs ${n.tone === "dark" ? "text-neutral-300" : "text-neutral-500"}`}>
              {n.sub}
            </p>
          </div>
          {i < nodes.length - 1 ? (
            <span
              aria-hidden
              className="icon self-center text-neutral-400 rotate-90 sm:rotate-0"
              style={{ fontSize: "0.8rem" }}
            >
              arrow-right
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function Panels({
  items,
  cols = 2,
}: {
  items: { label: string; title: string; body: string }[];
  cols?: 2 | 3 | 4;
}) {
  const grid = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" }[cols];
  return (
    <div className={`grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-neutral-200 bg-neutral-200 ${grid}`}>
      {items.map((p) => (
        <div key={p.title} className="bg-white p-4">
          <p className="font-mono text-[0.65rem] uppercase tracking-wider text-neutral-400">{p.label}</p>
          <p className="mt-1.5 text-sm font-medium text-neutral-950">{p.title}</p>
          <p className="mt-1 text-xs leading-relaxed text-neutral-600">{p.body}</p>
        </div>
      ))}
    </div>
  );
}

/** A phone-shaped frame for mobile mock content. */
export function Phone({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <div className="mx-auto w-full max-w-[300px]">
      <div className="rounded-[2rem] border border-neutral-300 bg-white p-2 ring-1 ring-black/5">
        <div className="flex h-[520px] flex-col overflow-hidden rounded-[1.6rem] bg-neutral-50">
          <div className="flex items-center justify-between px-5 pt-3 text-[10px] text-neutral-500">
            <span>9:41</span>
            <span aria-hidden className="h-1.5 w-12 rounded-full bg-neutral-300" />
            <span>●●●</span>
          </div>
          <div className="flex flex-1 flex-col gap-2.5 overflow-hidden p-3.5">{children}</div>
        </div>
      </div>
      {label ? (
        <p className="mt-3 text-center font-mono text-[0.65rem] uppercase tracking-wider text-neutral-500">
          {label}
        </p>
      ) : null}
    </div>
  );
}
