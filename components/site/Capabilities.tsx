"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SectionShell } from "./Section";
import { Icon } from "./Icon";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const items = [
  {
    title: "Information architecture",
    icon: "sitemap",
    body: "Sitemaps, content models and taxonomies that make large sites easier to navigate and easier to manage.",
  },
  {
    title: "UX / UI design",
    icon: "pen-ruler",
    body: "Research-led wireframes through to polished, accessible interface design in Figma.",
  },
  {
    title: "CMS build",
    icon: "database",
    body: "WordPress, Webflow, Framer, Sanity. Templates and editing flows that are straightforward to use day to day.",
  },
  {
    title: "Performance & SEO",
    icon: "gauge-high",
    body: "Fast, search-friendly builds with clean structure, sensible metadata and attention to Core Web Vitals.",
  },
  {
    title: "Accessibility",
    icon: "universal-access",
    body: "Accessibility is built in from the start, with attention to contrast, focus states and keyboard use.",
  },
  {
    title: "Training & handoff",
    icon: "graduation-cap",
    body: "Documentation, screen-recorded walkthroughs and a defined post-launch support window.",
  },
];

export function Capabilities() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".cap-head > *", {
        y: 24,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: ".cap-head", start: "top 85%" },
      });

      gsap.from(".cap-item", {
        y: 32,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: ".cap-grid", start: "top 80%" },
      });
    },
    { scope: root },
  );

  return (
    <SectionShell id="capabilities">
      <div ref={root} className="px-8 py-20 md:px-12 md:py-28">
        <div className="cap-head">
          <p className="font-mono text-[0.75rem] uppercase tracking-wider text-neutral-500">
            Capabilities
          </p>
          <h2 className="mt-4 max-w-[28ch] text-[36px] font-medium leading-10 tracking-[-0.025em] text-neutral-950">
            One person, end to end.{" "}
            <span className="text-neutral-400">
              The same person shaping the structure also builds the frontend,
              sets up the CMS and hands the site over.
            </span>
          </h2>
        </div>

        <dl className="cap-grid mt-14 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <div
              key={it.title}
              className="cap-item border-t border-neutral-200 pt-5"
            >
              <Icon
                name={it.icon}
                size="1.5rem"
                className="text-neutral-500"
              />
              <dt className="mt-4 text-xl font-medium tracking-tight text-neutral-950">
                {it.title}
              </dt>
              <dd className="mt-2 max-w-[42ch] text-base text-neutral-500">
                {it.body}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </SectionShell>
  );
}
