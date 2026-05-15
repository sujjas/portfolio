/**
 * Withela — product-marketing site for the Ela AI chatbot. Lean
 * single-product structure: hero → features → use cases → store
 * download. Blog sits to the side for SEO + announcements.
 */
import {
  Block,
  HairLine,
  SitemapFigure,
  SitemapNode,
  Wireframe,
} from "./primitives";

export function WithelaSitemap() {
  const rootCx = 440;
  return (
    <SitemapFigure
      title="Sitemap · withela.com"
      meta="06 routes · App-store conversion focus"
      notes={[
        "Single-product structure: every primary route ladders toward the store CTA. No deep hierarchy.",
        "/use-cases is one page with anchored sections per scenario — keeps SEO singular and bounce predictable.",
      ]}
    >
      <SitemapNode x={rootCx - 60} y={20} w={120} h={44} label="Home /" tone="dark" />
      {[
        { x: 60, label: "/features" },
        { x: 220, label: "/use-cases" },
        { x: 380, label: "/pricing" },
        { x: 540, label: "/download", tone: "accent" as const },
        { x: 700, label: "/blog" },
      ].map((n) => (
        <SitemapNode
          key={n.label}
          x={n.x}
          y={150}
          w={130}
          h={44}
          label={n.label}
          tone={n.tone}
          parentX={rootCx}
          parentY={64}
        />
      ))}
      {/* Download → store handoffs */}
      <SitemapNode x={460} y={280} w={140} h={40} label="App Store" tone="accent" parentX={605} parentY={194} />
      <SitemapNode x={620} y={280} w={140} h={40} label="Google Play" tone="accent" parentX={605} parentY={194} />
      {/* Blog posts */}
      <SitemapNode x={60} y={400} w={140} h={32} label="Post · launch" parentX={765} parentY={194} />
      <SitemapNode x={210} y={400} w={140} h={32} label="Post · how-to" parentX={765} parentY={194} />
      <SitemapNode x={360} y={400} w={140} h={32} label="Post · feature" parentX={765} parentY={194} />
    </SitemapFigure>
  );
}

export function WithelaWireframe() {
  return (
    <Wireframe
      title="Home wireframe"
      meta="Hi-fi · /"
      annotations={[
        { x: 100, y: 60, label: "Header CTA repeats the same Get the app action" },
        { x: 400, y: 200, label: "Hero leads with one sentence + an in-product preview" },
        { x: 200, y: 410, label: "Three use-case tiles, each linking to an anchor on /use-cases" },
        { x: 640, y: 540, label: "Store buttons pinned at the bottom — the single goal of the page" },
      ]}
    >
      {/* Nav */}
      <Block x="20" y="20" w="120" h="36" label="Withela" />
      <Block x="240" y="20" w="280" h="36" label="Features · Use cases · Pricing" />
      <Block x="640" y="20" w="140" h="36" label="Get the app" tone="dark" />

      {/* Hero */}
      <HairLine y="80" label="Hero" />
      <Block x="20" y="100" w="430" h="280" label="" />
      <text x="40" y="160" fontSize="32" fontFamily="inherit" fontWeight="600" fill="#0a0a0a">
        Meet Ela.
      </text>
      <text x="40" y="200" fontSize="32" fontFamily="inherit" fontWeight="600" fill="#0a0a0a">
        Your AI sidekick
      </text>
      <text x="40" y="240" fontSize="32" fontFamily="inherit" fontWeight="600" fill="#a3a3a3">
        for everyday work.
      </text>
      <text x="40" y="270" fontSize="13" fontFamily="inherit" fill="#525252">
        Short replies, sharp summaries, in your pocket.
      </text>
      <Block x="40" y="295" w="140" h="38" label="App Store" tone="dark" />
      <Block x="190" y="295" w="140" h="38" label="Google Play" />

      {/* App preview */}
      <Block x="470" y="100" w="310" h="280" label="App preview · device frame" tone="accent" />

      {/* Use cases */}
      <HairLine y="405" label="Three use cases" />
      <Block x="20" y="425" w="240" h="120" label="Drafting + tone" />
      <Block x="280" y="425" w="240" h="120" label="Quick summaries" />
      <Block x="540" y="425" w="240" h="120" label="Daily planning" />

      {/* Bottom CTA */}
      <HairLine y="565" label="Store CTA" />
    </Wireframe>
  );
}
