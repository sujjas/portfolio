/**
 * Aerocruise — content-heavy Kenyan travel site. Four primary content
 * types (Charters, Safaris, Destinations, Lodges) all use a shared
 * "listing → detail" pattern with searchable, filterable collections.
 */
import {
  Block,
  HairLine,
  SitemapFigure,
  SitemapNode,
  Wireframe,
} from "./primitives";

const contentTypes = [
  { label: "Charters", items: ["Cessna fleet", "Pricing", "Routes"] },
  { label: "Safaris", items: ["Itineraries", "Conservancies", "Season"] },
  { label: "Destinations", items: ["Maasai Mara", "Amboseli", "Lamu"] },
  { label: "Lodges", items: ["Tented", "Conservancy", "Family"] },
];

export function AerocruiseSitemap() {
  const rootCx = 440;
  return (
    <SitemapFigure
      title="Sitemap · aerocruise.co.ke"
      meta="06 routes · 04 content types"
      viewBox="0 0 880 560"
      notes={[
        "Four content types share one listing → detail pattern. Each detail page cross-links to the other three by destination and season.",
        "Search is a top-level route, not a header dropdown — it indexes all four types with shared filters (location, length, budget).",
      ]}
    >
      <SitemapNode x={rootCx - 60} y={20} w={120} h={44} label="Home /" tone="dark" />
      {[
        { x: 30, label: "/about" },
        { x: 180, label: "/charters" },
        { x: 320, label: "/safaris" },
        { x: 460, label: "/destinations" },
        { x: 620, label: "/lodges" },
        { x: 770, label: "/search" },
      ].map((n) => (
        <SitemapNode
          key={n.label}
          x={n.x}
          y={150}
          w={100}
          h={40}
          label={n.label}
          parentX={rootCx}
          parentY={64}
        />
      ))}
      {contentTypes.map((type, ti) => {
        const parentX = 230 + ti * 140;
        return type.items.map((item, i) => {
          const yOff = 280 + i * 56;
          return (
            <SitemapNode
              key={`${type.label}-${item}`}
              x={parentX - 50}
              y={yOff}
              w={120}
              h={40}
              label={item}
              tone="accent"
              parentX={parentX}
              parentY={190}
            />
          );
        });
      })}
    </SitemapFigure>
  );
}

export function AerocruiseWireframe() {
  return (
    <Wireframe
      title="Listing wireframe"
      meta="Hi-fi · /destinations"
      annotations={[
        { x: 100, y: 80, label: "Sticky search bar — global across all content types" },
        { x: 400, y: 180, label: "Filter rail collapses to a sheet on mobile" },
        { x: 240, y: 360, label: "Cards reuse the same shape across charters, safaris, lodges, destinations" },
        { x: 640, y: 510, label: "Cross-content rail at the bottom of every listing" },
      ]}
    >
      {/* Nav */}
      <Block x="20" y="20" w="160" h="36" label="Aerocruise" />
      <Block x="280" y="20" w="340" h="36" label="Charters · Safaris · Destinations · Lodges" />
      <Block x="640" y="20" w="140" h="36" label="Enquire" tone="dark" />

      {/* Search */}
      <Block x="20" y="70" w="760" h="46" label="Search · destination · dates · type · budget" tone="accent" />

      {/* Page header */}
      <HairLine y="130" label="Page header" />
      <text x="20" y="170" fontSize="14" fontFamily="inherit" fill="#a3a3a3">
        Destinations
      </text>
      <text x="20" y="210" fontSize="30" fontFamily="inherit" fontWeight="600" fill="#0a0a0a">
        Kenya — 18 destinations
      </text>

      {/* Layout: filters + grid */}
      <Block x="20" y="240" w="170" h="320" label="Filters" />
      <text x="40" y="270" fontSize="11" fontFamily="inherit" fill="#525252">Region</text>
      <text x="40" y="290" fontSize="11" fontFamily="inherit" fill="#525252">Season</text>
      <text x="40" y="310" fontSize="11" fontFamily="inherit" fill="#525252">Type · Park / Coast</text>
      <text x="40" y="330" fontSize="11" fontFamily="inherit" fill="#525252">Length · 3-14 days</text>
      <text x="40" y="350" fontSize="11" fontFamily="inherit" fill="#525252">Budget · USD</text>

      {/* Cards */}
      {[0, 1, 2, 3].map((i) => (
        <Block
          key={i}
          x={210 + (i % 2) * 290}
          y={240 + Math.floor(i / 2) * 160}
          w={270}
          h={140}
          label={["Maasai Mara", "Amboseli", "Lamu", "Tsavo"][i]}
          tone={i === 0 ? "accent" : "neutral"}
        />
      ))}

      {/* Cross-content rail */}
      <HairLine y="580" label="You may also like" />
    </Wireframe>
  );
}
