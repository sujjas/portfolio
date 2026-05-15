import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PageRails } from "@/components/site/PageRails";
import { SectionShell } from "@/components/site/Section";
import { Lanyard } from "@/components/site/Lanyard";

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
            <div className="px-8 pt-20 pb-16 md:px-12 md:pt-28 md:pb-20 lg:col-span-6 lg:pr-12">
              <Eyebrow />
              <Title />
              <Subtitle />
              <MetaRow />
            </div>
            <div className="relative min-h-[560px] lg:col-span-6 lg:min-h-[760px]">
              <Lanyard />
            </div>
          </div>
        </SectionShell>

        <SectionShell>
          <div className="px-8 py-20 md:px-12 md:py-28">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-4">
                <p className="font-mono text-[0.75rem] uppercase tracking-wider text-neutral-500">
                  Experience
                </p>
                <h2 className="mt-4 max-w-[18ch] text-[36px] font-medium leading-10 tracking-[-0.025em] text-neutral-950">
                  Design and build.{" "}
                  <span className="text-neutral-400">
                    One practice, end to end.
                  </span>
                </h2>
              </div>
              <ol role="list" className="lg:col-span-8">
                {experience.map((e) => (
                  <li
                    key={e.org}
                    className="grid grid-cols-12 gap-6 border-t border-neutral-200 py-8 first:border-t-0 last:pb-0"
                  >
                    <div className="col-span-12 sm:col-span-4">
                      <p className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500 tabular-nums">
                        {e.period}
                      </p>
                      <p className="mt-2 text-sm text-neutral-500">
                        {e.location}
                      </p>
                    </div>
                    <div className="col-span-12 sm:col-span-8">
                      <h3 className="text-xl font-medium tracking-tight text-neutral-950">
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
            </div>
          </div>
        </SectionShell>

        <SectionShell>
          <div className="px-8 py-20 md:px-12 md:py-28">
            <p className="font-mono text-[0.75rem] uppercase tracking-wider text-neutral-500">
              Tools
            </p>
            <h2 className="mt-4 max-w-[40ch] text-[36px] font-medium leading-10 tracking-[-0.025em] text-neutral-950">
              What I work with.{" "}
              <span className="text-neutral-400">
                I choose tools to suit the work, but most projects land
                somewhere between Figma, WordPress, Next.js and Vercel.
              </span>
            </h2>
            <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {toolsets.map((t) => (
                <div key={t.label} className="border-t border-neutral-200 pt-5">
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
                        className="rounded-full border border-neutral-200 px-3 py-1 text-sm font-medium text-neutral-800"
                      >
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </SectionShell>

        <SectionShell>
          <div className="px-8 py-28 text-center md:px-12 md:py-36">
            <p className="font-mono text-[0.75rem] uppercase tracking-wider text-neutral-500">
              Next
            </p>
            <h2 className="mx-auto mt-4 max-w-[24ch] text-[60px] font-medium leading-[60px] tracking-[-0.025em] text-neutral-950">
              Have a project in mind?{" "}
              <span className="text-neutral-400">Let&apos;s talk.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-[52ch] text-lg text-neutral-500">
              I usually reply within one to two working days. Booking new
              projects from June 2026.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex min-h-10 items-center rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-medium text-white transition-[transform,background-color,color] duration-200 hover:bg-neutral-800 active:scale-[0.96]"
              >
                Send a brief
              </Link>
              <a
                href="/cv.pdf"
                download
                className="inline-flex min-h-10 items-center rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-950 transition-[transform,background-color,color] duration-200 hover:bg-neutral-50 active:scale-[0.96]"
              >
                Download CV
              </a>
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

function Eyebrow() {
  return (
    <p className="font-mono text-[0.75rem] uppercase tracking-wider text-neutral-500">
      About
    </p>
  );
}

function Title() {
  return (
    <h1 className="mt-6 max-w-[24ch] text-[60px] font-medium leading-[60px] tracking-[-0.025em] text-neutral-950">
      Design engineer, based in Kampala.
    </h1>
  );
}

function Subtitle() {
  return (
    <p className="mt-6 max-w-[60ch] text-lg text-neutral-500">
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
    <dl className="mt-8 flex flex-wrap items-start gap-x-12 gap-y-5">
      <Meta label="Based in" value="Kampala, Uganda" />
      <Meta label="Time zone" value="GMT+3" />
      <Meta label="Focus" value="Websites, CMS, design systems" />
    </dl>
  );
}
