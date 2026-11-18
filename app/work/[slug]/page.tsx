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
import { CaseDetails, hasCaseDetails } from "@/components/site/case-studies/details";
import { AnimatedStack } from "@/components/site/AnimatedStack";
import { Reveal } from "@/components/site/Reveal";
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
          <AnimatedStack className="px-5 pt-16 pb-10 sm:px-8 sm:pt-20 sm:pb-12 md:px-12 md:pt-28 md:pb-16">
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
          </AnimatedStack>
        </SectionShell>

        <SectionShell>
          <Reveal className="px-5 pt-10 pb-16 sm:px-8 sm:pt-12 sm:pb-20 md:px-12 md:pt-16 md:pb-28">
            <CaseVideo slug={study.slug} poster={study.cover} />
          </Reveal>
        </SectionShell>

        {hasCaseDetails(study.slug) ? (
          <SectionShell>
            <div className="px-5 pb-16 sm:px-8 sm:pb-20 md:px-12 md:pb-28">
              <p className="mb-6 font-mono text-[0.75rem] uppercase tracking-wider text-neutral-500 sm:mb-8">
                Up close · The parts that move
              </p>
              <CaseDetails slug={study.slug} />
            </div>
          </SectionShell>
        ) : null}

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
          <Reveal className="px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-28">
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
          </Reveal>
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
        <Reveal stagger className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16">
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
        </Reveal>
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
    case "watsemba-miriam":
      return "Watsemba Miriam had years of published work spread across an ageing site: documentary reportage, photo stories, studio portraits and vlogs, all flattened into one feed. She needed each strand to stand on its own, the archive to survive the move intact, and a way to publish new work herself.";
    case "ugeafi":
      return "UGEAFI needed a site that could carry four decades of community-led work across two countries, publish in English and French from one place, and stay editable by staff across its Uvira, Goma and Juba offices rather than by a developer.";
    case "amani":
      return "AMANI is an independent research institute at the Mbale Regional Referral Hospital, running trials in maternal, newborn and child health. It needed one place where funders, partners and clinicians could see what it studies, what it has published and who does the work, built from the institute's own content document and photographs.";
    case "everfree-uganda":
      return "EverFree Uganda needed a site of its own to replace a single page on the global everfree.org. The brief set out five sections (landing, about, solutions, stories and connect), a donate button visible everywhere, animated impact figures, and the 2030 pillars, all inside an existing brand book.";
    case "cassia-lodge":
      return "Cassia Lodge already had a design in Framer. The rebuild had to keep that design and add what it couldn't do on its own: direct booking requests against real room availability, and one place for staff to confirm, decline or record stays that arrive by phone, email, walk-in or Booking.com.";
    case "nancy-kacungira":
      return "Nancy Kacungira, a former BBC World News presenter, advises and trains senior professionals and speaks at events. The first plan was a five-page site with a library, courses and a book waitlist. Her final brief narrowed it to two offers, advisory and speaking, with every call to action leading to one contact form.";
    case "nakasero-hospital":
      return "Nakasero Hospital offers specialist care across more than thirty disciplines, but patients, referring doctors and international visitors all arrive needing different things. The redesign had to get each of them to the right specialist, condition or care centre without making them learn how the hospital is organised.";
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
    case "watsemba-miriam":
      return "The archive came first. Before any layout work, I modelled what a photograph, a post, a photo story, a studio sitter and an external publication each needed to hold, then mapped the existing 32 posts onto that model. That decided the structure: four strands of work with their own indexes rather than one chronological feed, since a picture editor and a portrait client arrive looking for entirely different things.";
    case "ugeafi":
      return "The structural question was how to hold two countries and eight programmes in one site without doubling it. Discovery established that DR Congo and South Sudan run the same programme areas with different figures on the ground, so Our Work splits by country first, then reuses a single programme template with country-level overrides. Language was treated as a content layer rather than a second site, so English and French share one URL tree.";
    case "amani":
      return "The content document covered the founding story, services, staff bios, trials and papers. I organised it around what a visitor comes looking for: six active projects, six publications each linked by DOI, six services, and a team page with leadership separate from operations. The two risk calculators the researchers already used, NEORESUS and NEURODEV, became their own Tools section rather than links out to another app.";
    case "everfree-uganda":
      return "The first build followed the previews as separate pages. I then rebuilt it as one page with five chapters in the brief's own order, so the story reads straight through and the donate path is never more than a scroll away. The old page addresses still work: /about, /solutions, /stories and /connect each redirect to their chapter.";
    case "cassia-lodge":
      return "The public structure stayed close to the Framer original: rooms, services, gallery and contact, with three service pages for the restaurant, meetings and events, and weddings. The new work was behind it. Four room types with 28 rooms between them became the basis of an availability model, and a back office grew around how staff actually take bookings.";
    case "nancy-kacungira":
      return "Most of the discovery work was taking things out. The library, the courses, the book waitlist and several broken toolkit downloads all came off, because courses and books now sell through her social channels. What remained was four pages: Home, About, Speaking and Contact. Home splits visitors into individuals and organisations in its first two buttons.";
    case "nakasero-hospital":
      return "I organised the navigation around who is asking rather than how the hospital is run. A top row serves patients and visitors, international patients and medical professionals. Below it, six care centres sit in a mega-menu next to a 24/7 emergency link. A \"How can we help you today?\" helper on the home page asks who you are and what you need, then points you to the right page.";
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
    case "watsemba-miriam":
      return "For a photographer, the wireframe question is how little can sit around the picture. I used this stage to settle where the photograph ends and the reading starts, how a post declares its series without a heavy sidebar, and how comments and related work close a page without pulling attention back from the images.";
    case "ugeafi":
      return "The wireframes were used to work out how much evidence a programme page could carry before it stopped being readable. Each one had to hold a narrative, four headline results, optional field video and a route onward to the next programme, in either language, without the layout shifting when a field was left empty.";
    case "amani":
      return "The team page carried the most weight with funders, so I wireframed it first. Leadership sits in a three-column grid with photographs, while operations and research support sit in a quieter list below it. No staff photograph or job title was invented: anyone whose details hadn't been supplied was left off until they were.";
    case "everfree-uganda":
      return "The Solutions chapter holds the hardest content: survivor care, the six-dimension Freedom Lifemap, the partner network and the impact figures. I used the wireframe to order it from approach to evidence. I also tested the impact chart in a single-hue green ramp after the brand's own colours failed a red-green colour-blindness check, and gave it a table view beside the chart.";
    case "cassia-lodge":
      return "I wireframed the booking request before any other page, because every page ends in it. The questions were what a guest sees when a room type is nearly full, how a fully booked night shows in the calendar, and how to show a likely total without promising a confirmed price.";
    case "nancy-kacungira":
      return "The home page wireframe sets the order of the argument: the problems a visitor might recognise, then the two offers, then her story and the proof. The contact form went through the same cut. Event date and budget fields came out because they added friction at the point of enquiry, and the enquiry types came down to four.";
    case "nakasero-hospital":
      return "The doctor profile is where browsing turns into booking, so it got the most attention. Profile, biography and expandable details sit on the left. A booking card with a day picker and time slots sits on the right. I prototyped the profile alongside the condition, specialty, procedure and care-centre templates, so each one could hand off to a specialist.";
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
    case "watsemba-miriam":
      return "The archive moved across in full: 32 posts and 316 photographs, each post keeping the URL it was published under before the rebuild. Content now lives in Sanity, the Studio is embedded in the site itself, and publishing triggers a rebuild of only the pages that changed, so Miriam adds work without a developer in the loop.";
    case "ugeafi":
      return "The site launched at ugeafi.org with the programme, news and impact content in both languages, and with a visual CMS and a plain-language editing guide at /guide so staff could publish without a developer. Donations were pointed at the organisation's existing Keela page rather than rebuilt, keeping the finance team's reporting intact.";
    case "amani":
      return "The site launched at amanihealth.org as a fully static build across ten pages. NEORESUS, previously a separate PHP app, now runs in the browser, and NEURODEV reproduces the research team's own worked example to the same figure (97.58%). Rounds of feedback from the institute brightened the photography, removed a funding figure the team preferred not to publish, and filled in the last staff portraits.";
    case "everfree-uganda":
      return "The site is built and running as a preview, held out of search engines until EverFree launches it in place of the old Uganda page. It loads in about 480 KB on a first mobile visit, works without JavaScript or motion, and sends donations into EverFree's existing Classy checkout rather than a second payment system. The hero video and a growth infographic are waiting on files and year-by-year data from the client.";
    case "cassia-lodge":
      return "The rebuild went live at cassialodge.com. Every public page is prerendered, and only the booking, contact and availability endpoints run on the server, which checks availability again before accepting a request so a stale page can't overbook. Staff confirm or decline from the back office, the guest gets an email either way, and bookings are deleted automatically a year after check-out. A staff guide with practice copies of the admin pages lets new staff learn the system on made-up data.";
    case "nancy-kacungira":
      return "The rebuilt site is live on its Vercel address with four pages, two offers and one route to contact. Enquiries go through a Resend-backed form straight to her inbox. Removing the library, courses and waitlist also removed the broken links and empty sections that came with them.";
    case "nakasero-hospital":
      return "The redesign was delivered as a 17-page coded prototype, iterated page by page against the Figma files and review feedback. Its structure and patterns carried into the live site at nakaserohospital.com, which now runs on WordPress with the same areas-of-care tabs, patient helper, conditions A–Z and care-centre menu.";
    case "ayne":
      return "The end result was a brand-aligned shop that felt easier to browse and easier to maintain, especially for day-to-day catalogue and collection updates.";
    default:
      return "The site launched with the team able to take over publishing soon after handover, supported by documentation, walkthroughs and a defined post-launch support window.";
  }
}
