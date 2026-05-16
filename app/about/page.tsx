import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PageRails } from "@/components/site/PageRails";
import { SectionShell } from "@/components/site/Section";
import { Lanyard } from "@/components/site/Lanyard";
import { AnimatedStack } from "@/components/site/AnimatedStack";
import { Reveal } from "@/components/site/Reveal";

export const metadata: Metadata = {
  title: "About — Elijah Kasujja",
  description:
    "Design engineer based in Kampala. I design and build websites end to end, from information architecture through to launch and handover.",
};

const experience = [
  {
    role: "Product Designer",
    org: "Rwazi",
    period: "2023 — Present",
    location: "United States · Remote · Part-time",
    body: "I lead product design on a market intelligence platform, with a focus on design systems, responsive dashboards and turning complex information into clear interfaces.",
  },
  {
    role: "Graphic, Brand & Web Designer",
    org: "Elevate Uganda",
    period: "2021 — 2023",
    location: "Kampala · Remote · Part-time",
    body: "Designed brand systems and built responsive websites for Ugandan clients, from early structure through to launch.",
  },
];

const toolsets = [
  {
    label: "Design",
    items: ["Figma", "Framer", "Adobe Illustrator", "Photoshop"],
  },
  {
    label: "CMS & Web Build",
    items: ["WordPress", "Webflow", "Framer", "Sanity", "Next.js", "MDX"],
  },
  {
    label: "Frontend",
    items: ["React", "Tailwind CSS", "TypeScript", "GSAP"],
  },
  {
    label: "Hosting & Infra",
    items: ["Vercel", "DNS / SSL", "GitHub Actions"],
  },
  {
    label: "Research & Analytics",
    items: ["Plausible", "Google Analytics", "Hotjar", "Maze"],
  },
  {
    label: "Accessibility & QA",
    items: ["WCAG 2.1", "Axe", "Lighthouse", "Manual screen-reader QA"],
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <PageRails>
        <SectionShell>
          <div className="grid grid-cols-1 items-stretch lg:grid-cols-12">
            <AnimatedStack className="px-5 pt-16 pb-12 sm:px-8 sm:pt-20 sm:pb-16 md:px-12 md:pt-28 md:pb-20 lg:col-span-6 lg:pr-12">
              <Eyebrow />
              <Title />
              <Subtitle />
              <MetaRow />
            </AnimatedStack>
            {/* Desktop: Lanyard sits in the hero's right column. */}
            <div className="relative hidden min-h-[760px] lg:col-span-6 lg:block">
              <Lanyard />
            </div>
          </div>
        </SectionShell>

        {/* Mobile/tablet: Lanyard gets its own full-width section below the
            hero. Hidden from lg up so it doesn't double up with the hero
            column. */}
        <SectionShell>
          <div className="relative h-[60vh] min-h-[480px] sm:h-[70vh] lg:hidden">
            <Lanyard />
          </div>
        </SectionShell>

        <SectionShell>
          <div className="px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-28">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16">
              <Reveal stagger className="lg:col-span-4">
                <p className="font-mono text-[0.75rem] uppercase tracking-wider text-neutral-500">
                  Experience
                </p>
                <h2 className="mt-4 max-w-[18ch] text-[28px] font-medium leading-[34px] tracking-[-0.025em] text-neutral-950 sm:text-[36px] sm:leading-10">
                  Design and build.{" "}
                  <span className="text-neutral-400">
                    One practice, end to end.
                  </span>
                </h2>
              </Reveal>
              <Reveal stagger selector="li" className="lg:col-span-8">
              <ol role="list">
                {experience.map((e) => (
                  <li
                    key={e.org}
                    className="grid grid-cols-1 gap-2 border-t border-neutral-200 py-6 first:border-t-0 last:pb-0 sm:grid-cols-12 sm:gap-6 sm:py-8"
                  >
                    <div className="sm:col-span-4">
                      <p className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500 tabular-nums">
                        {e.period}
                      </p>
                      <p className="mt-2 text-base text-neutral-500 sm:text-sm">
                        {e.location}
                      </p>
                    </div>
                    <div className="sm:col-span-8">
                      <h3 className="text-lg font-medium tracking-tight text-neutral-950 sm:text-xl">
                        {e.role}{" "}
                        <span className="text-neutral-400">· {e.org}</span>
                      </h3>
                      <p className="mt-3 max-w-[58ch] text-base text-neutral-500">
                        {e.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
              </Reveal>
            </div>
          </div>
        </SectionShell>

        <SectionShell>
          <div className="px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-28">
            <Reveal stagger>
              <p className="font-mono text-[0.75rem] uppercase tracking-wider text-neutral-500">
                Tools
              </p>
              <h2 className="mt-4 max-w-[40ch] text-[28px] font-medium leading-[34px] tracking-[-0.025em] text-neutral-950 sm:text-[36px] sm:leading-10">
                What I work with.{" "}
                <span className="text-neutral-400">
                  I choose tools to suit the work, but most projects land
                  somewhere between Figma, WordPress, Next.js and Vercel.
                </span>
              </h2>
            </Reveal>
            <Reveal stagger selector="[data-toolset]" className="mt-10 grid grid-cols-1 gap-x-10 gap-y-10 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
              {toolsets.map((t) => (
                <div key={t.label} data-toolset className="border-t border-neutral-200 pt-5">
                  <p className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500">
                    {t.label}
                  </p>
                  <ul
                    role="list"
                    className="mt-3 flex flex-wrap gap-x-2 gap-y-2"
                  >
                    {t.items.map((it) => (
                      <li
                        key={it}
                        className="rounded-full border border-neutral-200 px-3 py-1.5 text-base font-medium text-neutral-800 sm:py-1 sm:text-sm"
                      >
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </Reveal>
          </div>
        </SectionShell>

        <SectionShell>
          <Reveal stagger className="px-5 py-20 text-center sm:px-8 sm:py-28 md:px-12 md:py-36">
            <p className="font-mono text-[0.75rem] uppercase tracking-wider text-neutral-500">
              Next
            </p>
            <h2 className="mx-auto mt-4 max-w-[24ch] text-[40px] font-medium leading-[44px] tracking-[-0.025em] text-neutral-950 sm:text-[52px] sm:leading-[56px] md:text-[60px] md:leading-[60px]">
              Have a project in mind?{" "}
              <span className="text-neutral-400">Let&apos;s talk.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-[52ch] text-base text-neutral-500 sm:mt-6 sm:text-lg">
              I usually reply within one to two working days. Booking new
              projects from June 2026.
            </p>
            <div className="mt-8 flex flex-col items-stretch gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-neutral-950 px-5 py-3 text-base font-medium text-white transition-[transform,background-color,color] duration-200 hover:bg-neutral-800 active:scale-[0.96] sm:min-h-10 sm:py-2.5 sm:text-sm"
              >
                Send a brief
              </Link>
              <a
                href="/cv.pdf"
                download
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-neutral-300 bg-white px-5 py-3 text-base font-medium text-neutral-950 transition-[transform,background-color,color] duration-200 hover:bg-neutral-50 active:scale-[0.96] sm:min-h-10 sm:py-2.5 sm:text-sm"
              >
                Download CV
              </a>
            </div>
          </Reveal>
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
      <dd className="mt-1 text-base font-medium text-neutral-950 sm:text-sm">{value}</dd>
    </div>
  );
}

function Eyebrow() {
  return (
    <p className="font-mono text-[0.75rem] uppercase tracking-wider text-neutral-500">
      About
    </p>
  );
}

function Title() {
  return (
    <h1 className="mt-6 max-w-[24ch] text-[40px] font-medium leading-[44px] tracking-[-0.025em] text-neutral-950 sm:text-[52px] sm:leading-[56px] md:text-[60px] md:leading-[60px]">
      Design engineer, based in Kampala.
    </h1>
  );
}

function Subtitle() {
  return (
    <p className="mt-5 max-w-[60ch] text-base text-neutral-500 sm:mt-6 sm:text-lg">
      I design and build websites end to end, from information architecture
      and interface design through to CMS setup, launch and handover. By day
      I lead product design at Rwazi, where I work on data-heavy products and
      design systems. Alongside that, I build websites for clients across East
      Africa.
    </p>
  );
}

function MetaRow() {
  return (
    <dl className="mt-6 flex flex-wrap items-start gap-x-8 gap-y-5 sm:mt-8 sm:gap-x-12">
      <Meta label="Based in" value="Kampala, Uganda" />
      <Meta label="Time zone" value="GMT+3" />
      <Meta label="Focus" value="Websites, CMS, design systems" />
    </dl>
  );
}
