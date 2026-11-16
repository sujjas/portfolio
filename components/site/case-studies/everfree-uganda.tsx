/**
 * EverFree Uganda — survivor-centred anti-trafficking organisation.
 * One-page Astro site built inside the client's brand book: five chapters
 * in the brief's order, old page URLs redirecting to their chapter, and a
 * donate path into EverFree's existing Classy checkout.
 */
import {
  Block,
  HairLine,
  SitemapFigure,
  SitemapNode,
  Wireframe,
} from "./primitives";

export function EverfreeSitemap() {
  const chapters = ["#about", "#solutions", "#stories", "#donate", "#connect"].map(
    (label, i) => ({ label, x: 60 + i * 156 }),
  );
  const redirects = ["/about", "/solutions", "/stories", "/donate", "/connect"];

  return (
    <SitemapFigure
      title="Sitemap · EverFree Uganda"
      meta="01 page · 05 chapters"
      viewBox="0 0 880 470"
      notes={[
        "The brief's five sections became five chapters of one page, so the story reads straight through and Donate is never more than a scroll away.",
        "The old page addresses still resolve: each redirects to its chapter anchor rather than a 404.",
        "Donations pre-fill EverFree's existing Classy checkout (once or monthly, four suggested amounts) instead of adding a second payment system.",
      ]}
    >
      <SitemapNode x={380} y={20} w={120} h={44} label="Home /" tone="dark" />

      {chapters.map((n) => (
        <SitemapNode key={n.label} x={n.x} y={130} w={130} h={40} label={n.label} parentX={440} parentY={64} />
      ))}

      {redirects.map((label, i) => (
        <SitemapNode
          key={label}
          x={60 + i * 156}
          y={230}
          w={130}
          h={36}
          label={label}
          tone="accent"
          parentX={125 + i * 156}
          parentY={170}
        />
      ))}
      <text x={60} y={292} fontSize="11" fontFamily="inherit" fill="#7c3aed">
        OLD URLS · REDIRECT TO THEIR CHAPTER
      </text>

      <rect x={60} y={320} width={754} height={100} rx={10} fill="#fafafa" stroke="#d4d4d4" strokeDasharray="4 4" />
      <text x={80} y={348} fontSize="11" fontFamily="inherit" fill="#a3a3a3">
        ON EVERY SCREEN
      </text>
      <text x={80} y={372} fontSize="12" fontFamily="inherit" fill="#0a0a0a">
        Floating donate card · Connect footer
      </text>
      <text x={80} y={394} fontSize="11" fontFamily="inherit" fill="#737373">
        Coral is reserved for Donate (5.7:1 contrast), so it reads as the one action.
      </text>
    </SitemapFigure>
  );
}

export function EverfreeWireframe() {
  return (
    <Wireframe
      title="Solutions chapter wireframe"
      meta="Mid-fi · /#solutions"
      annotations={[
        { x: 508, y: 92, label: "Script accents are traced into pen strokes at build time, so they write themselves in" },
        { x: 768, y: 168, label: "Jump links let a funder skip straight to the evidence" },
        { x: 420, y: 330, label: "Freedom Lifemap shown as a six-dimension wheel, not a list" },
        { x: 768, y: 445, label: "Single-hue green ramp after the brand colours failed a red-green check" },
        { x: 768, y: 520, label: "Every chart has a 'View as table' twin" },
      ]}
    >
      <Block x="20" y="20" w="140" h="34" label="everfree" />
      <Block x="400" y="20" w="260" h="34" label="About · Solutions · Stories · Connect" />
      <Block x="680" y="20" w="100" h="34" label="Donate" tone="dark" />

      <HairLine y="72" label="Chapter hero" />
      <Block x="20" y="80" w="460" h="44" label="Chapter headline + script accent" />
      <Block x="20" y="132" w="460" h="12" />
      <Block x="500" y="80" w="280" h="80" label="Photograph" />
      <Block x="500" y="168" w="250" h="22" label="Care · Lifemap · Network · Impact" tone="accent" />

      <HairLine y="215" label="Survivor care" />
      <Block x="20" y="225" w="240" h="60" label="Safe homes" />
      <Block x="270" y="225" w="240" h="60" label="Career & education" />
      <Block x="520" y="225" w="260" h="60" label="Aftercare" />

      <HairLine y="305" label="Freedom Lifemap" />
      <circle cx="340" cy="365" r="48" fill="#f5f5f5" stroke="#d4d4d4" />
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return (
          <line key={i} x1="340" y1="365" x2={340 + Math.cos(a) * 48} y2={365 + Math.sin(a) * 48} stroke="#d4d4d4" />
        );
      })}
      <Block x="410" y="325" w="370" h="80" label="Six dimensions, explained in turn" />

      <HairLine y="425" label="Impact data" />
      <rect x="20" y="440" width="374" height="26" rx="4" fill="#d9f99d" stroke="#d4d4d4" />
      <rect x="394" y="440" width="272" height="26" rx="0" fill="#bef264" stroke="#d4d4d4" />
      <rect x="666" y="440" width="34" height="26" rx="0" fill="#84cc16" stroke="#d4d4d4" />
      <text x="30" y="458" fontSize="11" fontFamily="inherit" fill="#3f6212">55%</text>
      <text x="404" y="458" fontSize="11" fontFamily="inherit" fill="#3f6212">40%</text>
      <Block x="20" y="480" w="140" h="60" label="1,175+ survivors" />
      <Block x="170" y="480" w="140" h="60" label="400 Lifemaps" />
      <Block x="320" y="480" w="140" h="60" label="2023 figure" />
      <Block x="470" y="480" w="140" h="60" label="2023 figure" />
      <Block x="620" y="505" w="160" h="30" label="View as table" />

      <HairLine y="560" label="Reports" />
      <Block x="20" y="568" w="380" h="22" label="Report" />
      <Block x="410" y="568" w="370" h="22" label="Report" />
    </Wireframe>
  );
}
