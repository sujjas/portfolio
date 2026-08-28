/**
 * Watsemba Miriam — Ugandan documentary photojournalist.
 * An existing site's archive (32 posts, 316 photographs) rebuilt on Next.js
 * and Sanity, with four separate strands of work — documentary posts, photo
 * stories, Mpeak Studios portraits and vlogs — held in one content model.
 */
import {
  Block,
  HairLine,
  SitemapFigure,
  SitemapNode,
  Wireframe,
} from "./primitives";

export function WatsembaMiriamSitemap() {
  const rootCx = 440;
  // Eight top-level routes on one row: nothing here is a child of anything
  // else, so the tree only branches where a detail template exists.
  const topLevel = [
    "/about",
    "/photo-stories",
    "/blog",
    "/mpeak-studios",
    "/publications",
    "/youtube",
    "/media-mentions",
    "/contact",
  ].map((label, i) => ({ label, x: 10 + i * 108 }));

  return (
    <SitemapFigure
      title="Sitemap · miriamwatsemba.com"
      meta="08 routes · 04 work strands"
      viewBox="0 0 880 500"
      notes={[
        "Four strands of work sit side by side rather than in one feed: documentary posts, photo stories, Mpeak Studios portraits and vlogs. Each has its own index, so a picture editor and a portrait client never have to wade through each other's pages.",
        "32 posts and 316 photographs were migrated from the previous site into Sanity, keeping each post's original URL on the record so nothing published before the rebuild loses its provenance.",
        "Publishing in the Studio fires a webhook at /api/revalidate, which rebuilds only the pages that changed rather than the whole site.",
      ]}
    >
      <SitemapNode x={rootCx - 60} y={20} w={120} h={44} label="Home /" tone="dark" />

      {topLevel.map((n) => (
        <SitemapNode
          key={n.label}
          x={n.x}
          y={140}
          w={100}
          h={40}
          label={n.label}
          parentX={rootCx}
          parentY={64}
        />
      ))}

      {/* Detail templates */}
      <SitemapNode
        x={166}
        y={250}
        w={130}
        h={38}
        label="/blog/[slug]"
        tone="accent"
        parentX={276}
        parentY={180}
      />
      <SitemapNode
        x={320}
        y={250}
        w={130}
        h={38}
        label="[portrait]"
        tone="accent"
        parentX={384}
        parentY={180}
      />

      <text x={166} y={330} fontSize="11" fontFamily="inherit" fill="#a3a3a3">
        POST RECORD
      </text>
      <text x={166} y={350} fontSize="11" fontFamily="inherit" fill="#737373">
        category · series · cover · body
      </text>
      <text x={166} y={368} fontSize="11" fontFamily="inherit" fill="#737373">
        comments · archived · original URL
      </text>

      {/* Editor-facing surfaces */}
      <rect
        x={600}
        y={330}
        width={255}
        height={125}
        rx={10}
        fill="#fafafa"
        stroke="#d4d4d4"
        strokeDasharray="4 4"
      />
      <text x={620} y={360} fontSize="11" fontFamily="inherit" fill="#a3a3a3">
        EDITOR SURFACES
      </text>
      <text x={620} y={387} fontSize="12" fontFamily="inherit" fill="#0a0a0a">
        /studio · Sanity, embedded
      </text>
      <text x={620} y={409} fontSize="12" fontFamily="inherit" fill="#0a0a0a">
        /api/revalidate · publish hook
      </text>
      <text x={620} y={433} fontSize="11" fontFamily="inherit" fill="#737373">
        She publishes; only the affected
      </text>
      <text x={620} y={449} fontSize="11" fontFamily="inherit" fill="#737373">
        pages rebuild.
      </text>
    </SitemapFigure>
  );
}

export function WatsembaMiriamWireframe() {
  return (
    <Wireframe
      title="Documentary post wireframe"
      meta="Mid-fi · /blog/[slug]"
      annotations={[
        { x: 768, y: 104, label: "Category and series carry across posts, so a body of work reads as one thread" },
        { x: 508, y: 81, label: "Photograph leads; the headline sits under it rather than competing with it" },
        { x: 770, y: 370, label: "Original URL is kept on the record, so migrated posts stay traceable to the old site" },
        { x: 400, y: 462, label: "Comments are per-post and can be switched off without touching the template" },
        { x: 566, y: 585, label: "Related work pulls from the same series before falling back to the category" },
      ]}
    >
      {/* Nav */}
      <Block x="20" y="20" w="200" h="36" label="Watsemba Miriam" />
      <Block x="300" y="20" w="330" h="36" label="Stories · Blog · Studios · Publications" />
      <Block x="650" y="20" w="130" h="36" label="Contact" tone="dark" />

      {/* Lead photograph */}
      <HairLine y="70" label="Lead photograph, full bleed" />
      <Block x="20" y="90" w="620" h="240" label="Photograph" />
      <Block x="660" y="90" w="120" h="240" label="" tone="accent" />
      <text x="672" y="122" fontSize="10" fontFamily="inherit" fill="#7c3aed">
        CATEGORY
      </text>
      <text x="672" y="142" fontSize="12" fontFamily="inherit" fontWeight="600" fill="#5b21b6">
        Documentary
      </text>
      <text x="672" y="172" fontSize="10" fontFamily="inherit" fill="#7c3aed">
        SERIES
      </text>
      <text x="672" y="192" fontSize="11" fontFamily="inherit" fill="#5b21b6">
        Water and land
      </text>
      <text x="672" y="222" fontSize="10" fontFamily="inherit" fill="#7c3aed">
        DATE
      </text>
      <text x="672" y="242" fontSize="11" fontFamily="inherit" fill="#5b21b6">
        March 2026
      </text>

      {/* Title + body */}
      <text x="20" y="368" fontSize="26" fontFamily="inherit" fontWeight="600" fill="#0a0a0a">
        The women rebuilding the wetland
      </text>
      <Block x="20" y="385" w="620" h="12" label="" />
      <Block x="20" y="405" w="620" h="12" label="" />
      <Block x="20" y="425" w="440" h="12" label="" />
      <Block x="660" y="360" w="120" h="52" label="Original URL" />

      {/* Comments */}
      <HairLine y="455" label="Comments · per post, switchable" />
      <Block x="20" y="475" w="380" h="70" label="Comment thread" />
      <Block x="420" y="475" w="360" h="70" label="Leave a comment" />

      {/* Related */}
      <HairLine y="560" label="More from this series" />
      <Block x="20" y="575" w="180" h="20" label="Related photograph" />
      <Block x="210" y="575" w="180" h="20" label="Related photograph" />
      <Block x="400" y="575" w="180" h="20" label="Related photograph" />
      <Block x="590" y="575" w="190" h="20" label="View the series" tone="dark" />
    </Wireframe>
  );
}
