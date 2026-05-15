/**
 * Space for Wildlife — Kenyan conservation NGO with a donation flow.
 * Top nav: Home · Our Work · Field Updates · Donate · About · Contact.
 * The Donate route is the deepest path: amount → frequency → details →
 * Flutterwave handoff.
 */
import {
  Block,
  HairLine,
  SitemapFigure,
  SitemapNode,
  Wireframe,
} from "./primitives";

const donateFlow = [
  "Choose amount",
  "Frequency",
  "Your details",
  "Flutterwave",
  "Thank you",
];

export function SpaceForWildlifeSitemap() {
  const rootCx = 440;
  return (
    <SitemapFigure
      title="Sitemap · spaceforwildlife.org"
      meta="06 routes · 05-step donate flow"
      notes={[
        "Donate is a flow, not a page: five sequential steps captured as URL states for analytics + drop-off measurement.",
        "Field updates and Our Work share a content model (location, species, status, gallery) tagged by programme.",
      ]}
    >
      <SitemapNode x={rootCx - 60} y={20} w={120} h={44} label="Home /" tone="dark" />
      {/* Level 1 */}
      {[
        { x: 30, label: "/about" },
        { x: 180, label: "/our-work" },
        { x: 330, label: "/field-updates" },
        { x: 510, label: "/donate" },
        { x: 660, label: "/partners" },
        { x: 800, label: "/contact" },
      ].map((n) => (
        <SitemapNode
          key={n.label}
          x={n.x}
          y={150}
          w={90}
          h={40}
          label={n.label}
          parentX={rootCx}
          parentY={64}
        />
      ))}
      {/* Donate flow */}
      {donateFlow.map((step, i) => {
        const xs = 60 + i * 160;
        return (
          <SitemapNode
            key={step}
            x={xs}
            y={290}
            w={130}
            h={44}
            label={`0${i + 1} · ${step}`}
            tone="accent"
            parentX={555}
            parentY={190}
          />
        );
      })}
    </SitemapFigure>
  );
}

export function SpaceForWildlifeWireframe() {
  return (
    <Wireframe
      title="Donate flow wireframe"
      meta="Hi-fi · /donate"
      annotations={[
        { x: 100, y: 80, label: "Persistent crumb: Home › Donate › Step 02 of 05" },
        { x: 400, y: 200, label: "Single-question-per-step keeps friction low" },
        { x: 150, y: 380, label: "Local-currency presets (UGX, KES) before custom amount" },
        { x: 620, y: 510, label: "Flutterwave handoff replaces the form on step 04" },
      ]}
    >
      {/* Nav */}
      <Block x="20" y="20" w="220" h="36" label="Space for Wildlife" />
      <Block x="340" y="20" w="280" h="36" label="Our Work · Field Updates · About" />
      <Block x="640" y="20" w="140" h="36" label="Donate" tone="dark" />

      {/* Breadcrumb */}
      <Block x="20" y="70" w="360" h="22" label="Home › Donate › Step 02 of 05" />

      {/* Step body */}
      <HairLine y="110" label="Step body" />
      <Block x="20" y="130" w="500" h="220" label="" />
      <text x="40" y="170" fontSize="14" fontFamily="inherit" fill="#a3a3a3">
        Step 02 of 05
      </text>
      <text x="40" y="210" fontSize="28" fontFamily="inherit" fontWeight="600" fill="#0a0a0a">
        How would you like to give?
      </text>
      <Block x="40" y="240" w="140" h="56" label="One-time" tone="accent" />
      <Block x="200" y="240" w="140" h="56" label="Monthly" />
      <Block x="360" y="240" w="140" h="56" label="Quarterly" />
      <Block x="40" y="310" w="140" h="32" label="Back" />
      <Block x="200" y="310" w="200" h="32" label="Continue →" tone="dark" />

      {/* Side panel */}
      <Block x="540" y="130" w="240" h="220" label="" />
      <text x="560" y="170" fontSize="11" fontFamily="inherit" fill="#a3a3a3">
        WHAT IT FUNDS
      </text>
      <text x="560" y="200" fontSize="14" fontFamily="inherit" fontWeight="600" fill="#0a0a0a">
        Monthly · UGX 50,000
      </text>
      <text x="560" y="220" fontSize="11" fontFamily="inherit" fill="#525252">
        Feeds + protects two
      </text>
      <text x="560" y="234" fontSize="11" fontFamily="inherit" fill="#525252">
        rescued elephant calves
      </text>
      <text x="560" y="252" fontSize="11" fontFamily="inherit" fill="#525252">
        for one month.
      </text>

      {/* Steps row */}
      <HairLine y="395" label="Flow steps" />
      {donateFlow.map((s, i) => (
        <Block
          key={s}
          x={20 + i * 156}
          y={415}
          w={136}
          h={44}
          label={`0${i + 1} · ${s}`}
          tone={i === 1 ? "accent" : "neutral"}
        />
      ))}

      {/* Trust strip */}
      <HairLine y="485" label="Trust" />
      <Block x="20" y="505" w="240" h="80" label="Flutterwave · secure" />
      <Block x="280" y="505" w="240" h="80" label="Tax-receipt issued (KE)" />
      <Block x="540" y="505" w="240" h="80" label="Reg. NGO no. · footer" />
    </Wireframe>
  );
}
