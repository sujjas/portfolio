/**
 * Kabojja International — a school site routed by audience.
 * The top nav segments by Parents / Students / Staff / Prospective, each
 * leading to a tailored hub of pages.
 */
import {
  Block,
  HairLine,
  SitemapFigure,
  SitemapNode,
  Wireframe,
} from "./primitives";

const audiences = [
  { label: "Prospective", items: ["Apply", "Visit", "Fees", "Open day"] },
  { label: "Parents", items: ["Term dates", "Portal", "Updates", "Fees"] },
  { label: "Students", items: ["Timetable", "Clubs", "Resources"] },
  { label: "Staff", items: ["Vacancies", "Intranet"] },
];

export function KabojjaSitemap() {
  const rootCx = 440;
  return (
    <SitemapFigure
      title="Sitemap · kabojjainternational.com"
      meta="04 audience hubs · 13 leaf pages"
      viewBox="0 0 880 560"
      notes={[
        "Information architecture is audience-first, not topic-first. The same content (e.g. fees) lives in two hubs with different framing.",
        "About, Curriculum and News sit alongside the audience hubs — they're cross-audience and link inward from every hub.",
      ]}
    >
      <SitemapNode x={rootCx - 60} y={20} w={120} h={44} label="Home /" tone="dark" />
      {/* Audience hubs */}
      {audiences.map((a, i) => {
        const x = 60 + i * 200;
        return (
          <SitemapNode
            key={a.label}
            x={x}
            y={150}
            w={170}
            h={44}
            label={`/${a.label.toLowerCase()}`}
            tone="accent"
            parentX={rootCx}
            parentY={64}
          />
        );
      })}
      {/* Leaves */}
      {audiences.map((a, i) => {
        const parentX = 145 + i * 200;
        return a.items.map((item, j) => {
          const y = 290 + j * 48;
          return (
            <SitemapNode
              key={`${a.label}-${item}`}
              x={parentX - 60}
              y={y}
              w={120}
              h={36}
              label={item}
              parentX={parentX}
              parentY={194}
            />
          );
        });
      })}
      {/* Cross-audience routes */}
      <SitemapNode x={20} y={500} w={140} h={32} label="/about" />
      <SitemapNode x={180} y={500} w={140} h={32} label="/curriculum" />
      <SitemapNode x={340} y={500} w={140} h={32} label="/news" />
      <SitemapNode x={500} y={500} w={140} h={32} label="/contact" />
      <SitemapNode x={660} y={500} w={140} h={32} label="/calendar" />
    </SitemapFigure>
  );
}

export function KabojjaWireframe() {
  return (
    <Wireframe
      title="Audience hub wireframe"
      meta="Hi-fi · /prospective"
      annotations={[
        { x: 100, y: 60, label: "Header swaps CTA copy per audience (Apply / Portal / Email)" },
        { x: 400, y: 180, label: "Hub framing pinned to one task per audience" },
        { x: 200, y: 380, label: "Three tile rows, ordered by what that audience asks for most" },
        { x: 640, y: 530, label: "Calendar + news always present at the bottom of every hub" },
      ]}
    >
      {/* Nav */}
      <Block x="20" y="20" w="170" h="36" label="Kabojja International" />
      <Block x="290" y="20" w="320" h="36" label="Prospective · Parents · Students · Staff" />
      <Block x="640" y="20" w="140" h="36" label="Apply now" tone="dark" />

      {/* Hub intro */}
      <HairLine y="80" label="Hub framing" />
      <Block x="20" y="100" w="760" h="160" label="" />
      <text x="40" y="140" fontSize="14" fontFamily="inherit" fill="#a3a3a3">
        For prospective families
      </text>
      <text x="40" y="190" fontSize="32" fontFamily="inherit" fontWeight="600" fill="#0a0a0a">
        Find out what Kabojja looks like
      </text>
      <text x="40" y="225" fontSize="32" fontFamily="inherit" fontWeight="600" fill="#a3a3a3">
        in three steps.
      </text>

      {/* Tile rows */}
      <HairLine y="285" label="Three steps · ordered by what gets asked first" />
      <Block x="20" y="305" w="240" h="120" label="01 · Visit the school" tone="accent" />
      <Block x="280" y="305" w="240" h="120" label="02 · Apply online" />
      <Block x="540" y="305" w="240" h="120" label="03 · See fees" />

      <HairLine y="450" label="Calendar · news" />
      <Block x="20" y="470" w="370" h="100" label="Open day · 18 Jun" />
      <Block x="410" y="470" w="370" h="100" label="News · Latest update" />
    </Wireframe>
  );
}
