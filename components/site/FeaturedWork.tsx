"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { caseStudies, type CaseStudy } from "@/lib/work";
import { SectionShell } from "./Section";
import { ArrowChip } from "./ArrowChip";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function FeaturedWork() {
  const root = useRef<HTMLDivElement>(null);
  const featured = caseStudies.filter((c) => c.featured);

  useGSAP(
    () => {
      gsap.from(".section-head > *", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: ".section-head", start: "top 85%" },
      });

      gsap.utils.toArray<HTMLElement>(".work-tile").forEach((tile, i) => {
        gsap.from(tile, {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          delay: i * 0.05,
          scrollTrigger: { trigger: tile, start: "top 90%" },
        });
      });
    },
    { scope: root },
  );

  return (
    <SectionShell id="work">
      <div ref={root} className="px-8 py-20 md:px-12 md:py-28">
        <div className="section-head">
          <p className="font-mono text-[0.75rem] uppercase tracking-wider text-neutral-500">
            Work
          </p>
          <h2 className="mt-4 max-w-[28ch] text-[36px] font-medium leading-10 tracking-[-0.025em] text-neutral-950">
            Selected projects.{" "}
            <span className="text-neutral-400">
              Three recent builds, from information architecture and interface
              design through to build, CMS setup and launch.
            </span>
          </h2>
        </div>

        <ul role="list" className="mt-14 divide-y divide-neutral-200">
          {featured.map((c, i) => (
            <ListRow key={c.slug} study={c} index={i + 1} />
          ))}
        </ul>

        <div className="mt-12 flex justify-center">
          <Link
            href="/work"
            className="inline-flex min-h-10 items-center rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-950 transition-[transform,background-color,color] duration-200 hover:bg-neutral-50 active:scale-[0.96]"
          >
            See all projects
          </Link>
        </div>
      </div>
    </SectionShell>
  );
}

function ListRow({
  study,
  index,
}: {
  study: CaseStudy;
  index: number;
}) {
  return (
    <li className="work-tile">
      <Link
        href={`/work/${study.slug}`}
        className="group grid grid-cols-12 items-center gap-6 py-8 transition-colors duration-200 hover:bg-neutral-50/60"
      >
        <div className="col-span-1 font-mono text-[0.75rem] uppercase tracking-wider text-neutral-500 tabular-nums">
          {String(index).padStart(2, "0")}
        </div>
        <div className="col-span-3">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-neutral-100 ring-1 ring-black/5">
            <Image
              src={study.cover}
              alt={`${study.client} live site preview`}
              fill
              sizes="280px"
              className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
              unoptimized
            />
          </div>
        </div>
        <div className="col-span-5">
          <h3 className="text-[24px] font-medium tracking-tight text-neutral-950">
            {study.client}
          </h3>
          <p className="mt-2 max-w-[58ch] text-base text-neutral-500">
            {study.description}
          </p>
        </div>
        <div className="col-span-2 hidden font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500 md:block">
          {study.year}
          <span className="mx-2 text-neutral-300">+</span>
          {study.tags[0]}
        </div>
        <div className="col-span-1 justify-self-end">
          <ArrowChip size={9} />
        </div>
      </Link>
    </li>
  );
}
