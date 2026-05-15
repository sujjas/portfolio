/**
 * Sitemap for divinus.io — eight top-level routes feeding seven division
 * pages off the parent "Divisions" hub. Rendered as inline SVG so it
 * inherits Tailwind colour utilities and prints/exports cleanly.
 */
export function DivinusSitemap() {
  const divisions = [
    "Energy",
    "Logistics",
    "Property",
    "Capital",
    "Trade",
    "Hospitality",
    "Foundation",
  ];

  return (
    <figure className="rounded-2xl border border-neutral-200 bg-white p-6 ring-1 ring-black/5 md:p-8">
      <figcaption className="mb-6 flex items-center justify-between">
        <p className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500">
          Sitemap · divinus.io
        </p>
        <p className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500 tabular-nums">
          08 routes · 07 divisions
        </p>
      </figcaption>

      <svg
        viewBox="0 0 880 520"
        width="100%"
        className="font-sans text-neutral-900"
        aria-label="Divinus information architecture, eight top-level routes with seven division pages"
      >
        {/* root */}
        <g>
          <rect
            x="380"
            y="20"
            width="120"
            height="44"
            rx="10"
            fill="#0a0a0a"
          />
          <text
            x="440"
            y="47"
            textAnchor="middle"
            fill="#fff"
            fontSize="13"
            fontFamily="inherit"
            fontWeight="500"
          >
            Home /
          </text>
        </g>

        {/* level 1 — children */}
        {[
          { x: 50, label: "About" },
          { x: 200, label: "Approach" },
          { x: 350, label: "Divisions" },
          { x: 500, label: "Insights" },
          { x: 650, label: "News" },
          { x: 800, label: "Contact" },
        ].map((node) => (
          <g key={node.label}>
            <line
              x1="440"
              y1="64"
              x2={node.x + 40}
              y2="150"
              stroke="#d4d4d4"
              strokeWidth="1"
            />
            <rect
              x={node.x}
              y="150"
              width="80"
              height="40"
              rx="8"
              fill="#fafafa"
              stroke="#d4d4d4"
            />
            <text
              x={node.x + 40}
              y="174"
              textAnchor="middle"
              fontSize="12"
              fill="#0a0a0a"
              fontFamily="inherit"
              fontWeight="500"
            >
              /{node.label.toLowerCase()}
            </text>
          </g>
        ))}

        {/* divisions detail under "Divisions" node */}
        {divisions.map((d, i) => {
          const xs = 90 + i * 110;
          return (
            <g key={d}>
              <line
                x1="390"
                y1="190"
                x2={xs + 45}
                y2="280"
                stroke="#a78bfa"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <rect
                x={xs}
                y="280"
                width="90"
                height="44"
                rx="8"
                fill="#ede9fe"
                stroke="#7c3aed"
                strokeWidth="1"
              />
              <text
                x={xs + 45}
                y="299"
                textAnchor="middle"
                fontSize="11"
                fill="#5b21b6"
                fontFamily="inherit"
                fontWeight="500"
              >
                /divisions
              </text>
              <text
                x={xs + 45}
                y="314"
                textAnchor="middle"
                fontSize="11"
                fill="#5b21b6"
                fontFamily="inherit"
                fontWeight="600"
              >
                /{d.toLowerCase()}
              </text>
            </g>
          );
        })}

        {/* legend */}
        <g transform="translate(0, 400)">
          <rect width="880" height="1" fill="#e5e5e5" />
          <g transform="translate(0, 30)">
            <rect width="14" height="14" rx="3" fill="#0a0a0a" />
            <text
              x="22"
              y="11"
              fontSize="11"
              fill="#525252"
              fontFamily="inherit"
            >
              Root
            </text>
            <rect
              x="90"
              width="14"
              height="14"
              rx="3"
              fill="#fafafa"
              stroke="#d4d4d4"
            />
            <text
              x="112"
              y="11"
              fontSize="11"
              fill="#525252"
              fontFamily="inherit"
            >
              Top-level page
            </text>
            <rect
              x="240"
              width="14"
              height="14"
              rx="3"
              fill="#ede9fe"
              stroke="#7c3aed"
              strokeWidth="1"
            />
            <text
              x="262"
              y="11"
              fontSize="11"
              fill="#525252"
              fontFamily="inherit"
            >
              Division page (CMS-driven, 1 template × 7)
            </text>
          </g>
          <g
            transform="translate(0, 70)"
            fontFamily="inherit"
            fontSize="11"
            fill="#525252"
          >
            <text x="0" y="0">
              Notes
            </text>
            <text x="0" y="20" fill="#737373">
              · One template handles all seven division pages, fed by a CMS
              collection with shared fields (hero, mandate, leadership, news,
              CTAs).
            </text>
            <text x="0" y="38" fill="#737373">
              · /insights and /news share a content model; /insights pins
              long-form, /news shows announcements.
            </text>
          </g>
        </g>
      </svg>
    </figure>
  );
}
