"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { caseStudies } from "@/lib/work";
import { SectionShell } from "./Section";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Clients() {
  const root = useRef<HTMLDivElement>(null);
  const clients = caseStudies.map((c) => c.client);
  const doubled = [...clients, ...clients];

  useGSAP(
    () => {
      gsap.from(".clients-label", {
        y: 12,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: { trigger: ".clients-label", start: "top 90%" },
      });
    },
    { scope: root },
  );

  return (
    <SectionShell>
      <div ref={root} className="px-8 pt-14 pb-6 md:px-12 md:pt-16">
        <p className="clients-label font-mono text-[0.75rem] uppercase tracking-wider text-neutral-500">
          Clients
        </p>
      </div>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-px z-10 w-24 bg-linear-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-px z-10 w-24 bg-linear-to-l from-white to-transparent" />
        <ul
          role="list"
          aria-hidden="true"
          className="marquee flex w-max items-center gap-14 py-12 pr-14"
        >
          {doubled.map((name, i) => (
            <li
              key={`${name}-${i}`}
              className="flex shrink-0 items-center gap-14 whitespace-nowrap"
            >
              <span className="text-2xl font-medium tracking-tight text-neutral-800">
                {name}
              </span>
              <span aria-hidden="true" className="text-neutral-300">+</span>
            </li>
          ))}
        </ul>
      </div>
    </SectionShell>
  );
}
