import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PageRails } from "@/components/site/PageRails";
import { SectionShell } from "@/components/site/Section";
import { Icon } from "@/components/site/Icon";
import { ArrowChip } from "@/components/site/ArrowChip";
import { CaseVideo } from "@/components/site/case-studies/CaseVideo";
import { CaseSitemap, CaseWireframe } from "@/components/site/case-studies";
import { caseStudies, type CaseStudy } from "@/lib/work";

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudies.find((c) => c.slug === slug);
  if (!study) return { title: "Not found" };
  return {
    title: `${study.client} — Elijah Kasujja`,
    description: study.description,
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = caseStudies.find((c) => c.slug === slug);
  if (!study) notFound();

  const index = caseStudies.findIndex((c) => c.slug === study.slug);
  const next = caseStudies[(index + 1) % caseStudies.length];

  return (
    <>
      <Header />
      <PageRails>
        <SectionShell>
          <div className="px-5 pt-16 pb-10 sm:px-8 sm:pt-20 sm:pb-12 md:px-12 md:pt-28 md:pb-16">
            <p className="font-mono text-[0.75rem] uppercase tracking-wider text-neutral-500">
              Case study · {String(index + 1).padStart(2, "0")}
            </p>
            <h1 className="mt-6 max-w-[18ch] text-[40px] font-medium leading-[44px] tracking-[-0.025em] text-neutral-950 sm:text-[52px] sm:leading-[56px] md:text-[60px] md:leading-[60px]">
              {study.client}
            </h1>
            <p className="mt-5 max-w-[60ch] text-base text-neutral-500 sm:mt-6 sm:text-lg">
              {study.description}
            </p>

            <dl className="mt-10 flex flex-wrap items-start gap-x-8 gap-y-5 border-t border-neutral-200 pt-6 sm:mt-12 sm:gap-x-12 sm:pt-8">
              <Meta label="Year" value={String(study.year)} />
              <Meta label="Role" value={study.role} />
              <Meta label="Stack" value={study.tags.join(" · ")} />
              <Meta
                label="Live"
                value={
                  <a
                    href={study.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 break-all underline-offset-4 hover:underline"
                  >
                    {study.liveUrl.replace(/^https?:\/\//, "")}
                    <Icon
                      name="arrow-up-right-from-square"
                      size="0.7rem"
                      className="text-neutral-500"
                    />
                  </a>
                }
              />
            </dl>
          </div>
        </SectionShell>

        <SectionShell>
          <div className="px-5 pt-10 pb-16 sm:px-8 sm:pt-12 sm:pb-20 md:px-12 md:pt-16 md:pb-28">
            <CaseVideo slug={study.slug} poster={study.cover} />
          </div>
        </SectionShell>

        <CaseSection
          eyebrow="01 · The brief"
          title="What the client needed."
          subtitle={brief(study)}
        />

        <CaseSection
          eyebrow="02 · Discovery & IA"
          title="Structure, audience and sitemap."
          subtitle={discovery(study)}
        >
          <CaseSitemap slug={study.slug} />
        </CaseSection>

        <CaseSection
          eyebrow="03 · Wireframes & UX"
          title="From wireframes to prototype."
          subtitle={wireframes(study)}
        >
          <CaseWireframe slug={study.slug} />
        </CaseSection>

        <CaseSection
          eyebrow="04 · Outcome"
          title="What changed after launch."
          subtitle={outcome(study)}
        />

        <SectionShell>
          <div className="px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-28">
            <Link
              href={`/work/${next.slug}`}
              className="group block overflow-hidden rounded-3xl border border-neutral-200 bg-white ring-1 ring-black/5 transition-colors duration-200 hover:bg-neutral-50/60"
            >
              <div className="grid grid-cols-1 md:grid-cols-12">
                <div className="relative aspect-[16/10] md:col-span-7 md:aspect-auto">
                  <Image
                    src={next.cover}
                    alt={`${next.client} live site preview`}
                    fill
                    sizes="(min-width: 1024px) 700px, 100vw"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                    unoptimized
                  />
                </div>
                <div className="flex flex-col justify-center gap-4 p-6 sm:p-8 md:col-span-5 md:p-12">
                  <p className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500">
                    Next case study
                  </p>
                  <h2 className="text-[28px] font-medium leading-[34px] tracking-[-0.025em] text-neutral-950 sm:text-[36px] sm:leading-10">
                    {next.client}
                  </h2>
                  <p className="max-w-[44ch] text-base text-neutral-500">
                    {next.description}
                  </p>
                  <div className="mt-2">
                    <ArrowChip size={10} />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </SectionShell>
      </PageRails>
      <Footer />
    </>
  );
}

/* ─── partials ─── */

function CaseSection({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}) {
  return (
    <SectionShell>
      <div className="px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-28">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="font-mono text-[0.75rem] uppercase tracking-wider text-neutral-500">
              {eyebrow}
            </p>
            <h2 className="mt-4 max-w-[22ch] text-[28px] font-medium leading-[34px] tracking-[-0.025em] text-neutral-950 sm:text-[36px] sm:leading-10">
              {title}
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="max-w-[60ch] text-base text-neutral-700 sm:text-lg">
              {subtitle}
            </p>
            {children ? <div className="mt-8 sm:mt-10">{children}</div> : null}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

function Meta({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <dt className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500">
        {label}
      </dt>
      <dd className="mt-2 text-base font-medium text-neutral-950 sm:text-sm">{value}</dd>
    </div>
  );
}

/* ─── per-study copy fallbacks (lightweight until MDX) ─── */

function brief(c: CaseStudy) {
  switch (c.slug) {
    case "enterprise-uganda":
      return "Enterprise Uganda needed a clearer digital home for its programmes, partner directory, news and impact reporting, with a CMS the internal team could manage confidently.";
    case "space-for-wildlife":
      return "Space for Wildlife needed a site that could tell its story more clearly, surface fieldwork, and accept local-currency donations through Flutterwave.";
    case "divinus":
      return "Divinus needed one site for seven distinct divisions, with a clearer path for visitors to understand the group and find the right part of it quickly.";
    case "gravitas-leadership-institute":
      return "Gravitas Leadership Institute needed a site that could present its programmes with more clarity, support credibility at first glance, and give the internal team a simpler way to keep content current.";
    case "aerocruise":
      return "Aerocruise needed a content-heavy travel site that could hold together charters, safaris, destinations, lodges and editorial without becoming difficult to browse.";
    case "kabojja":
      return "Kabojja International School needed a site that spoke clearly to different audiences at once, especially parents, students, staff and prospective families.";
    case "withela":
      return "Withela needed a focused product-marketing site that could explain Ela quickly, show how the app works, and move visitors towards the app stores without friction.";
    case "ayne":
      return "Ayne needed an e-commerce site that felt aligned with the brand, supported day-to-day catalog updates, and made shopping straightforward on mobile.";
    default:
      return "The client needed a clearer web presence that reflected the depth of their work, with a CMS the team could update without depending on a developer.";
  }
}

function discovery(c: CaseStudy) {
  switch (c.slug) {
    case "enterprise-uganda":
      return "The early work here was mostly about structure. The site needed to serve people looking for programmes, partnerships, updates and institutional information without feeling dense. I used the discovery phase to simplify the navigation, separate core content types, and make sure the team would have a structure they could keep extending after launch.";
    case "space-for-wildlife":
      return "The main question was how to balance story and action. The site needed space for fieldwork, campaigns and organisational context, but it also needed to make donating feel natural. Discovery focused on what visitors needed to understand first, what could sit deeper in the site, and how content could support both trust and momentum.";
    case "divinus":
      return "The core challenge was organisational clarity. With seven divisions under one group, the site needed to help visitors understand both the whole and the parts without getting lost in corporate language. I used discovery to define the group structure, decide what belonged at parent level versus division level, and build a sitemap that made the group easier to read.";
    case "gravitas-leadership-institute":
      return "This project needed a clearer academic structure. The programmes carried most of the weight, so discovery focused on how they should be grouped, what information mattered most to a first-time visitor, and how the internal team could keep programme content consistent over time.";
    case "aerocruise":
      return "The challenge here was scale. Charters, safaris, destinations, lodges and editorial all needed to live together without competing for attention. Discovery was less about a single narrative and more about designing a content system that made browsing, filtering and cross-linking feel manageable.";
    case "kabojja":
      return "This was an audience-routing problem from the start. Parents, students, staff and prospective families each arrive with different questions, so the structure had to help them find the right path quickly. Discovery focused on entry points, hierarchy and the information each audience needed most often.";
    case "withela":
      return "The product itself needed to be understood quickly, so discovery focused on message order. What should visitors grasp first, what proof they needed next, and where store calls to action should appear all shaped the structure before visual design started.";
    case "ayne":
      return "The early work was about reducing friction. The structure had to support browsing by collection, make mobile shopping feel easy, and leave the team with a setup they could update regularly without making the catalogue harder to manage.";
    default:
      return "I started with stakeholder conversations, a review of the existing site where one existed, and a clearer picture of who the site needed to serve. From there, I mapped the sitemap, content model and editorial structure before visual design began.";
  }
}

function wireframes(c: CaseStudy) {
  switch (c.slug) {
    case "enterprise-uganda":
      return "The wireframes were used to test how people would move between institutional information and programme content without losing context. I also used this stage to work through how repeatable pages should behave, so the CMS would not be held together by one-off layouts.";
    case "space-for-wildlife":
      return "The wireframes focused on pacing. I used them to shape how story, imagery, proof and donation prompts would appear across the site, making sure the journey felt inviting rather than heavy-handed.";
    case "divinus":
      return "Here the wireframes were mostly about wayfinding. I used them to test how quickly someone could understand the group, move into a division, and still feel the relationship between each part and the whole.";
    case "gravitas-leadership-institute":
      return "The wireframes helped clarify how programmes would be compared, scanned and explored. This stage was important for getting the content hierarchy right before visual styling added polish on top.";
    case "aerocruise":
      return "The wireframes were used to test browse patterns, especially how people would move between listings, supporting detail pages and related content. The key question was whether the site still felt navigable once many content types were in play.";
    case "kabojja":
      return "This stage focused on entry points and routes. I used the wireframes to test how parents, students and prospective families would land on the site, and whether the important next steps were visible quickly enough.";
    case "withela":
      return "The wireframes were about message sequence and conversion. I used them to shape how product explanation, app preview and store calls to action would support each other without cluttering the page.";
    case "ayne":
      return "The wireframes focused on product browsing and checkout flow, especially on mobile. I used them to simplify the path from landing on a collection to viewing product details and moving into purchase.";
    default:
      return "I worked from low-fidelity wireframes into a clickable prototype, using that stage to test the main journeys before moving into final design.";
  }
}

function outcome(c: CaseStudy) {
  switch (c.slug) {
    case "enterprise-uganda":
      return "The final result was a more structured institutional site, with publishing handed back to the team through documentation, walkthroughs and a CMS setup they could keep using with confidence.";
    case "space-for-wildlife":
      return "The site gave the organisation a clearer way to tell its story, surface work from the field and support donations, while leaving the team with a manageable publishing workflow after handover.";
    case "divinus":
      return "The finished site made the group easier to understand, easier to navigate and easier to extend over time, without losing the relationship between the parent brand and its divisions.";
    case "gravitas-leadership-institute":
      return "The outcome was a clearer programme-led site, supported by a content structure the internal team could maintain without having to rebuild pages by hand.";
    case "aerocruise":
      return "The site launched as a much more navigable content system, making it easier to browse a wide range of travel information while keeping the editing side under control.";
    case "kabojja":
      return "The finished site gave the school clearer audience routes and a stronger sense of structure, while making ongoing updates more manageable for the team behind it.";
    case "withela":
      return "The launch produced a cleaner product-marketing site, one that explained the app quickly and gave the team an easier base for future messaging updates.";
    case "ayne":
      return "The end result was a brand-aligned shop that felt easier to browse and easier to maintain, especially for day-to-day catalogue and collection updates.";
    default:
      return "The site launched with the team able to take over publishing soon after handover, supported by documentation, walkthroughs and a defined post-launch support window.";
  }
}
