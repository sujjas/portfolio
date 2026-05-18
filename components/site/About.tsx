"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SectionShell } from "./Section";
import { Timeline } from "./Timeline";

gsap.registerPlugin(ScrollTrigger, useGSAP);

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
      gsap.from(".about-timeline", {
        y: 32,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ".about-timeline", start: "top 85%" },
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
              I'm a product designer at Rwazi by day, working on Sena and
              Ela, and alongside that I design and build websites for teams
              across East Africa.
            </span>
          </h2>
          <Link
            href="/about"
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-neutral-950 hover:gap-3"
          >
            More about me <span className="icon ml-1" style={{ fontSize: "0.75em" }}>arrow-right</span>
          </Link>
        </div>

        <div className="about-timeline">
          <Timeline />
        </div>
      </div>
    </SectionShell>
  );
}
