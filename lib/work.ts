export type CaseStudy = {
  slug: string;
  client: string;
  year: number;
  role: string;
  description: string;
  tags: string[];
  liveUrl: string;
  cover: string;
  video: string;
  /** Local brand mark. `null` when no logo file has been supplied yet. */
  logo: string | null;
  featured: boolean;
  /** Which case-study template renders this entry. Every client site is
   *  "web"; Rwazi product work lives in lib/product-work.ts as "product". */
  kind: "web" | "product";
};

const shot = (slug: string) => `/work/${slug}.webp`;
const reel = (slug: string) => `/work/${slug}.mp4`;

// Each logo's actual extension (PNG, AVIF or SVG). `null` means the
// asset hasn't been supplied yet — callers should fall back gracefully.
const logoExt: Record<string, "png" | "avif" | "svg" | null> = {
  "enterprise-uganda": "png",
  "space-for-wildlife": "avif",
  divinus: "png",
  "gravitas-leadership-institute": "avif",
  aerocruise: "png",
  kabojja: "avif",
  withela: "png",
  ayne: "avif",
  ugeafi: "png",
  "watsemba-miriam": "png",
  amani: "png",
  "everfree-uganda": "svg",
  "cassia-lodge": "png",
  "nancy-kacungira": "svg",
  "nakasero-hospital": "png",
};
const logo = (slug: string): string | null => {
  const ext = logoExt[slug];
  return ext ? `/work/logos/${slug}.${ext}` : null;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "enterprise-uganda",
    client: "Enterprise Uganda",
    year: 2026,
    role: "Information architecture, UX/UI, WordPress development, CMS setup, training",
    description:
      "A new website for Enterprise Uganda, shaped around clear structure, a flexible WordPress CMS and a handover the team could use confidently.",
    tags: ["WordPress", "Institution", "BDS", "Uganda"],
    liveUrl: "https://enterprise.co.ug",
    cover: shot("enterprise-uganda"),
    video: reel("enterprise-uganda"),
    logo: logo("enterprise-uganda"),
    featured: true,
    kind: "web",
  },
  {
    slug: "space-for-wildlife",
    client: "Space for Wildlife",
    year: 2024,
    role: "IA, UX/UI, Framer build, donation integration",
    description:
      "A conservation organisation in Kenya, with a clearer content structure and a Flutterwave donation flow.",
    tags: ["Framer", "NGO", "Donations", "Kenya"],
    liveUrl: "https://spaceforwildlife.org",
    cover: shot("space-for-wildlife"),
    video: reel("space-for-wildlife"),
    logo: logo("space-for-wildlife"),
    featured: false,
    kind: "web",
  },
  {
    slug: "kabojja",
    client: "Kabojja International",
    year: 2024,
    role: "IA, UX/UI, WordPress build",
    description:
      "A school website organised for parents, students, staff and partners.",
    tags: ["WordPress", "Education", "Uganda"],
    liveUrl: "https://kabojjainternational.com",
    cover: shot("kabojja"),
    video: reel("kabojja"),
    logo: logo("kabojja"),
    featured: true,
    kind: "web",
  },
  {
    slug: "divinus",
    client: "Divinus Investment Group",
    year: 2026,
    role: "IA, UX/UI, full Next.js development",
    description:
      "A group website for seven divisions, organised through one navigation system and a custom Next.js build.",
    tags: ["Next.js", "Pan-African", "Holding group"],
    liveUrl: "https://divinus.io",
    cover: shot("divinus"),
    video: reel("divinus"),
    logo: logo("divinus"),
    featured: true,
    kind: "web",
  },
  {
    slug: "ugeafi",
    client: "UGEAFI",
    year: 2026,
    role: "IA, UX/UI, Next.js development, bilingual CMS setup, editor training",
    description:
      "A bilingual site for a Congolese NGO working across eastern DRC and South Sudan, built around eight programmes, country-level content and a CMS the team edits in English and French.",
    tags: ["Next.js", "TinaCMS", "NGO", "DR Congo"],
    liveUrl: "https://ugeafi.org",
    cover: shot("ugeafi"),
    video: reel("ugeafi"),
    logo: logo("ugeafi"),
    featured: false,
    kind: "web",
  },
  {
    slug: "watsemba-miriam",
    client: "Watsemba Miriam",
    year: 2026,
    role: "IA, UX/UI, Next.js development, Sanity content model, archive migration",
    description:
      "A documentary photojournalist's archive rebuilt as a structured site, with 32 posts and 316 photographs migrated into Sanity and four strands of work held in one content model.",
    tags: ["Next.js", "Sanity", "Photography", "Uganda"],
    liveUrl: "https://miriamwatsemba.com",
    cover: shot("watsemba-miriam"),
    video: reel("watsemba-miriam"),
    logo: logo("watsemba-miriam"),
    featured: false,
    kind: "web",
  },
  {
    slug: "amani",
    client: "AMANI",
    year: 2026,
    role: "IA, UX/UI, Next.js development, research tools",
    description:
      "A health research institute in Mbale, organised around its trials, publications and team, with two of its clinical risk calculators rebuilt as pages on the site.",
    tags: ["Next.js", "Research", "Health", "Uganda"],
    liveUrl: "https://amanihealth.org",
    cover: shot("amani"),
    video: reel("amani"),
    logo: logo("amani"),
    featured: false,
    kind: "web",
  },
  {
    slug: "everfree-uganda",
    client: "EverFree Uganda",
    year: 2026,
    role: "IA, UX/UI within the brand book, Astro build, motion, data visualisation",
    description:
      "A one-page site for a survivor-centred anti-trafficking organisation, built inside its brand book, with accessible impact data and a donate path into EverFree's existing checkout.",
    tags: ["Astro", "NGO", "Donations", "Uganda"],
    liveUrl: "https://everfree-uganda.vercel.app",
    cover: shot("everfree-uganda"),
    video: reel("everfree-uganda"),
    logo: logo("everfree-uganda"),
    featured: false,
    kind: "web",
  },
  {
    slug: "cassia-lodge",
    client: "Cassia Lodge",
    year: 2026,
    role: "Next.js rebuild of a Framer design, booking system, staff back office",
    description:
      "A Kampala lodge's Framer site rebuilt in Next.js, with direct booking requests, live room availability and a back office staff use to confirm stays and close rooms.",
    tags: ["Next.js", "Hospitality", "Bookings", "Uganda"],
    liveUrl: "https://cassialodge.com",
    cover: shot("cassia-lodge"),
    video: reel("cassia-lodge"),
    logo: logo("cassia-lodge"),
    featured: false,
    kind: "web",
  },
  {
    slug: "nancy-kacungira",
    client: "Nancy Kacungira",
    year: 2026,
    role: "IA, UX/UI, Next.js development, contact flow",
    description:
      "An advisory and speaking site for a former BBC World News presenter, cut from a five-page plan with courses and books to four pages and two clear offers.",
    tags: ["Next.js", "Personal brand", "Speaking"],
    liveUrl: "https://nancy-kk.vercel.app",
    cover: shot("nancy-kacungira"),
    video: reel("nancy-kacungira"),
    logo: logo("nancy-kacungira"),
    featured: false,
    kind: "web",
  },
  {
    slug: "nakasero-hospital",
    client: "Nakasero Hospital",
    year: 2026,
    role: "UX/UI redesign, front-end prototype",
    description:
      "A redesign for a private hospital in Kampala, prototyped in code across 17 pages, that routes patients, referring doctors and international visitors to the right care.",
    tags: ["Healthcare", "Redesign", "Uganda"],
    liveUrl: "https://nakaserohospital.com",
    cover: shot("nakasero-hospital"),
    video: reel("nakasero-hospital"),
    logo: logo("nakasero-hospital"),
    featured: false,
    kind: "web",
  },
  {
    slug: "gravitas-leadership-institute",
    client: "Gravitas Leadership Institute",
    year: 2025,
    role: "IA, UX/UI, web development, CMS setup",
    description:
      "A leadership institute website with a clearer programme structure and a CMS the internal team could maintain.",
    tags: ["Institution", "Pan-African", "Leadership"],
    liveUrl: "https://gravitasleadershipinstitute.com",
    cover: shot("gravitas-leadership-institute"),
    video: reel("gravitas-leadership-institute"),
    logo: logo("gravitas-leadership-institute"),
    featured: false,
    kind: "web",
  },
  {
    slug: "aerocruise",
    client: "Aerocruise",
    year: 2025,
    role: "IA, UX/UI, custom development",
    description:
      "A content-heavy travel site with searchable collections across charters, safaris, destinations and lodges.",
    tags: ["Travel", "Search", "Kenya"],
    liveUrl: "https://aerocruise.co.ke",
    cover: shot("aerocruise"),
    video: reel("aerocruise"),
    logo: logo("aerocruise"),
    featured: false,
    kind: "web",
  },
  {
    slug: "withela",
    client: "Withela",
    year: 2025,
    role: "Brand site design and development",
    description:
      "A marketing site for Ela, focused on product narrative, app preview and store conversion.",
    tags: ["Product", "AI", "Brand"],
    liveUrl: "https://withela.com",
    cover: shot("withela"),
    video: reel("withela"),
    logo: logo("withela"),
    featured: false,
    kind: "web",
  },
  {
    slug: "ayne",
    client: "Ayne",
    year: 2023,
    role: "Brand design, e-commerce build",
    description:
      "An e-commerce site for a Ugandan fashion label, designed for day-to-day editing by the team.",
    tags: ["E-commerce", "Brand", "Uganda"],
    liveUrl: "https://www.ayne.ug",
    cover: shot("ayne"),
    video: reel("ayne"),
    logo: logo("ayne"),
    featured: false,
    kind: "web",
  },
];
