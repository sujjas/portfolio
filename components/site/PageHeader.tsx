"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { SectionShell } from "./Section";

gsap.registerPlugin(useGSAP);

type Props = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  meta?: React.ReactNode;
};

export function PageHeader({ eyebrow, title, subtitle, meta }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }
      const el = ref.current;
      if (!el) return;

      const eyebrowEl = el.querySelector("[data-anim='eyebrow']");
      const titleEl = el.querySelector("[data-anim='title']");
      const subtitleEl = el.querySelector("[data-anim='subtitle']");
      const metaEl = el.querySelector("[data-anim='meta']");

      const targets = [eyebrowEl, titleEl, subtitleEl, metaEl].filter(
        Boolean,
      ) as Element[];
      if (targets.length === 0) return;

      gsap.set(targets, { y: 24, opacity: 0 });
      gsap.to(targets, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        delay: 0.1,
      });
    },
    { scope: ref },
  );

  return (
    <SectionShell>
      <div
        ref={ref}
        className="px-5 pt-16 pb-12 sm:px-8 sm:pt-20 sm:pb-16 md:px-12 md:pt-28 md:pb-20"
      >
        <p
          data-anim="eyebrow"
          className="font-mono text-[0.75rem] uppercase tracking-wider text-neutral-500"
        >
          {eyebrow}
        </p>
        <h1
          data-anim="title"
          className="mt-6 max-w-[24ch] text-[40px] font-medium leading-[44px] tracking-[-0.025em] text-neutral-950 sm:text-[52px] sm:leading-[56px] md:text-[60px] md:leading-[60px] [&_.line-soft]:text-neutral-400"
        >
          {title}
        </h1>
        {subtitle ? (
          <p
            data-anim="subtitle"
            className="mt-5 max-w-[60ch] text-base text-neutral-500 sm:mt-6 sm:text-lg"
          >
            {subtitle}
          </p>
        ) : null}
        {meta ? (
          <div data-anim="meta" className="mt-6 sm:mt-8">
            {meta}
          </div>
        ) : null}
      </div>
    </SectionShell>
  );
}
