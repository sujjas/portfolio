import type { CSSProperties } from "react";

type Pos = "tl" | "tr" | "bl" | "br";

// SVG is 17×17 with strokes centered at (8.5, 8.5). Pixel-perfect alignment:
//
// - Rails are 1px hairlines flush with section's left:0 / right:0 — their
//   visual centre sits 0.5px inside the section (the rail occupies x=0..1).
//   With SVG centre at SVG-x 8.5 and section x 0.5, SVG-left = -8.
//
// - Section dividers are 1px `border-b` sitting OUTSIDE the padding box
//   (modern CSS `box-sizing: border-box`). Border occupies y from
//   padding_bottom to padding_bottom+1, centre at padding_bottom + 0.5.
//   With absolute positioning relative to padding box, `bottom: -9` places
//   the SVG centre exactly on that line. Symmetric `top: -9` for the line
//   above the section (the previous section's border-b).
const offsets: Record<Pos, CSSProperties> = {
  tl: { top: -9, left: -8 },
  tr: { top: -9, right: -8 },
  bl: { bottom: -9, left: -8 },
  br: { bottom: -9, right: -8 },
};

export function Crosshair({
  position,
  color = "dark",
}: {
  position: Pos;
  color?: "dark" | "light";
}) {
  const stroke = color === "dark" ? "stroke-neutral-500" : "stroke-white/70";
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 17 17"
      width="17"
      height="17"
      shapeRendering="crispEdges"
      style={offsets[position]}
      // Hidden below `md` (768px) because the -8px offset places the
      // crosshair beyond the viewport edge on narrow screens, so it
      // reads as a cut-off line rather than a deliberate marker.
      className={`pointer-events-none absolute z-30 hidden md:block ${stroke}`}
      fill="none"
    >
      <line x1="8.5" y1="0" x2="8.5" y2="17" strokeWidth="1" />
      <line x1="0" y1="8.5" x2="17" y2="8.5" strokeWidth="1" />
    </svg>
  );
}

export function SectionCrosshairs({
  color = "dark",
}: {
  color?: "dark" | "light";
}) {
  return (
    <>
      <Crosshair position="tl" color={color} />
      <Crosshair position="tr" color={color} />
      <Crosshair position="bl" color={color} />
      <Crosshair position="br" color={color} />
    </>
  );
}

export function CrosshairFrame({
  children,
  color = "dark",
  className = "",
}: {
  children: React.ReactNode;
  color?: "dark" | "light";
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <SectionCrosshairs color={color} />
      {children}
    </div>
  );
}
