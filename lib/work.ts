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

// Each logo's actual extension (some are PNG, some AVIF). `null` means the
// asset hasn't been supplied yet — callers should fall back gracefully.
const logoExt: Record<string, "png" | "avif" | null> = {
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
