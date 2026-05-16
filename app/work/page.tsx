import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PageRails } from "@/components/site/PageRails";
import { PageHeader } from "@/components/site/PageHeader";
import { SectionShell } from "@/components/site/Section";
import { ArrowChip } from "@/components/site/ArrowChip";
import { Reveal } from "@/components/site/Reveal";
import { caseStudies } from "@/lib/work";

export const metadata: Metadata = {
  title: "Work — Elijah Kasujja",
  description:
    "Selected website projects, from information architecture and interface design through to build, CMS setup and launch.",
};

export default function WorkIndexPage() {
  const ordered = [...caseStudies].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return b.year - a.year;
  });

  return (
    <>
      <Header />
      <PageRails>
        <PageHeader
          eyebrow="Work"
          title="Selected work."
          subtitle="A few recent website projects, from information architecture and interface design through to build, CMS setup and launch."
          meta={
            <dl className="flex flex-wrap items-start gap-x-8 gap-y-5 sm:gap-x-12">
              <Meta label="Total" value={`${caseStudies.length} projects`} />
              <Meta label="Featured" value="3 lead studies" />
              <Meta
                label="Sectors"
                value="Education · Conservation · Travel · Institutional"
              />
              <Meta label="Stack" value="WordPress · Framer · Next.js" />
            </dl>
          }
        />

        <SectionShell>
          <div className="px-5 py-12 sm:px-8 sm:py-16 md:px-12 md:py-20">
            <Reveal stagger individual selector="li">
            <ul role="list">
              {ordered.map((c, i) => (
                <li key={c.slug}>
                  <Link
                    href={`/work/${c.slug}`}
                    className="group flex flex-col gap-4 border-t border-neutral-200 py-6 transition-colors duration-200 hover:bg-neutral-50/60 sm:grid sm:grid-cols-12 sm:items-center sm:gap-6 sm:py-8"
                  >
                    {/* Mobile header row: index + arrow */}
                    <div className="flex items-center justify-between sm:contents">
                      <div className="font-mono text-[0.75rem] uppercase tracking-wider text-neutral-500 tabular-nums sm:col-span-1">
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <div className="sm:order-last sm:col-span-1 sm:justify-self-end">
                        <ArrowChip size={9} />
                      </div>
                    </div>
                    <div className="sm:col-span-3">
                      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-neutral-100 ring-1 ring-black/5">
                        <Image
                          src={c.cover}
                          alt={`${c.client} live site preview`}
                          fill
                          sizes="(min-width: 768px) 280px, 100vw"
                          className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                          unoptimized
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-5">
                      <h2 className="text-[22px] font-medium tracking-tight text-neutral-950 sm:text-[24px]">
                        {c.client}
                        {c.featured ? (
                          <span className="ml-3 inline-flex items-center gap-1 align-middle rounded-full border border-neutral-200 px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-wider text-neutral-500">
                            Featured
                          </span>
                        ) : null}
                      </h2>
                      <p className="mt-2 max-w-[58ch] text-base text-neutral-500">
                        {c.description}
                      </p>
                      <ul role="list" className="mt-3 flex flex-wrap gap-1.5">
                        {c.tags.map((t) => (
                          <li
                            key={t}
                            className="rounded-full border border-neutral-200 px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider text-neutral-600"
                          >
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="col-span-2 hidden font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500 md:block">
                      {c.year}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            </Reveal>
          </div>
        </SectionShell>
      </PageRails>
      <Footer />
    </>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500">
        {label}
      </dt>
      <dd className="mt-1 text-base font-medium text-neutral-950 sm:text-sm">{value}</dd>
    </div>
  );
}
