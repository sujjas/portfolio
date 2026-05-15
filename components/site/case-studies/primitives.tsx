/**
 * Shared SVG primitives for case study sitemap + wireframe diagrams.
 * Every case study has its own pair of files that compose these.
 */

export type Annotation = { x: number; y: number; label: string };

export function Wireframe({
  title,
  meta,
  children,
  annotations = [],
}: {
  title: string;
  meta: string;
  children: React.ReactNode;
  annotations?: Annotation[];
}) {
  return (
    <figure className="rounded-2xl border border-neutral-200 bg-white p-5 ring-1 ring-black/5 md:p-6">
      <figcaption className="mb-4 flex items-center justify-between">
        <p className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500">
          {title}
        </p>
        <p className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500 tabular-nums">
          {meta}
        </p>
      </figcaption>
      <svg
        viewBox="0 0 800 600"
        width="100%"
        className="font-sans"
        aria-label={title}
      >
        {children}
        {annotations.map((a, i) => (
          <g key={i}>
            <circle cx={a.x} cy={a.y} r="11" fill="#0a0a0a" />
            <text
              x={a.x}
              y={a.y + 4}
              textAnchor="middle"
              fontSize="11"
              fill="#fff"
              fontFamily="inherit"
              fontWeight="600"
            >
              {String(i + 1).padStart(2, "0")}
            </text>
          </g>
        ))}
      </svg>
      {annotations.length > 0 ? (
        <ol
          role="list"
          className="mt-5 grid grid-cols-1 gap-x-6 gap-y-2 border-t border-neutral-200 pt-4 text-xs text-neutral-500 sm:grid-cols-2"
        >
          {annotations.map((a, i) => (
            <li key={i} className="flex gap-3">
              <span className="font-mono text-neutral-400 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{a.label}</span>
            </li>
          ))}
        </ol>
      ) : null}
    </figure>
  );
}

export function Block({
  x,
  y,
  w,
  h,
  label,
  tone = "neutral",
}: {
  x: number | string;
  y: number | string;
  w: number | string;
  h: number | string;
  label?: string;
  tone?: "neutral" | "accent" | "dark";
}) {
  const xn = Number(x);
  const yn = Number(y);
  const wn = Number(w);
  const hn = Number(h);
  const fill =
    tone === "dark" ? "#0a0a0a" : tone === "accent" ? "#ede9fe" : "#f5f5f5";
  const stroke = tone === "accent" ? "#7c3aed" : "#d4d4d4";
  const text =
    tone === "dark" ? "#fff" : tone === "accent" ? "#5b21b6" : "#525252";
  return (
    <g>
      <rect
        x={xn}
        y={yn}
        width={wn}
        height={hn}
        rx={6}
        fill={fill}
        stroke={stroke}
        strokeWidth="1"
      />
      {label ? (
        <text
          x={xn + wn / 2}
          y={yn + hn / 2 + 4}
          textAnchor="middle"
          fontSize="11"
          fontFamily="inherit"
          fontWeight="500"
          fill={text}
        >
          {label}
        </text>
      ) : null}
    </g>
  );
}

export function HairLine({
  y,
  label,
}: {
  y: number | string;
  label?: string;
}) {
  const yn = Number(y);
  return (
    <g>
      <line x1="20" y1={yn} x2="780" y2={yn} stroke="#e5e5e5" strokeWidth="1" />
      {label ? (
        <text
          x="20"
          y={yn - 6}
          fontSize="10"
          fontFamily="inherit"
          fill="#a3a3a3"
        >
          {label}
        </text>
      ) : null}
    </g>
  );
}

/**
 * Sitemap-specific wrapper. Wider viewBox than a wireframe to fit a tree.
 */
export function SitemapFigure({
  title,
  meta,
  children,
  viewBox = "0 0 880 520",
  notes,
}: {
  title: string;
  meta: string;
  children: React.ReactNode;
  viewBox?: string;
  notes?: string[];
}) {
  return (
    <figure className="rounded-2xl border border-neutral-200 bg-white p-6 ring-1 ring-black/5 md:p-8">
      <figcaption className="mb-6 flex items-center justify-between">
        <p className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500">
          {title}
        </p>
        <p className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500 tabular-nums">
          {meta}
        </p>
      </figcaption>
      <svg
        viewBox={viewBox}
        width="100%"
        className="font-sans text-neutral-900"
        aria-label={title}
      >
        {children}
      </svg>
      {notes && notes.length > 0 ? (
        <ul
          role="list"
          className="mt-5 grid gap-2 border-t border-neutral-200 pt-4 text-xs text-neutral-500"
        >
          {notes.map((n, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-neutral-400">·</span>
              <span>{n}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </figure>
  );
}

/**
 * Sitemap node — used inside <SitemapFigure>. Renders a labelled box and
 * (optionally) a connector line back to a parent coordinate.
 */
export function SitemapNode({
  x,
  y,
  w = 96,
  h = 40,
  label,
  tone = "neutral",
  parentX,
  parentY,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  label: string;
  tone?: "neutral" | "accent" | "dark";
  parentX?: number;
  parentY?: number;
}) {
  const fill =
    tone === "dark" ? "#0a0a0a" : tone === "accent" ? "#ede9fe" : "#fafafa";
  const stroke = tone === "accent" ? "#7c3aed" : "#d4d4d4";
  const text =
    tone === "dark" ? "#fff" : tone === "accent" ? "#5b21b6" : "#0a0a0a";
  return (
    <g>
      {parentX !== undefined && parentY !== undefined ? (
        <line
          x1={parentX}
          y1={parentY}
          x2={x + w / 2}
          y2={y}
          stroke={tone === "accent" ? "#a78bfa" : "#d4d4d4"}
          strokeWidth="1"
          strokeDasharray={tone === "accent" ? "3 3" : undefined}
        />
      ) : null}
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={8}
        fill={fill}
        stroke={stroke}
        strokeWidth="1"
      />
      <text
        x={x + w / 2}
        y={y + h / 2 + 4}
        textAnchor="middle"
        fontSize="12"
        fill={text}
        fontFamily="inherit"
        fontWeight={tone === "dark" ? 500 : 500}
      >
        {label}
      </text>
    </g>
  );
}
