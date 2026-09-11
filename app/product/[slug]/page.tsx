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
  FactList,
  MetricTiles,
  ProcessTimeline,
  ProductSection,
  Snapshot,
  TradeOffTable,
  TwoColumnProblem,
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
  const hasNext = productCaseStudies.length > 1;

  return (
    <>
      <Header />
      <PageRails>
        {/* 01 Cover + snapshot */}
        <SectionShell>
          <AnimatedStack className="px-5 pt-16 pb-10 sm:px-8 sm:pt-20 sm:pb-12 md:px-12 md:pt-28 md:pb-16">
            <p className="font-mono text-[0.75rem] uppercase tracking-wider text-neutral-500">
              Product case study · {String(index + 1).padStart(2, "0")} · Rwazi
            </p>
            {study.logo ? (
              <Image
                src={study.logo}
                alt=""
                width={72}
                height={72}
                className="mt-6 h-14 w-14 rounded-2xl object-contain ring-1 ring-black/5 sm:h-[72px] sm:w-[72px]"
                unoptimized
              />
            ) : null}
            <h1 className="mt-6 max-w-[18ch] text-[40px] font-medium leading-[44px] tracking-[-0.025em] text-neutral-950 sm:text-[52px] sm:leading-[56px] md:text-[60px] md:leading-[60px]">
              {study.name}
            </h1>
            <p className="mt-5 max-w-[62ch] text-base text-neutral-500 sm:mt-6 sm:text-lg">
              {study.thesis}
            </p>

            <Snapshot
              items={[
                { label: "Role", value: study.snapshot.role },
                { label: "Team", value: study.snapshot.team },
                { label: "Platform", value: study.snapshot.platform },
                { label: "Timeline", value: study.snapshot.timeline },
                {
                  label: "Status",
                  value: study.liveUrl ? (
                    <span>
                      {study.snapshot.status}{" "}
                      <a
                        href={study.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 underline-offset-4 hover:underline"
                      >
                        Visit
                        <Icon name="arrow-up-right-from-square" size="0.65rem" className="text-neutral-500" />
                      </a>
                    </span>
                  ) : (
                    study.snapshot.status
                  ),
                },
              ]}
            />
          </AnimatedStack>
        </SectionShell>

        {/* Headline numbers */}
        <SectionShell>
          <Reveal className="px-5 pt-10 pb-16 sm:px-8 sm:pt-12 sm:pb-20 md:px-12 md:pt-16 md:pb-28">
            <MetricTiles items={study.headline} />
          </Reveal>
        </SectionShell>

        <ProductSection
          eyebrow="01 · Context and problem"
          title="Why this needed to exist."
          wide
        >
          <TwoColumnProblem user={study.problem.user} business={study.problem.business} />
        </ProductSection>

        <ProductSection
          eyebrow="02 · Evidence"
          title="What the data and the conversations said."
          lede="What the pilot data and the conversations themselves showed, and what each finding changed."
          wide
        >
          <FactList items={study.evidence} />
        </ProductSection>

        <ProductSection
          eyebrow="03 · Trade-offs"
          title="Decisions that cost something."
          lede="The design work that mattered most was choosing what to give up. Each of these was argued, shipped and measured."
          wide
        >
          <TradeOffTable items={study.tradeoffs} />
        </ProductSection>

        <ProductSection
          eyebrow="04 · Process"
          title="From prototype to funded product."
        >
          <ProcessTimeline steps={study.process} />
        </ProductSection>

        {/* 05 Solution walkthrough — one figure per part */}
        {study.solution.map((part, i) => (
          <ProductSection
            key={part.title}
            eyebrow={`05.${i + 1} · Solution`}
            title={part.title}
            lede={part.body}
            wide
          >
            <ProductFigure slug={study.slug} name={part.figure} />
          </ProductSection>
        ))}

        <ProductSection
          eyebrow="06 · Build and handoff"
          title="How it runs, and how someone else could run it."
          wide
        >
          <FactList items={study.build} />
        </ProductSection>

        <ProductSection
          eyebrow="07 · Outcome"
          title="What happened."
          lede={study.outcome.summary}
          wide
        >
          <MetricTiles items={study.outcome.metrics} />
          <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50/70 p-6 ring-1 ring-black/5 sm:p-7">
            <p className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500">
              What's next
            </p>
            <p className="mt-3 max-w-[70ch] text-base leading-relaxed text-neutral-700">
              {study.outcome.open}
            </p>
          </div>
        </ProductSection>

        <ProductSection eyebrow="08 · Reflection" title="What this product taught me.">
          <ul role="list" className="grid grid-cols-1 gap-5">
            {study.reflection.map((r, i) => (
              <li key={i} className="flex gap-4">
                <span className="mt-1 font-mono text-[0.7rem] uppercase tracking-wider text-neutral-400 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="max-w-[60ch] text-base leading-relaxed text-neutral-700">{r}</p>
              </li>
            ))}
          </ul>
        </ProductSection>

        {hasNext ? (
          <SectionShell>
            <Reveal className="px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-28">
              <Link
                href={`/product/${next.slug}`}
                className="group block overflow-hidden rounded-3xl border border-neutral-200 bg-white ring-1 ring-black/5 transition-colors duration-200 hover:bg-neutral-50/60"
              >
                <div className="flex flex-col justify-center gap-4 p-6 sm:p-8 md:p-12">
                  <p className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500">
                    Next case study
                  </p>
                  <h2 className="text-[28px] font-medium leading-[34px] tracking-[-0.025em] text-neutral-950 sm:text-[36px] sm:leading-10">
                    {next.name}
                  </h2>
                  <p className="max-w-[60ch] text-base text-neutral-500">{next.description}</p>
                  <div className="mt-2">
                    <ArrowChip size={10} />
                  </div>
                </div>
              </Link>
            </Reveal>
          </SectionShell>
        ) : (
          <SectionShell>
            <Reveal className="px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-28">
              <Link
                href="/product"
                className="inline-flex items-center gap-2 font-mono text-[0.75rem] uppercase tracking-wider text-neutral-500 underline-offset-4 hover:underline"
              >
                <Icon name="arrow-left" size="0.7rem" />
                All product work
              </Link>
            </Reveal>
          </SectionShell>
        )}
      </PageRails>
      <Footer />
    </>
  );
}
