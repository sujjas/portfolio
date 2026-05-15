import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PageRails } from "@/components/site/PageRails";
import { PageHeader } from "@/components/site/PageHeader";
import { SectionShell } from "@/components/site/Section";
import { Icon } from "@/components/site/Icon";

export const metadata: Metadata = {
  title: "Process — Elijah Kasujja",
  description:
    "Eight stages, from early discovery through to launch, training and handover.",
};

const stages = [
  {
    title: "Discovery & stakeholder alignment",
    icon: "magnifying-glass",
    summary:
      "Conversations with the client, a review of the existing site where needed, and a clearer picture of who the site is for before design starts.",
    deliverables: [
      "Stakeholder interview notes",
      "Audit of the existing site (where one exists)",
      "Audience and goal map",
      "One-page project brief signed off",
    ],
  },
  {
    title: "Information architecture & content modelling",
    icon: "sitemap",
    summary:
      "Sitemap, content types, taxonomies and editorial structure. This is the stage that makes the rest of the project easier, so I take the time to get it right.",
    deliverables: [
      "Annotated sitemap",
      "Content model with field definitions",
      "Taxonomy and tag strategy",
      "Editorial roles and review flow",
    ],
  },
  {
    title: "Wireframes & interactive prototypes",
    icon: "vector-square",
    summary:
      "Wireframes in Figma, moving from rough structure to a clickable prototype before visual design is locked in.",
    deliverables: [
      "Lo-fi wireframes of every template",
      "Interactive prototype of the key user flows",
      "Stakeholder UAT-1: structure & flow",
    ],
  },
  {
    title: "Visual design & branding integration",
    icon: "palette",
    summary:
      "Typography, colour and components shaped into a visual system the build can follow consistently.",
    deliverables: [
      "Type scale, colour and spacing tokens",
      "Component primitives in Figma",
      "Brand integration spec",
      "Stakeholder UAT-2: visual sign-off",
    ],
  },
  {
    title: "CMS build & content templates",
    icon: "database",
    summary:
      "WordPress, Webflow, Framer or Sanity, chosen to suit the team and the content. The editing experience matters as much as the front end.",
    deliverables: [
      "CMS configuration (custom fields, taxonomies, roles)",
      "Editor-friendly templates with sensible defaults",
      "Content migration plan",
      "First-pass content uploaded",
    ],
  },
  {
    title: "Performance, security, SEO",
    icon: "shield-check",
    summary:
      "Performance, security and search basics handled as part of the build, not left until the end.",
    deliverables: [
      "Lighthouse 95+ across Performance, A11y, Best Practices, SEO",
      "Schema.org structured data",
      "XML sitemap and robots.txt",
      "WCAG 2.1 AA accessibility audit",
      "Security headers & SSL configuration",
    ],
  },
  {
    title: "UAT, launch, analytics",
    icon: "rocket-launch",
    summary:
      "Final review, launch planning, analytics setup and post-launch checks once the site is live.",
    deliverables: [
      "UAT checklist signed off by stakeholders",
      "DNS / hosting cutover plan",
      "Plausible or Google Analytics configured",
      "Post-launch smoke tests",
    ],
  },
  {
    title: "CMS training & post-launch support",
    icon: "graduation-cap",
    summary:
      "Documentation, walkthroughs, a live training session and a clear support window after launch.",
    deliverables: [
      "Written CMS handbook tailored to the build",
      "Screen-recorded walkthroughs of every editor task",
      "Live training session for the client team",
      "30-day post-launch support window",
    ],
  },
];

export default function ProcessPage() {
  return (
    <>
      <Header />
      <PageRails>
        <PageHeader
          eyebrow="Process · 01 to 08"
          title="Eight stages, every project."
          subtitle="A clear process from discovery through to handover. Each stage ends with something concrete to review before the next begins."
          meta={
            <dl className="flex flex-wrap items-start gap-x-12 gap-y-5">
              <Meta label="Typical length" value="8 to 12 weeks" />
              <Meta label="Review points" value="Structure · Design · Launch" />
              <Meta label="Performance" value="Lighthouse 95+" />
              <Meta label="Accessibility" value="WCAG 2.1 AA" />
            </dl>
          }
        />

        {stages.map((s, i) => (
          <SectionShell key={s.title}>
            <div className="px-8 py-20 md:px-12 md:py-28">
              <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-5">
                  <div className="lg:sticky lg:top-32">
                    <p className="font-mono text-[0.75rem] uppercase tracking-wider text-neutral-500 tabular-nums">
                      Stage {String(i + 1).padStart(2, "0")} of 08
                    </p>
                    <h2 className="mt-4 max-w-[20ch] text-[36px] font-medium leading-10 tracking-[-0.025em] text-neutral-950">
                      {s.title}
                    </h2>
                    <Icon
                      name={s.icon}
                      size="1.5rem"
                      className="mt-8 text-neutral-400"
                    />
                  </div>
                </div>
                <div className="lg:col-span-7">
                  <p className="max-w-[60ch] text-lg text-neutral-700">
                    {s.summary}
                  </p>
                  <div className="mt-10">
                    <p className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500">
                      Deliverables
                    </p>
                    <ul role="list" className="mt-4">
                      {s.deliverables.map((d) => (
                        <li
                          key={d}
                          className="flex items-start gap-3 border-t border-neutral-200 py-3 text-base text-neutral-800 first:border-t-0"
                        >
                          <Icon
                            name="check"
                            size="0.85rem"
                            className="mt-1 text-neutral-400"
                          />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </SectionShell>
        ))}

        <SectionShell>
          <div className="px-8 py-28 text-center md:px-12 md:py-36">
            <p className="font-mono text-[0.75rem] uppercase tracking-wider text-neutral-500">
              Next
            </p>
            <h2 className="mx-auto mt-4 max-w-[24ch] text-[60px] font-medium leading-[60px] tracking-[-0.025em] text-neutral-950">
              Ready to start at stage one?
            </h2>
            <p className="mx-auto mt-6 max-w-[52ch] text-lg text-neutral-500">
              Send a brief and I&apos;ll come back with a plan for the work,
              the timeline and what each stage needs to produce.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex min-h-10 items-center rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-medium text-white transition-[transform,background-color,color] duration-200 hover:bg-neutral-800 active:scale-[0.96]"
              >
                Send a brief
              </Link>
              <Link
                href="/work"
                className="inline-flex min-h-10 items-center rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-950 transition-[transform,background-color,color] duration-200 hover:bg-neutral-50 active:scale-[0.96]"
              >
                See the work
              </Link>
            </div>
          </div>
        </SectionShell>
      </PageRails>
      <Footer />
    </>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-neutral-950">{value}</dd>
    </div>
  );
}
