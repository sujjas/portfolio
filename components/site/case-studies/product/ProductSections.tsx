import type { ReactNode } from "react";
import { SectionShell } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import type { Decision, Metric, Screen } from "@/lib/product-work";

/**
 * Building blocks for the design-first product case study. Text is kept to
 * a title and a line per screen; the figures carry the work.
 */

const pad = "px-5 sm:px-8 md:px-12";

export function MetaRow({ items }: { items: { label: string; value: ReactNode }[] }) {
  return (
    <dl className="mt-8 flex flex-wrap items-start gap-x-10 gap-y-5 sm:mt-10 sm:gap-x-12">
      {items.map((it) => (
        <div key={it.label}>
          <dt className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500">{it.label}</dt>
          <dd className="mt-1 text-base font-medium text-neutral-950 sm:text-sm">{it.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function MetricTiles({ items }: { items: Metric[] }) {
  return (
    <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-200 ring-1 ring-black/5 sm:grid-cols-3">
      {items.map((m) => (
        <div key={m.label} className="flex flex-col gap-3 bg-white p-6 sm:p-7">
          <dd className="order-1 text-[32px] font-medium leading-none tracking-[-0.03em] text-neutral-950 tabular-nums sm:text-[36px]">
            {m.value}
          </dd>
          <dt className="order-2 text-sm text-neutral-600">{m.label}</dt>
        </div>
      ))}
    </dl>
  );
}

/**
 * One screen of the walkthrough. "split" sets a single phone beside its
 * caption; the default runs the figure full width under a title row.
 */
export function ScreenSection({
  index,
  screen,
  children,
}: {
  index: number;
  screen: Screen;
  children: ReactNode;
}) {
  const heading = (
    <>
      <p className="font-mono text-[0.75rem] uppercase tracking-wider text-neutral-500 tabular-nums">
        {String(index).padStart(2, "0")}
      </p>
      <h2 className="mt-3 text-[24px] font-medium leading-[30px] tracking-[-0.02em] text-neutral-950 sm:text-[28px] sm:leading-[34px]">
        {screen.title}
      </h2>
    </>
  );

  if (screen.layout === "split") {
    return (
      <SectionShell>
        <Reveal className={`${pad} py-14 sm:py-16 md:py-20`}>
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-12">
            <div className="md:order-2 md:col-span-6 md:col-start-7">
              {heading}
              <p className="mt-3 max-w-[44ch] text-base text-neutral-500 sm:text-lg">{screen.caption}</p>
            </div>
            <div className="mx-auto w-full max-w-[360px] md:order-1 md:col-span-5">{children}</div>
          </div>
        </Reveal>
      </SectionShell>
    );
  }

  return (
    <SectionShell>
      <Reveal className={`${pad} py-14 sm:py-16 md:py-20`}>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-end md:gap-12">
          <div className="md:col-span-6">{heading}</div>
          <p className="max-w-[52ch] text-base text-neutral-500 md:col-span-6 sm:text-lg">{screen.caption}</p>
        </div>
        <div className="mt-8 sm:mt-10">{children}</div>
      </Reveal>
    </SectionShell>
  );
}

export function DecisionGrid({ items }: { items: Decision[] }) {
  return (
    <ol role="list" className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {items.map((d, i) => (
        <li key={d.title} className="rounded-2xl border border-neutral-200 bg-white p-6 ring-1 ring-black/5 sm:p-7">
          <p className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-400 tabular-nums">
            {String(i + 1).padStart(2, "0")}
          </p>
          <h3 className="mt-3 text-lg font-medium tracking-tight text-neutral-950">{d.title}</h3>
          <p className="mt-2 text-base text-neutral-500 sm:text-sm">{d.body}</p>
        </li>
      ))}
    </ol>
  );
}
