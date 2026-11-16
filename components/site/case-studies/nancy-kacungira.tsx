/**
 * Nancy Kacungira — former BBC World News presenter, advisor and speaker.
 * Next.js rebuild that cut a five-page plan (with a library, courses and a
 * book waitlist) to four pages and two offers, every CTA leading to one
 * Resend-backed contact form.
 */
import {
  Block,
  HairLine,
  SitemapFigure,
  SitemapNode,
  Wireframe,
} from "./primitives";

export function NancyKacungiraSitemap() {
  const rootCx = 330;
  const topLevel = ["/about", "/speaking", "/contact"].map((label, i) => ({
    label,
    x: 110 + i * 160,
  }));

  return (
    <SitemapFigure
      title="Sitemap · Nancy Kacungira"
      meta="04 pages · 02 offers"
      viewBox="0 0 880 430"
      notes={[
        "Two offers, advisory and speaking, and every call to action leads to /contact. Courses and books sell through her social channels instead.",
        "The contact form lost its event date and budget fields and came down to four enquiry types, because those fields added friction at the point of enquiry.",
        "Removing the library also removed the broken toolkit downloads and empty sections that came with it.",
      ]}
    >
      <SitemapNode x={rootCx - 60} y={20} w={120} h={44} label="Home /" tone="dark" />
      {topLevel.map((n) => (
        <SitemapNode key={n.label} x={n.x} y={130} w={120} h={40} label={n.label} parentX={rootCx} parentY={64} />
      ))}
      <SitemapNode x={430} y={235} w={120} h={36} label="/api/contact" tone="accent" parentX={490} parentY={170} />
      <text x={430} y={296} fontSize="11" fontFamily="inherit" fill="#7c3aed">
        RESEND · STRAIGHT TO HER INBOX
      </text>

      <text x={110} y={235} fontSize="11" fontFamily="inherit" fill="#a3a3a3">
        HOME SPLITS BY AUDIENCE
      </text>
      <text x={110} y={257} fontSize="12" fontFamily="inherit" fill="#0a0a0a">
        For individuals · For organisations
      </text>

      {/* Removed */}
      <rect x={640} y={20} width={220} height={250} rx={10} fill="#fafafa" stroke="#d4d4d4" strokeDasharray="4 4" />
      <text x={660} y={48} fontSize="11" fontFamily="inherit" fill="#a3a3a3">
        CUT IN THE REBUILD
      </text>
      {["/library", "/library/[slug]", "Courses", "Book waitlist", "Toolkit downloads"].map((t, i) => (
        <g key={t}>
          <text x={660} y={80 + i * 34} fontSize="12" fontFamily="inherit" fill="#a3a3a3">
            {t}
          </text>
          <line x1={660} y1={76 + i * 34} x2={660 + t.length * 7} y2={76 + i * 34} stroke="#a3a3a3" />
        </g>
      ))}
    </SitemapFigure>
  );
}

export function NancyKacungiraWireframe() {
  return (
    <Wireframe
      title="Home page wireframe"
      meta="Mid-fi · /"
      annotations={[
        { x: 400, y: 182, label: "The first two buttons split visitors into individuals and organisations" },
        { x: 768, y: 270, label: "Problems a visitor might recognise come before any offer" },
        { x: 768, y: 368, label: "Only two offers, side by side, both leading to /contact" },
        { x: 768, y: 470, label: "Story and proof follow the offers rather than leading the page" },
      ]}
    >
      <Block x="20" y="20" w="150" h="34" label="Nancy Kacungira" />
      <Block x="480" y="20" w="300" h="34" label="Home · About · Speaking · Contact" />

      <HairLine y="72" label="Hero" />
      <Block x="20" y="85" w="440" h="70" label="Your next opportunity will be decided in a conversation." />
      <Block x="20" y="163" w="160" h="12" tone="accent" />
      <Block x="20" y="185" w="150" h="34" label="For individuals" tone="dark" />
      <Block x="180" y="185" w="170" h="34" label="For organisations" />
      <Block x="520" y="80" w="260" h="150" label="Cut-out portrait" />

      <Block x="20" y="240" w="760" h="22" label="Logo bar · 5" />

      <HairLine y="285" label="If any of this sounds familiar" />
      {[0, 1, 2, 3, 4].map((i) => (
        <Block key={i} x={20 + i * 152} y={295} w="142" h="40" label="Quote" />
      ))}

      <HairLine y="352" label="The work" />
      <Block x="20" y="360" w="370" h="70" label="Advisory" tone="accent" />
      <Block x="410" y="360" w="370" h="70" label="Speaking & training" tone="accent" />

      <HairLine y="452" label="My story · impact · testimonials" />
      <Block x="20" y="462" w="370" h="40" label="Scroll-driven story" />
      <Block x="410" y="462" w="370" h="40" label="15+ years · 3 continents · BBC" tone="dark" />
      <Block x="20" y="510" w="760" h="30" label="Testimonials · 4" />

      <Block x="20" y="555" w="760" h="34" label="Closing call to action · /contact" tone="dark" />
    </Wireframe>
  );
}
