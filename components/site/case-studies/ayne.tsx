/**
 * Ayne — Ugandan fashion e-commerce. Standard shop architecture:
 * collections → products → cart → checkout, plus brand + journal pages
 * that loop back into the shop.
 */
import {
  Block,
  HairLine,
  SitemapFigure,
  SitemapNode,
  Wireframe,
} from "./primitives";

const collections = ["New in", "Womenswear", "Menswear", "Accessories"];

export function AyneSitemap() {
  const rootCx = 440;
  return (
    <SitemapFigure
      title="Sitemap · ayne.ug"
      meta="06 routes · 04 collections · cart flow"
      notes={[
        "Every collection page reuses one template fed by a CMS collection (title, hero, products, lookbook).",
        "Cart and Checkout are flow states, not menu items — accessed from the persistent header icon, never the primary nav.",
      ]}
    >
      <SitemapNode x={rootCx - 60} y={20} w={120} h={44} label="Home /" tone="dark" />
      {[
        { x: 60, label: "/shop" },
        { x: 220, label: "/journal" },
        { x: 380, label: "/about" },
        { x: 540, label: "/contact" },
        { x: 700, label: "/cart", tone: "accent" as const },
      ].map((n) => (
        <SitemapNode
          key={n.label}
          x={n.x}
          y={150}
          w={120}
          h={44}
          label={n.label}
          tone={n.tone}
          parentX={rootCx}
          parentY={64}
        />
      ))}
      {/* Collections */}
      {collections.map((c, i) => {
        const xs = 60 + i * 200;
        return (
          <SitemapNode
            key={c}
            x={xs}
            y={290}
            w={170}
            h={44}
            label={c}
            parentX={120}
            parentY={194}
          />
        );
      })}
      {/* Product example */}
      <SitemapNode x={150} y={400} w={200} h={36} label="/shop/<product>" tone="accent" parentX={145} parentY={334} />
      {/* Checkout flow */}
      <SitemapNode x={500} y={290} w={120} h={36} label="01 · Cart" tone="accent" parentX={760} parentY={194} />
      <SitemapNode x={500} y={340} w={120} h={36} label="02 · Details" tone="accent" parentX={760} parentY={194} />
      <SitemapNode x={500} y={390} w={120} h={36} label="03 · Pay" tone="accent" parentX={760} parentY={194} />
      <SitemapNode x={500} y={440} w={120} h={36} label="04 · Thanks" tone="accent" parentX={760} parentY={194} />
    </SitemapFigure>
  );
}

export function AyneWireframe() {
  return (
    <Wireframe
      title="Collection wireframe"
      meta="Hi-fi · /shop/[collection]"
      annotations={[
        { x: 100, y: 80, label: "Header keeps cart count + search reachable on every page" },
        { x: 400, y: 200, label: "Collection hero leans on one editorial image, no copy clutter" },
        { x: 200, y: 380, label: "Grid is two-up on mobile, four-up on desktop — same template" },
        { x: 640, y: 540, label: "Pinned add-to-cart on product cards keeps tap distance short" },
      ]}
    >
      {/* Nav */}
      <Block x="20" y="20" w="100" h="36" label="Ayne" />
      <Block x="220" y="20" w="260" h="36" label="Shop · Journal · About" />
      <Block x="540" y="20" w="100" h="36" label="Search" />
      <Block x="660" y="20" w="120" h="36" label="Cart (02)" tone="dark" />

      <Block x="20" y="70" w="380" h="22" label="Home › Shop › Womenswear" />

      {/* Collection hero */}
      <HairLine y="110" label="Collection hero" />
      <Block x="20" y="130" w="760" h="200" label="Editorial hero image" tone="accent" />

      {/* Filters strip */}
      <HairLine y="355" label="Filters" />
      <Block x="20" y="375" w="120" h="36" label="Size" />
      <Block x="150" y="375" w="120" h="36" label="Colour" />
      <Block x="280" y="375" w="120" h="36" label="Price" />
      <Block x="640" y="375" w="140" h="36" label="Sort · New" />

      {/* Product grid */}
      <HairLine y="430" label="Product grid · 4 up" />
      {[0, 1, 2, 3].map((i) => (
        <Block
          key={i}
          x={20 + i * 195}
          y={450}
          w={180}
          h={140}
          label={["Product · A", "Product · B", "Product · C", "Product · D"][i]}
          tone={i === 0 ? "accent" : "neutral"}
        />
      ))}
    </Wireframe>
  );
}
