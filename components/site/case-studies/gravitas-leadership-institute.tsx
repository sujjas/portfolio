/**
 * Gravitas Leadership Institute — programmes-led leadership school.
 * Top nav: Home · Programmes · Faculty · Insights · About · Apply.
 * Each programme has dates, eligibility and an apply-now sub-page.
 */
import {
  Block,
  HairLine,
  SitemapFigure,
  SitemapNode,
  Wireframe,
} from "./primitives";

const programmes = [
  "Executive Leadership",
  "Public Service",
  "Emerging Leaders",
  "Women Leaders",
];

export function GravitasSitemap() {
  const rootCx = 440;
  return (
    <SitemapFigure
      title="Sitemap · gravitasleadershipinstitute.com"
      meta="06 routes · 04 programmes"
      notes={[
        "Each programme drives both /programmes/<slug> and /programmes/<slug>/apply, keeping the path predictable.",
        "Insights and Faculty share an authorship model so a faculty member's published work surfaces under both profiles.",
      ]}
    >
      <SitemapNode x={rootCx - 60} y={20} w={120} h={44} label="Home /" tone="dark" />
      {[
        { x: 40, label: "/about" },
        { x: 190, label: "/programmes" },
        { x: 340, label: "/faculty" },
        { x: 500, label: "/insights" },
        { x: 650, label: "/apply" },
        { x: 800, label: "/contact" },
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
      {programmes.map((p, i) => {
        const xs = 60 + i * 200;
        return (
          <SitemapNode
            key={p}
            x={xs}
            y={290}
            w={170}
            h={48}
            label={p}
            tone="accent"
            parentX={230}
            parentY={190}
          />
        );
      })}
      {/* Apply sub-pages */}
      {programmes.map((p, i) => {
        const xs = 105 + i * 200;
        return (
          <SitemapNode
            key={`${p}-apply`}
            x={xs}
            y={400}
            w={80}
            h={32}
            label="/apply"
            parentX={xs + 60}
            parentY={338}
          />
        );
      })}
    </SitemapFigure>
  );
}

export function GravitasWireframe() {
  return (
    <Wireframe
      title="Programme detail wireframe"
      meta="Hi-fi · /programmes/[slug]"
      annotations={[
        { x: 100, y: 80, label: "Breadcrumb: Home › Programmes › Executive Leadership" },
        { x: 400, y: 200, label: "Cohort dates pinned to the hero — most-asked question" },
        { x: 150, y: 380, label: "Two-column outcomes + eligibility, scannable on mobile" },
        { x: 640, y: 540, label: "Apply CTA repeats inside the page (top + sticky footer)" },
      ]}
    >
      {/* Nav */}
      <Block x="20" y="20" w="140" h="36" label="Gravitas" />
      <Block x="260" y="20" w="320" h="36" label="Programmes · Faculty · Insights · About" />
      <Block x="640" y="20" w="140" h="36" label="Apply" tone="dark" />

      <Block x="20" y="70" w="420" h="22" label="Home › Programmes › Executive Leadership" />

      {/* Hero */}
      <HairLine y="110" label="Programme hero" />
      <Block x="20" y="130" w="500" h="200" label="" />
      <text x="40" y="170" fontSize="14" fontFamily="inherit" fill="#a3a3a3">
        Programme · 12 weeks
      </text>
      <text x="40" y="210" fontSize="30" fontFamily="inherit" fontWeight="600" fill="#0a0a0a">
        Executive Leadership
      </text>
      <text x="40" y="240" fontSize="13" fontFamily="inherit" fill="#525252">
        For senior leaders shaping organisational strategy
      </text>
      <text x="40" y="258" fontSize="13" fontFamily="inherit" fill="#525252">
        and managing complexity across teams.
      </text>
      <Block x="40" y="280" w="120" h="34" label="Apply now" tone="dark" />
      <Block x="170" y="280" w="120" h="34" label="Download brief" />
      {/* Cohort meta side */}
      <Block x="540" y="130" w="240" h="200" label="" tone="accent" />
      <text x="560" y="170" fontSize="11" fontFamily="inherit" fill="#7c3aed">
        NEXT COHORT
      </text>
      <text x="560" y="200" fontSize="20" fontFamily="inherit" fontWeight="600" fill="#5b21b6">
        14 Jul 2026
      </text>
      <text x="560" y="222" fontSize="11" fontFamily="inherit" fill="#5b21b6">
        Apply by · 30 Jun 2026
      </text>
      <text x="560" y="248" fontSize="11" fontFamily="inherit" fill="#5b21b6">
        Hybrid · Nairobi + online
      </text>

      {/* Outcomes / Eligibility */}
      <HairLine y="355" label="Outcomes · Eligibility · Faculty" />
      <Block x="20" y="375" w="240" h="120" label="Outcomes" />
      <Block x="280" y="375" w="240" h="120" label="Eligibility" />
      <Block x="540" y="375" w="240" h="120" label="Faculty leads" />

      {/* Curriculum strip */}
      <HairLine y="520" label="Curriculum modules" />
      <Block x="20" y="540" w="180" h="50" label="01 · Strategy" />
      <Block x="210" y="540" w="180" h="50" label="02 · People" />
      <Block x="400" y="540" w="180" h="50" label="03 · Decision-making" />
      <Block x="590" y="540" w="190" h="50" label="04 · Capstone" tone="accent" />
    </Wireframe>
  );
}
