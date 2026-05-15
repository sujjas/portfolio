"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SectionShell } from "./Section";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const stats = [
  {
    value: "5+",
    label: "Years designing and building websites from first sketch to launch",
  },
  {
    value: "05",
    label: "Production websites shipped between 2024 and 2026",
  },
  {
    value: "AA",
    label: "WCAG 2.1 accessibility baseline applied to every build",
  },
  {
    value: "95+",
    label: "Lighthouse target across performance, accessibility, SEO",
  },
];

export function About() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".about-head > *", {
        y: 24,
        opacity: 0,
        duration: 0.7,
        stagger: 0.07,
        ease: "power3.out",
        scrollTrigger: { trigger: ".about-head", start: "top 85%" },
      });
      gsap.from(".about-stat", {
        y: 24,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: ".about-stats", start: "top 85%" },
      });
    },
    { scope: root },
  );

  return (
    <SectionShell id="about">
      <div ref={root} className="px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-28">
        <div className="about-head">
          <p className="font-mono text-[0.75rem] uppercase tracking-wider text-neutral-500">
            Traction
          </p>
          <h2 className="mt-4 max-w-[32ch] text-[28px] font-medium leading-[34px] tracking-[-0.025em] text-neutral-950 sm:text-[36px] sm:leading-10">
            Designer and developer, based in Kampala.{" "}
            <span className="text-neutral-400">
              I lead product design at Rwazi by day, and alongside that I
              design and build websites for teams across East Africa.
            </span>
          </h2>
          <Link
            href="/about"
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-neutral-950 hover:gap-3"
          >
            More about me <span className="icon ml-1" style={{ fontSize: "0.75em" }}>arrow-right</span>
          </Link>
        </div>

        <dl className="about-stats mt-12 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-neutral-200 pt-10 sm:mt-16 sm:grid-cols-4 sm:gap-y-0 sm:pt-12">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`about-stat sm:px-8 ${
                i > 0 ? "sm:border-l sm:border-neutral-200" : ""
              }`}
            >
              <dt className="text-[44px] font-medium leading-[1] tracking-tight text-neutral-950 tabular-nums sm:text-6xl md:text-7xl">
                {s.value}
              </dt>
              <dd className="mt-3 max-w-[28ch] text-base text-neutral-500 sm:mt-4 sm:text-sm">
                {s.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </SectionShell>
  );
}
