import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PageRails } from "@/components/site/PageRails";
import { SectionShell } from "@/components/site/Section";
import { Icon } from "@/components/site/Icon";
import { ArrowChip } from "@/components/site/ArrowChip";
import { AnimatedStack } from "@/components/site/AnimatedStack";
import { Reveal } from "@/components/site/Reveal";
import {
  DecisionGrid,
  MetaRow,
  MetricTiles,
  ScreenSection,
} from "@/components/site/case-studies/product/ProductSections";
import { ProductFigure } from "@/components/site/case-studies/product";
import { productCaseStudies } from "@/lib/product-work";

export function generateStaticParams() {
  return productCaseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = productCaseStudies.find((c) => c.slug === slug);
  if (!study) return { title: "Not found" };
  return {
    title: `${study.name} — Elijah Kasujja`,
    description: study.description,
    robots: { index: false, follow: false, noarchive: true },
  };
}

const pad = "px-5 sm:px-8 md:px-12";

/**
 * Design-first product case study: cover, hero design, the problem and three
 * numbers, then one section per screen, the decisions, and the outcome.
 */
export default async function ProductCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = productCaseStudies.find((c) => c.slug === slug);
  if (!study) notFound();

  const index = productCaseStudies.findIndex((c) => c.slug === study.slug);
  const next = productCaseStudies[(index + 1) % productCaseStudies.length];

  const visit = study.liveUrl ? (
    <a
      href={study.liveUrl}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 underline-offset-4 hover:underline"
    >
      {study.meta.status}
      <Icon name="arrow-up-right-from-square" size="0.65rem" className="text-neutral-500" />
    </a>
  ) : (
    study.meta.status
  );

  return (
    <>
      <Header />
      <PageRails>
        {/* Cover */}
        <SectionShell>
          <AnimatedStack className={`${pad} pt-16 pb-10 sm:pt-20 sm:pb-12 md:pt-24 md:pb-14`}>
            <p className="font-mono text-[0.75rem] uppercase tracking-wider text-neutral-500">
              Product case study · {String(index + 1).padStart(2, "0")} · Rwazi
            </p>
            <div className="mt-6 flex items-center gap-4 sm:gap-5">
              {study.logo ? (
                <Image
                  src={study.logo}
                  alt=""
                  width={64}
                  height={64}
                  className="h-12 w-12 shrink-0 rounded-2xl object-contain ring-1 ring-black/5 sm:h-16 sm:w-16"
                  unoptimized
                />
              ) : null}
              <h1 className="text-[40px] font-medium leading-[44px] tracking-[-0.025em] text-neutral-950 sm:text-[52px] sm:leading-[56px] md:text-[60px] md:leading-[60px]">
                {study.name}
              </h1>
            </div>
            <p className="mt-5 max-w-[60ch] text-base text-neutral-500 sm:mt-6 sm:text-lg">{study.tagline}</p>
            <MetaRow
              items={[
                { label: "Role", value: study.meta.role },
                { label: "Platform", value: study.meta.platform },
                { label: "Year", value: study.meta.year },
                { label: "Status", value: visit },
              ]}
            />
          </AnimatedStack>
        </SectionShell>

        {/* Hero design */}
        <SectionShell>
          <Reveal className={`${pad} py-10 sm:py-12 md:py-14`}>
            <ProductFigure slug={study.slug} name={study.hero} />
          </Reveal>
        </SectionShell>

        {/* Problem and numbers */}
        <SectionShell>
          <Reveal stagger className={`${pad} py-14 sm:py-16 md:py-20`}>
            <p className="font-mono text-[0.75rem] uppercase tracking-wider text-neutral-500">The problem</p>
            <p className="mt-4 max-w-[34ch] text-[24px] font-medium leading-[32px] tracking-[-0.02em] text-neutral-950 sm:text-[30px] sm:leading-[38px]">
              {study.problem}
            </p>
            <div className="mt-10 sm:mt-12">
              <MetricTiles items={study.headline} />
            </div>
          </Reveal>
        </SectionShell>

        {/* Screens */}
        {study.screens.map((screen, i) => (
          <ScreenSection key={screen.title} index={i + 1} screen={screen}>
            <ProductFigure slug={study.slug} name={screen.figure} />
          </ScreenSection>
        ))}

        {/* Decisions */}
        <SectionShell>
          <Reveal className={`${pad} py-14 sm:py-16 md:py-20`}>
            <p className="font-mono text-[0.75rem] uppercase tracking-wider text-neutral-500">Decisions</p>
            <h2 className="mt-3 text-[24px] font-medium leading-[30px] tracking-[-0.02em] text-neutral-950 sm:text-[28px] sm:leading-[34px]">
              What I chose, and why.
            </h2>
            <div className="mt-8 sm:mt-10">
              <DecisionGrid items={study.decisions} />
            </div>
          </Reveal>
        </SectionShell>

        {/* Outcome */}
        <SectionShell>
          <Reveal className={`${pad} py-14 sm:py-16 md:py-20`}>
            <p className="font-mono text-[0.75rem] uppercase tracking-wider text-neutral-500">Outcome</p>
            <p className="mt-4 max-w-[40ch] text-[24px] font-medium leading-[32px] tracking-[-0.02em] text-neutral-950 sm:text-[30px] sm:leading-[38px]">
              {study.outcome}
            </p>
          </Reveal>
        </SectionShell>

        {/* Next */}
        <SectionShell>
          <Reveal className={`${pad} py-14 sm:py-16 md:py-20`}>
            <Link
              href={`/product/${next.slug}`}
              className="group flex flex-col gap-4 rounded-3xl border border-neutral-200 bg-white p-6 ring-1 ring-black/5 transition-colors duration-200 hover:bg-neutral-50/60 sm:flex-row sm:items-center sm:justify-between sm:p-8 md:p-10"
            >
              <div>
                <p className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500">Next case study</p>
                <h2 className="mt-3 text-[28px] font-medium leading-[34px] tracking-[-0.025em] text-neutral-950 sm:text-[36px] sm:leading-10">
                  {next.name}
                </h2>
                <p className="mt-2 max-w-[60ch] text-base text-neutral-500">{next.description}</p>
              </div>
              <ArrowChip size={10} />
            </Link>
            <Link
              href="/product"
              className="mt-8 inline-flex items-center gap-2 font-mono text-[0.75rem] uppercase tracking-wider text-neutral-500 underline-offset-4 hover:underline"
            >
              <Icon name="arrow-left" size="0.7rem" />
              All product work
            </Link>
          </Reveal>
        </SectionShell>
      </PageRails>
      <Footer />
    </>
  );
}
