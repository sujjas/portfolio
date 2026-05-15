"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SectionShell } from "./Section";
import { Icon } from "./Icon";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Stage = {
  title: string;
  icon: string;
  body: string;
};

const stages: Stage[] = [
  {
    title: "Discovery & alignment",
    icon: "magnifying-glass",
    body: "Stakeholder interviews, audit of the existing site, audience and goal mapping.",
  },
  {
    title: "Information architecture",
    icon: "sitemap",
    body: "Sitemap, content model, taxonomies and editorial roles signed off before design.",
  },
  {
    title: "Wireframes & prototypes",
    icon: "vector-square",
    body: "Lo-fi to hi-fi wireframes in Figma, interactive prototype of the key user flows.",
  },
  {
    title: "Visual design & brand",
    icon: "palette",
    body: "Typography, colour, components and a design system the build can hold up against.",
  },
  {
    title: "CMS build & templates",
    icon: "database",
    body: "WordPress, Webflow, Framer or Sanity, chosen to suit the team and the content.",
  },
  {
    title: "Performance, security, SEO",
    icon: "shield-check",
    body: "Performance, security and SEO handled as part of the build, not left until the end.",
  },
  {
    title: "UAT, launch, analytics",
    icon: "rocket-launch",
    body: "Final review, launch planning, analytics setup and post-launch checks once the site is live.",
  },
  {
    title: "Training & post-launch",
    icon: "graduation-cap",
    body: "Documentation, walkthroughs and a clear support window after launch.",
  },
];

export function Process() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".proc-head > *", {
        y: 24,
        opacity: 0,
        duration: 0.7,
        stagger: 0.07,
        ease: "power3.out",
        scrollTrigger: { trigger: ".proc-head", start: "top 85%" },
      });

      gsap.from(".proc-stage", {
        y: 28,
        opacity: 0,
        duration: 0.55,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: ".proc-stage-list", start: "top 80%" },
      });
    },
    { scope: root },
  );

  return (
    <SectionShell id="process">
      <div ref={root} className="px-8 py-20 md:px-12 md:py-28">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="proc-head lg:sticky lg:top-32">
              <p className="font-mono text-[0.75rem] uppercase tracking-wider text-neutral-500">
                Process
              </p>
              <h2 className="mt-4 max-w-[20ch] text-[36px] font-medium leading-10 tracking-[-0.025em] text-neutral-950">
                Eight stages, every project.{" "}
                <span className="text-neutral-400">
                  Each stage ends with something concrete to review before the
                  next begins.
                </span>
              </h2>
              <Link
                href="/process"
                className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-neutral-950 hover:gap-3"
              >
                Walk through the process <span className="icon ml-1" style={{ fontSize: "0.75em" }}>arrow-right</span>
              </Link>
            </div>
          </div>
          <ol role="list" className="proc-stage-list lg:col-span-8">
            {stages.map((s, i) => (
              <li
                key={s.title}
                className="proc-stage grid grid-cols-12 gap-6 border-t border-neutral-200 py-8 first:border-t-0 last:pb-0"
              >
                <span className="col-span-2 font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="col-span-1">
                  <Icon
                    name={s.icon}
                    size="1.25rem"
                    className="text-neutral-400"
                  />
                </div>
                <div className="col-span-9">
                  <h3 className="text-xl font-medium tracking-tight text-neutral-950">
                    {s.title}
                  </h3>
                  <p className="mt-2 max-w-[58ch] text-base text-neutral-500">
                    {s.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </SectionShell>
  );
}
