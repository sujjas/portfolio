import { SectionShell } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import type {
  Fact,
  Metric,
  ProcessStep,
  TradeOff,
} from "@/lib/product-work";

/**
 * Shared building blocks for the product case-study template. Same visual
 * language as the website case studies (mono eyebrows, neutral palette,
 * rounded cards, Reveal on scroll) but structured for problem → evidence →
 * trade-offs → process → solution → outcome.
 */

export function ProductSection({
  eyebrow,
  title,
  lede,
  children,
  wide = false,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  children?: React.ReactNode;
  /** Let children span the full width under the heading row. */
  wide?: boolean;
}) {
  return (
    <SectionShell>
      <div className="px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-28">
        <Reveal stagger className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="font-mono text-[0.75rem] uppercase tracking-wider text-neutral-500">
              {eyebrow}
            </p>
            <h2 className="mt-4 max-w-[22ch] text-[28px] font-medium leading-[34px] tracking-[-0.025em] text-neutral-950 sm:text-[36px] sm:leading-10">
              {title}
            </h2>
          </div>
          <div className="lg:col-span-7">
            {lede ? (
              <p className="max-w-[60ch] text-base text-neutral-700 sm:text-lg">{lede}</p>
            ) : null}
            {!wide && children ? (
              <div className={lede ? "mt-8 sm:mt-10" : ""}>{children}</div>
            ) : null}
          </div>
        </Reveal>
        {wide && children ? (
          <Reveal className="mt-10 sm:mt-12">{children}</Reveal>
        ) : null}
      </div>
    </SectionShell>
  );
}

export function MetricTiles({ items }: { items: Metric[] }) {
  return (
    <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-200 ring-1 ring-black/5 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((m) => (
        <div key={m.label} className="flex flex-col gap-3 bg-white p-6 sm:p-7">
          <dd className="order-1 text-[32px] font-medium leading-none tracking-[-0.03em] text-neutral-950 tabular-nums sm:text-[36px]">
            {m.value}
          </dd>
          <dt className="order-2 text-sm text-neutral-700">{m.label}</dt>
          {m.source ? (
            <p className="order-3 mt-auto pt-2 font-mono text-[0.65rem] uppercase tracking-wider text-neutral-400">
              {m.source}
            </p>
          ) : null}
        </div>
      ))}
    </dl>
  );
}

export function TwoColumnProblem({
  user,
  business,
}: {
  user: string;
  business: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <Card label="For the user">{user}</Card>
      <Card label="For the business">{business}</Card>
    </div>
  );
}

export function FactList({ items }: { items: Fact[] }) {
  return (
    <ol role="list" className="grid grid-cols-1 gap-5">
      {items.map((f, i) => (
        <li
          key={f.title}
          className="grid grid-cols-1 gap-3 rounded-2xl border border-neutral-200 bg-white p-6 ring-1 ring-black/5 sm:grid-cols-12 sm:gap-6"
        >
          <div className="sm:col-span-4">
            <p className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-400 tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-2 text-base font-medium leading-snug text-neutral-950">
              {f.title}
            </h3>
          </div>
          <div className="sm:col-span-8">
            <p className="text-base text-neutral-700 sm:text-[15px] sm:leading-relaxed">{f.body}</p>
            {f.source ? (
              <p className="mt-3 font-mono text-[0.65rem] uppercase tracking-wider text-neutral-400">
                {f.source}
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

export function TradeOffTable({ items }: { items: TradeOff[] }) {
  return (
    <div className="grid grid-cols-1 gap-5">
      {items.map((t) => (
        <article
          key={t.decision}
          className="overflow-hidden rounded-2xl border border-neutral-200 bg-white ring-1 ring-black/5"
        >
          <header className="border-b border-neutral-200 px-6 py-5">
            <p className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500">
              Decision
            </p>
            <h3 className="mt-1.5 text-lg font-medium leading-snug text-neutral-950">
              {t.decision}
            </h3>
          </header>
          <div className="grid grid-cols-1 divide-y divide-neutral-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            <div className="px-6 py-5">
              <p className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-400">
                Gave up
              </p>
              <p className="mt-2 text-sm text-neutral-700">{t.gave}</p>
            </div>
            <div className="px-6 py-5">
              <p className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-400">
                Got
              </p>
              <p className="mt-2 text-sm text-neutral-950">{t.got}</p>
            </div>
          </div>
          <footer className="border-t border-neutral-200 bg-neutral-50/70 px-6 py-5">
            <p className="text-sm leading-relaxed text-neutral-700">{t.why}</p>
          </footer>
        </article>
      ))}
    </div>
  );
}

export function ProcessTimeline({ steps }: { steps: ProcessStep[] }) {
  return (
    <ol role="list" className="relative grid grid-cols-1 gap-0 border-l border-neutral-200 pl-6 sm:pl-8">
      {steps.map((s) => (
        <li key={s.title} className="relative pb-10 last:pb-0">
          <span
            aria-hidden
            className="absolute -left-[calc(1.5rem+5px)] top-1.5 h-[9px] w-[9px] rounded-full bg-neutral-950 ring-4 ring-white sm:-left-[calc(2rem+5px)]"
          />
          <p className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500 tabular-nums">
            {s.date}
          </p>
          <h3 className="mt-2 text-lg font-medium leading-snug text-neutral-950">{s.title}</h3>
          <p className="mt-2 max-w-[62ch] text-base text-neutral-700 sm:text-[15px] sm:leading-relaxed">
            {s.body}
          </p>
        </li>
      ))}
    </ol>
  );
}

export function Card({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 ring-1 ring-black/5 sm:p-7">
      <p className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500">{label}</p>
      <p className="mt-3 text-base leading-relaxed text-neutral-700">{children}</p>
    </div>
  );
}

export function Snapshot({
  items,
}: {
  items: { label: string; value: React.ReactNode }[];
}) {
  return (
    <dl className="mt-10 grid grid-cols-1 gap-x-8 gap-y-5 border-t border-neutral-200 pt-6 sm:mt-12 sm:grid-cols-2 sm:gap-x-12 sm:pt-8 lg:grid-cols-5">
      {items.map((m) => (
        <div key={m.label}>
          <dt className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500">
            {m.label}
          </dt>
          <dd className="mt-2 text-base font-medium leading-snug text-neutral-950 sm:text-sm">
            {m.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
