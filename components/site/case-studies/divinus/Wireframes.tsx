type Annotation = { x: number; y: number; label: string };

function Wireframe({
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

// Reusable rect + label primitives
function Block({
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
  const fill = tone === "dark" ? "#0a0a0a" : tone === "accent" ? "#ede9fe" : "#f5f5f5";
  const stroke = tone === "accent" ? "#7c3aed" : "#d4d4d4";
  const text = tone === "dark" ? "#fff" : tone === "accent" ? "#5b21b6" : "#525252";
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

function HairLine({
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

export function DivinusHomeWireframe() {
  return (
    <Wireframe
      title="Home wireframe"
      meta="Hi-fi · 1440 col"
      annotations={[
        { x: 100, y: 60, label: "Sticky nav with mega-menu under Divisions" },
        { x: 400, y: 250, label: "Statement hero: 'Capital. Intelligence. Community.' + globe" },
        { x: 130, y: 405, label: "Seven division tiles, animated reveal on scroll" },
        { x: 700, y: 535, label: "News & insights rail (feeds /insights & /news)" },
      ]}
    >
      {/* Nav */}
      <Block x="20" y="20" w="120" h="36" label="Wordmark" />
      <Block x="280" y="20" w="240" h="36" label="Divisions ▾ · Approach · About" />
      <Block x="640" y="20" w="140" h="36" label="Contact" tone="dark" />

      {/* Hero */}
      <HairLine y="80" label="Hero" />
      <Block x="20" y="100" w="430" h="260" label="" />
      <text
        x="40"
        y="180"
        fontSize="28"
        fontFamily="inherit"
        fontWeight="600"
        fill="#0a0a0a"
      >
        Capital.
      </text>
      <text
        x="40"
        y="220"
        fontSize="28"
        fontFamily="inherit"
        fontWeight="600"
        fill="#0a0a0a"
      >
        Intelligence.
      </text>
      <text
        x="40"
        y="260"
        fontSize="28"
        fontFamily="inherit"
        fontWeight="600"
        fill="#0a0a0a"
      >
        Community.
      </text>
      <text
        x="40"
        y="300"
        fontSize="28"
        fontFamily="inherit"
        fontWeight="600"
        fill="#a3a3a3"
      >
        This is Divinus.
      </text>
      <Block x="40" y="320" w="120" h="30" label="Explore Divisions" tone="dark" />
      <circle cx="600" cy="230" r="120" fill="#ede9fe" />
      <circle cx="600" cy="230" r="120" fill="url(#globePattern)" opacity="0.6" />
      <defs>
        <pattern id="globePattern" patternUnits="userSpaceOnUse" width="6" height="6">
          <circle cx="3" cy="3" r="1" fill="#7c3aed" />
        </pattern>
      </defs>

      {/* Divisions grid */}
      <HairLine y="385" label="Divisions" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <Block
          key={i}
          x={20 + i * 110}
          y={405}
          w={100}
          h={80}
          label={["Energy", "Logistics", "Property", "Capital", "Trade", "Hosp.", "Found."][i]}
          tone={i === 3 ? "accent" : "neutral"}
        />
      ))}

      {/* News rail */}
      <HairLine y="510" label="News & insights" />
      <Block x="20" y="525" w="240" h="60" label="Insight · long-form" />
      <Block x="280" y="525" w="240" h="60" label="News · announcement" />
      <Block x="540" y="525" w="240" h="60" label="News · announcement" />
    </Wireframe>
  );
}

export function DivinusDivisionWireframe() {
  return (
    <Wireframe
      title="Division detail wireframe"
      meta="Hi-fi · 1 template × 7"
      annotations={[
        { x: 100, y: 100, label: "Persistent crumb: Divinus › Divisions › <name>" },
        { x: 400, y: 220, label: "Division hero: name, mandate, status" },
        { x: 140, y: 360, label: "Mandate, history, leadership pulled from CMS fields" },
        { x: 600, y: 460, label: "Cross-link rail to sibling divisions" },
      ]}
    >
      {/* Nav with breadcrumb */}
      <Block x="20" y="20" w="120" h="36" label="Wordmark" />
      <Block x="280" y="20" w="240" h="36" label="Divisions ▾ · Approach · About" />
      <Block x="640" y="20" w="140" h="36" label="Contact" tone="dark" />
      <Block x="20" y="70" w="400" h="22" label="Divinus › Divisions › Capital" />

      {/* Division hero */}
      <HairLine y="110" label="Division hero" />
      <Block x="20" y="130" w="500" h="180" label="" />
      <text
        x="40"
        y="180"
        fontSize="20"
        fontFamily="inherit"
        fontWeight="600"
        fill="#a3a3a3"
      >
        04 · Division
      </text>
      <text
        x="40"
        y="220"
        fontSize="32"
        fontFamily="inherit"
        fontWeight="600"
        fill="#0a0a0a"
      >
        Divinus Capital
      </text>
      <text
        x="40"
        y="250"
        fontSize="13"
        fontFamily="inherit"
        fill="#525252"
      >
        Private capital allocation for African growth-stage businesses.
      </text>
      <Block x="540" y="130" w="240" h="180" label="Hero illustration" tone="accent" />

      {/* Content blocks */}
      <HairLine y="340" label="Mandate / Approach / Leadership" />
      <Block x="20" y="360" w="240" h="100" label="Mandate" />
      <Block x="280" y="360" w="240" h="100" label="Approach" />
      <Block x="540" y="360" w="240" h="100" label="Leadership" />

      {/* Cross-links */}
      <HairLine y="485" label="Other divisions" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Block
          key={i}
          x={20 + i * 130}
          y={505}
          w={120}
          h={70}
          label={["Energy", "Logistics", "Property", "Trade", "Hosp.", "Found."][i]}
        />
      ))}
    </Wireframe>
  );
}
