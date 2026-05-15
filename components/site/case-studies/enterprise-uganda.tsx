/**
 * Enterprise Uganda — institutional BDS site.
 * Top nav: Home · About · Programmes · Resources · News · Contact.
 * The Programmes hub is the deepest node (six core programmes, each its
 * own CMS-driven detail page).
 */
import {
  Block,
  HairLine,
  SitemapFigure,
  SitemapNode,
  Wireframe,
} from "./primitives";

const programmes = [
  "Entrepreneurship",
  "Business growth",
  "Women in business",
  "Youth in business",
  "MSME",
  "Advisory",
];

export function EnterpriseUgandaSitemap() {
  const rootCx = 440;
  return (
    <SitemapFigure
      title="Sitemap · enterprise.co.ug"
      meta="06 routes · 06 programmes"
      notes={[
        "Programmes follows one CMS-driven template, shared across all six entries (hero, mandate, outcomes, downloads, contact).",
        "Resources holds long-form downloads (toolkits, reports) shared across programmes via a tag-based content model.",
      ]}
    >
      <SitemapNode x={rootCx - 60} y={20} w={120} h={44} label="Home /" tone="dark" />
      {/* Level 1 */}
      {[
        { x: 50, label: "/about" },
        { x: 200, label: "/programmes" },
        { x: 350, label: "/resources" },
        { x: 500, label: "/news" },
        { x: 650, label: "/contact" },
        { x: 800, label: "/partners" },
      ].map((n) => (
        <SitemapNode
          key={n.label}
          x={n.x}
          y={150}
          w={80}
          h={40}
          label={n.label}
          parentX={rootCx}
          parentY={64}
        />
      ))}
      {/* Level 2 — Programmes children */}
      {programmes.map((p, i) => {
        const xs = 70 + i * 130;
        return (
          <SitemapNode
            key={p}
            x={xs}
            y={290}
            w={110}
            h={48}
            label={p}
            tone="accent"
            parentX={240}
            parentY={190}
          />
        );
      })}
    </SitemapFigure>
  );
}

export function EnterpriseUgandaWireframe() {
  return (
    <Wireframe
      title="Programmes hub wireframe"
      meta="Hi-fi · /programmes"
      annotations={[
        { x: 100, y: 60, label: "Sticky nav with mega-menu under Programmes" },
        { x: 400, y: 200, label: "Programme intent: who it's for, what it produces" },
        { x: 200, y: 380, label: "Programme card grid, filterable by audience" },
        { x: 600, y: 510, label: "Resources rail pulled from shared CMS collection" },
      ]}
    >
      {/* Nav */}
      <Block x="20" y="20" w="170" h="36" label="Enterprise Uganda" />
      <Block x="290" y="20" w="320" h="36" label="About · Programmes ▾ · Resources · News" />
      <Block x="640" y="20" w="140" h="36" label="Contact" tone="dark" />

      {/* Hero */}
      <HairLine y="80" label="Programmes intent" />
      <Block x="20" y="100" w="500" h="170" label="" />
      <text x="40" y="160" fontSize="26" fontFamily="inherit" fontWeight="600" fill="#0a0a0a">
        Practical support for
      </text>
      <text x="40" y="195" fontSize="26" fontFamily="inherit" fontWeight="600" fill="#0a0a0a">
        Ugandan enterprises.
      </text>
      <text x="40" y="225" fontSize="13" fontFamily="inherit" fill="#525252">
        Six structured programmes across entrepreneurship, business
      </text>
      <text x="40" y="243" fontSize="13" fontFamily="inherit" fill="#525252">
        growth, advisory and MSME support.
      </text>
      <Block x="540" y="100" w="240" h="170" label="Eligibility filters" tone="accent" />

      {/* Programme grid */}
      <HairLine y="295" label="Programmes · CMS collection" />
      {programmes.map((p, i) => (
        <Block
          key={p}
          x={20 + (i % 3) * 260}
          y={315 + Math.floor(i / 3) * 110}
          w={240}
          h={90}
          label={p}
          tone={i === 0 ? "accent" : "neutral"}
        />
      ))}

      {/* Resources rail */}
      <HairLine y="545" label="Resources · toolkits, reports, briefs" />
      <Block x="20" y="560" w="240" h="32" label="Toolkit · Business growth" />
      <Block x="280" y="560" w="240" h="32" label="Report · MSME outlook" />
      <Block x="540" y="560" w="240" h="32" label="Brief · Programme guide" />
    </Wireframe>
  );
}
