/**
 * AMANI — Accelerating Health Innovations, a non-profit health research
 * institute in Mbale, Uganda. Static Next.js build organised around
 * projects, publications and team, with two in-house risk calculators
 * (NEORESUS, NEURODEV) rebuilt as client-side tools.
 */
import {
  Block,
  HairLine,
  SitemapFigure,
  SitemapNode,
  Wireframe,
} from "./primitives";

export function AmaniSitemap() {
  const rootCx = 440;
  const topLevel = [
    "/about",
    "/services",
    "/projects",
    "/team",
    "/publications",
    "/tools",
    "/contact",
  ].map((label, i) => ({ label, x: 22 + i * 122 }));

  return (
    <SitemapFigure
      title="Sitemap · amanihealth.org"
      meta="10 pages · 02 research tools"
      viewBox="0 0 880 460"
      notes={[
        "Content follows what a visitor comes for: six active projects, six publications each linked by DOI, six services, and fifteen people split into leadership and operations.",
        "NEORESUS (previously a separate PHP app) and NEURODEV run entirely in the browser under /tools, so a clinician never leaves the site to use them.",
        "Fully static. The contact form opens the institute's own mail address rather than routing through a third-party form service.",
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

      {/* Tools */}
      <SitemapNode x={570} y={250} w={110} h={38} label="/neoresus" tone="accent" parentX={687} parentY={180} />
      <SitemapNode x={694} y={250} w={110} h={38} label="/neurodev" tone="accent" parentX={687} parentY={180} />

      {/* Collections */}
      <text x={22} y={250} fontSize="11" fontFamily="inherit" fill="#a3a3a3">
        COLLECTIONS
      </text>
      <text x={22} y={272} fontSize="12" fontFamily="inherit" fill="#0a0a0a">
        6 projects · 6 publications (DOI)
      </text>
      <text x={22} y={292} fontSize="12" fontFamily="inherit" fill="#0a0a0a">
        6 services · 15 people
      </text>
      <text x={22} y={312} fontSize="11" fontFamily="inherit" fill="#737373">
        9 leadership · 6 operations
      </text>

      <rect x={22} y={350} width={836} height={70} rx={10} fill="#fafafa" stroke="#d4d4d4" strokeDasharray="4 4" />
      <text x={42} y={378} fontSize="11" fontFamily="inherit" fill="#a3a3a3">
        HOME PAGE RUN
      </text>
      <text x={42} y={400} fontSize="12" fontFamily="inherit" fill="#0a0a0a">
        Hero · Partners · About · In numbers · What we do · Projects · Gallery · Team · Publications · CTA
      </text>
    </SitemapFigure>
  );
}

export function AmaniWireframe() {
  return (
    <Wireframe
      title="Team page wireframe"
      meta="Mid-fi · /team"
      annotations={[
        { x: 768, y: 104, label: "Every page header uses a different photograph from the institute's own set" },
        { x: 268, y: 214, label: "Leadership leads in a three-column grid, photograph first" },
        { x: 768, y: 330, label: "No portrait or job title was invented; missing details stayed off until supplied" },
        { x: 268, y: 470, label: "Operations and research support sit in a quieter list on a grey band" },
      ]}
    >
      <Block x="20" y="20" w="150" h="36" label="AMANI" />
      <Block x="330" y="20" w="320" h="36" label="About · What we do · Projects · Team" />
      <Block x="670" y="20" w="110" h="36" label="Partner" tone="dark" />

      <Block x="20" y="70" w="760" h="110" label="Photo header · Our team" />

      <HairLine y="200" label="Leadership · 9" />
      {[0, 1, 2].map((col) =>
        [0, 1].map((row) => (
          <g key={`${col}-${row}`}>
            <Block x={20 + col * 255} y={215 + row * 120} w="240" h="70" label="Portrait" />
            <Block x={20 + col * 255} y={290 + row * 120} w="160" h="12" />
            <Block x={20 + col * 255} y={306 + row * 120} w="110" h="10" tone="accent" />
          </g>
        )),
      )}

      <rect x="0" y="455" width="800" height="145" fill="#fafafa" />
      <HairLine y="470" label="Operations & research support · 6" />
      {[0, 1].map((col) =>
        [0, 1, 2].map((row) => (
          <Block key={`o-${col}-${row}`} x={20 + col * 385} y={485 + row * 34} w="370" h="26" label="Name · role" />
        )),
      )}
    </Wireframe>
  );
}
