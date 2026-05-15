"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SectionShell } from "./Section";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function CtaBand() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".cta-stamp", {
        y: 14,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: ".cta-content", start: "top 80%" },
      });

      gsap.from(".cta-headline", {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".cta-content", start: "top 80%" },
      });

      gsap.from(".cta-meta", {
        y: 12,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".cta-content", start: "top 75%" },
      });
    },
    { scope: root },
  );

  return (
    <SectionShell>
      <div ref={root} className="cta-content relative px-5 py-20 text-center sm:px-8 sm:py-32 md:px-12 md:py-40">
        <h2 className="cta-headline mx-auto max-w-[20ch] text-[40px] font-medium leading-[44px] tracking-[-0.025em] text-neutral-950 sm:text-[52px] sm:leading-[56px] md:text-[60px] md:leading-[60px]">
          Have a brief? Let&apos;s talk.
        </h2>

        <p className="cta-meta mx-auto mt-5 max-w-[52ch] text-base text-neutral-500 sm:mt-6 sm:text-lg">
          I reply within one to two working days. Currently booking new
          projects from June 2026.
        </p>

        <div className="cta-meta mt-8 flex flex-col items-stretch gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
          <Link
            href="/contact"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-neutral-950 px-5 py-3 text-base font-medium text-white transition-[transform,background-color,color] duration-200 hover:bg-neutral-800 active:scale-[0.96] sm:min-h-10 sm:py-2.5 sm:text-sm"
          >
            Send a brief
          </Link>
          <a
            href="mailto:elijahkasujja@gmail.com"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-neutral-300 bg-white px-5 py-3 text-base font-medium text-neutral-950 transition-[transform,background-color,color] duration-200 hover:bg-neutral-50 active:scale-[0.96] sm:min-h-10 sm:py-2.5 sm:text-sm"
          >
            Email me
          </a>
        </div>
      </div>
    </SectionShell>
  );
}
