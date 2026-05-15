const typeScale: { label: string; size: string; lh: string; weight: string; sample: string }[] = [
  { label: "Display / 01", size: "72px", lh: "72px", weight: "500", sample: "Capital. Intelligence." },
  { label: "Heading / 02", size: "36px", lh: "40px", weight: "500", sample: "Divinus Capital" },
  { label: "Heading / 03", size: "24px", lh: "32px", weight: "500", sample: "Private capital allocation" },
  { label: "Body / 01", size: "18px", lh: "28px", weight: "400", sample: "A multi-division group company building the infrastructure of growth — in organisations, in markets, and in people." },
  { label: "Body / 02", size: "14px", lh: "22px", weight: "400", sample: "Pan-African investment platform headquartered in Kampala with seven operating divisions." },
  { label: "Mono / 01", size: "12px", lh: "18px", weight: "500", sample: "04 · DIVISION · 2026" },
];

const palette: { name: string; value: string; role: string; ink?: "light" | "dark" }[] = [
  { name: "Ink", value: "#0A0A0A", role: "Body text · CTAs", ink: "light" },
  { name: "Bone", value: "#FAFAFA", role: "Page canvas" },
  { name: "Violet 600", value: "#7C3AED", role: "Primary brand · Division accent", ink: "light" },
  { name: "Violet 100", value: "#EDE9FE", role: "Tinted backgrounds · Cards" },
  { name: "Indigo 950", value: "#1E1B4B", role: "Inverted band · Hero glow", ink: "light" },
  { name: "Stone 500", value: "#737373", role: "Secondary text · Meta" },
];

const components: { label: string; meta: string; render: () => React.ReactNode }[] = [
  {
    label: "Primary CTA",
    meta: "Pill · 10px radius full · ink fill",
    render: () => (
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-4 py-2 text-sm font-medium text-white"
      >
        Explore Divisions <span className="icon ml-1" style={{ fontSize: "0.75em" }}>arrow-right</span>
      </button>
    ),
  },
  {
    label: "Secondary CTA",
    meta: "Pill · 1px border · transparent",
    render: () => (
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-950"
      >
        Get in touch
      </button>
    ),
  },
  {
    label: "Division card",
    meta: "Rounded 2xl · violet tint · sibling cross-link",
    render: () => (
      <div className="w-full max-w-[200px] rounded-2xl border border-violet-200 bg-violet-50 p-3 ring-1 ring-violet-900/5">
        <p className="font-mono text-[0.6rem] uppercase tracking-wider text-violet-700">
          04 · Division
        </p>
        <p className="mt-2 text-base font-medium tracking-tight text-violet-950">
          Divinus Capital
        </p>
        <p className="mt-1 text-xs text-violet-700/80">
          Private capital allocation.
        </p>
      </div>
    ),
  },
  {
    label: "Eyebrow tag",
    meta: "Mono · uppercase tracking-wider",
    render: () => (
      <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 font-mono text-[0.7rem] uppercase tracking-wider text-neutral-700">
        <span className="size-1.5 rounded-full bg-emerald-500" />
        Group · 7 divisions · 1 direction
      </span>
    ),
  },
];

export function DivinusVisualSystem() {
  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Type scale */}
      <figure className="rounded-2xl border border-neutral-200 bg-white p-6 ring-1 ring-black/5 md:p-8">
        <figcaption className="flex items-center justify-between border-b border-neutral-200 pb-4">
          <p className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500">
            Type scale · Inter
          </p>
          <p className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500 tabular-nums">
            06 styles
          </p>
        </figcaption>
        <ul role="list" className="divide-y divide-neutral-200">
          {typeScale.map((t) => (
            <li
              key={t.label}
              className="grid grid-cols-12 items-center gap-4 py-5"
            >
              <p className="col-span-3 font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500">
                {t.label}
                <span className="block text-neutral-400 tabular-nums normal-case">
                  {t.size} / {t.lh} · {t.weight}
                </span>
              </p>
              <p
                className="col-span-9 text-neutral-950"
                style={{
                  fontSize: t.size,
                  lineHeight: t.lh,
                  fontWeight: t.weight,
                  letterSpacing: t.size === "72px" ? "-0.025em" : undefined,
                }}
              >
                {t.sample}
              </p>
            </li>
          ))}
        </ul>
      </figure>

      {/* Palette */}
      <figure className="rounded-2xl border border-neutral-200 bg-white p-6 ring-1 ring-black/5 md:p-8">
        <figcaption className="flex items-center justify-between border-b border-neutral-200 pb-4">
          <p className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500">
            Palette
          </p>
          <p className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500 tabular-nums">
            06 tokens
          </p>
        </figcaption>
        <ul
          role="list"
          className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
        >
          {palette.map((c) => (
            <li
              key={c.name}
              className="overflow-hidden rounded-xl border border-neutral-200 ring-1 ring-black/5"
            >
              <div
                className="aspect-square w-full"
                style={{ backgroundColor: c.value }}
              />
              <div className="p-3">
                <p className="text-sm font-medium tracking-tight text-neutral-950">
                  {c.name}
                </p>
                <p className="mt-0.5 font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500 tabular-nums">
                  {c.value}
                </p>
                <p className="mt-1 text-xs text-neutral-500">{c.role}</p>
              </div>
            </li>
          ))}
        </ul>
      </figure>

      {/* Components */}
      <figure className="rounded-2xl border border-neutral-200 bg-white p-6 ring-1 ring-black/5 md:p-8">
        <figcaption className="flex items-center justify-between border-b border-neutral-200 pb-4">
          <p className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500">
            Components
          </p>
          <p className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500 tabular-nums">
            04 primitives
          </p>
        </figcaption>
        <ul
          role="list"
          className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2"
        >
          {components.map((c) => (
            <li
              key={c.label}
              className="rounded-xl border border-neutral-200 bg-neutral-50/60 p-5"
            >
              <div className="flex min-h-[120px] items-center justify-center rounded-lg bg-white p-6 ring-1 ring-black/5">
                {c.render()}
              </div>
              <p className="mt-4 text-sm font-medium tracking-tight text-neutral-950">
                {c.label}
              </p>
              <p className="mt-1 font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500">
                {c.meta}
              </p>
            </li>
          ))}
        </ul>
      </figure>
    </div>
  );
}
