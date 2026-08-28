/**
 * UGEAFI — Congolese NGO working across eastern DRC and South Sudan.
 * Top nav: Home · About · Our Work · Impact · News · Contact, with Donate
 * pointing at an external Keela page. Our Work splits by country before it
 * splits by programme, and both languages share one URL tree.
 */
import {
  Block,
  HairLine,
  SitemapFigure,
  SitemapNode,
  Wireframe,
} from "./primitives";

const programmes = [
  "health",
  "education",
  "food-security",
  "wash",
  "economic",
  "environment",
  "peacebuilding",
  "protection",
];

export function UgeafiSitemap() {
  const rootCx = 440;
  const topLevel = [
    { x: 25, label: "/about" },
    { x: 165, label: "/programs" },
    { x: 305, label: "/impact" },
    { x: 445, label: "/news" },
    { x: 585, label: "/contact" },
    { x: 725, label: "Donate ↗" },
  ];

  return (
    <SitemapFigure
      title="Sitemap · ugeafi.org"
      meta="06 routes · 02 countries · 08 programmes"
      viewBox="0 0 880 500"
      notes={[
        "English and French share one URL tree. Language is a switch in the header, and each section keeps an en and fr content file, so the team edits a page once and sees both versions side by side.",
        "Our Work splits by country first, then by programme. DR Congo holds the base record; South Sudan overrides headline, stats and body per slug instead of duplicating eight more pages.",
        "Eight programmes run through one template: health, education, food security, WASH, economic empowerment, environment, peacebuilding, protection.",
        "Donations are handed off to UGEAFI's existing Keela page rather than rebuilt, so the finance team keeps the reporting it already uses.",
      ]}
    >
      <SitemapNode x={rootCx - 60} y={20} w={120} h={44} label="Home /" tone="dark" />

      {topLevel.map((n) => (
        <SitemapNode
          key={n.label}
          x={n.x}
          y={140}
          w={110}
          h={40}
          label={n.label}
          parentX={rootCx}
          parentY={64}
        />
      ))}

      {/* About holds the staff directory as a section, not a route */}
      <SitemapNode x={20} y={250} w={120} h={38} label="#staff" parentX={80} parentY={180} />

      {/* Our Work → country split */}
      <SitemapNode
        x={155}
        y={250}
        w={100}
        h={38}
        label="/drc"
        tone="accent"
        parentX={220}
        parentY={180}
      />
      <SitemapNode
        x={270}
        y={250}
        w={130}
        h={38}
        label="/south-sudan"
        tone="accent"
        parentX={220}
        parentY={180}
      />

      {/* News → article */}
      <SitemapNode
        x={430}
        y={250}
        w={140}
        h={38}
        label="/news/[slug]"
        parentX={500}
        parentY={180}
      />

      {/* One programme template under each country */}
      <SitemapNode
        x={120}
        y={355}
        w={150}
        h={42}
        label="[programme]"
        parentX={205}
        parentY={288}
      />
      <SitemapNode
        x={295}
        y={355}
        w={150}
        h={42}
        label="[programme]"
        parentX={335}
        parentY={288}
      />

      <text x={120} y={432} fontSize="11" fontFamily="inherit" fill="#a3a3a3">
        SHARED SLUGS
      </text>
      <text x={120} y={452} fontSize="11" fontFamily="inherit" fill="#737373">
        {programmes.slice(0, 4).join(" · ")}
      </text>
      <text x={120} y={470} fontSize="11" fontFamily="inherit" fill="#737373">
        {programmes.slice(4).join(" · ")}
      </text>

      {/* Editor-facing routes, drawn as a utility band */}
      <rect
        x={600}
        y={355}
        width={255}
        height={115}
        rx={10}
        fill="#fafafa"
        stroke="#d4d4d4"
        strokeDasharray="4 4"
      />
      <text x={620} y={385} fontSize="11" fontFamily="inherit" fill="#a3a3a3">
        EDITOR SURFACES
      </text>
      <text x={620} y={412} fontSize="12" fontFamily="inherit" fill="#0a0a0a">
        /admin · visual CMS
      </text>
      <text x={620} y={434} fontSize="12" fontFamily="inherit" fill="#0a0a0a">
        /guide · editing guide
      </text>
      <text x={620} y={456} fontSize="11" fontFamily="inherit" fill="#737373">
        Written for staff, not developers.
      </text>
    </SitemapFigure>
  );
}

export function UgeafiWireframe() {
  return (
    <Wireframe
      title="Programme detail wireframe"
      meta="Mid-fi · /programs/[country]/[programme]"
      annotations={[
        { x: 585, y: 66, label: "Language switch sits in the nav; English and French share the same URL" },
        { x: 508, y: 81, label: "Breadcrumb keeps the country in view: Home › Our Work › DR Congo › Food security" },
        { x: 762, y: 150, label: "South Sudan reuses this template and overrides only headline, stats and body" },
        { x: 400, y: 457, label: "Four stat fields per programme, edited in the CMS without touching layout" },
        { x: 762, y: 502, label: "Field video is optional; the slot collapses when a programme has none" },
      ]}
    >
      {/* Nav */}
      <Block x="20" y="20" w="130" h="36" label="UGEAFI" />
      <Block x="215" y="20" w="310" h="36" label="About · Our Work · Impact · News" />
      <Block x="545" y="20" w="80" h="36" label="EN / FR" />
      <Block x="640" y="20" w="140" h="36" label="Donate ↗" tone="dark" />

      <Block x="20" y="70" w="470" h="22" label="Home › Our Work › DR Congo › Food security" />

      {/* Hero */}
      <HairLine y="110" label="Programme hero" />
      <Block x="20" y="130" w="500" h="190" label="" />
      <text x="40" y="168" fontSize="13" fontFamily="inherit" fill="#a3a3a3">
        DR Congo · Programme 03 of 08
      </text>
      <text x="40" y="208" fontSize="28" fontFamily="inherit" fontWeight="600" fill="#0a0a0a">
        Food security
      </text>
      <text x="40" y="240" fontSize="13" fontFamily="inherit" fill="#525252">
        Improved seeds, tools and climate-smart training,
      </text>
      <text x="40" y="258" fontSize="13" fontFamily="inherit" fill="#525252">
        backed by village savings groups.
      </text>
      <Block x="40" y="278" w="150" h="30" label="Support this work" tone="dark" />

      {/* Country record panel */}
      <Block x="540" y="130" w="240" h="190" label="" tone="accent" />
      <text x="560" y="168" fontSize="11" fontFamily="inherit" fill="#7c3aed">
        COUNTRY RECORD
      </text>
      <text x="560" y="196" fontSize="16" fontFamily="inherit" fontWeight="600" fill="#5b21b6">
        DR Congo
      </text>
      <text x="560" y="222" fontSize="11" fontFamily="inherit" fill="#5b21b6">
        Fizi-Itombwe highlands
      </text>
      <text x="560" y="250" fontSize="11" fontFamily="inherit" fill="#5b21b6">
        South Sudan override:
      </text>
      <text x="560" y="268" fontSize="11" fontFamily="inherit" fill="#5b21b6">
        headline · stats · body
      </text>
      <text x="560" y="296" fontSize="11" fontFamily="inherit" fill="#5b21b6">
        Same slug, same template
      </text>

      {/* Key results */}
      <HairLine y="345" label="Key results · four CMS stat fields" />
      <Block x="20" y="365" w="180" h="80" label="5,647 households" />
      <Block x="210" y="365" w="180" h="80" label="33,882 beneficiaries" />
      <Block x="400" y="365" w="180" h="80" label="72 VSLA groups" />
      <Block x="590" y="365" w="190" h="80" label="1,800 members" />

      {/* Narrative + media + programme nav */}
      <HairLine y="470" label="Narrative · field video · programme navigation" />
      <Block x="20" y="490" w="480" h="65" label="Body copy, written per country" />
      <Block x="520" y="490" w="260" h="65" label="Field video (optional)" tone="accent" />
      <Block x="20" y="565" w="180" h="30" label="‹ Environment" />
      <Block x="600" y="565" w="180" h="30" label="WASH ›" />
    </Wireframe>
  );
}
