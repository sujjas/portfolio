"use client";

/**
 * Enterprise Uganda — the details under the scroll reel.
 *
 *   Tile         Span   Kind       The one thing                           Moves
 *   Impact map   2 × 1  Hero UI    the region map and its story list       the cursor clicks Northern; the list swaps
 *   Trained      1 × 1  Stat       200,000+ entrepreneurs, on the yellow   counts up
 *   Anniversary  1 × 1  Component  "Since 2001 and still counting…"        the celebrate button presses, confetti falls
 *   Stairs       1 × 1  Diagram    Starting, Growing, Scaling              the steps rise in turn
 *   BDS          1 × 1  Statement  "BDS Center of Excellence."             lights up letter by letter, as the site does on scroll
 *
 * Strings, colours and stories are the live site's (enterprise.co.ug and the
 * theme's stories data). Region shapes are its own impact-map SVG.
 */
import { Stage, Swap, useReducedMotion } from "@/components/stageshow/kit";
import type { Act } from "@/components/stageshow/kit";
import { LEAD, PictureTile, StatTile, Tile, useInView, usePictureWidth } from "./shared";
import { UGANDA_REGIONS, UGANDA_VIEWBOX } from "./uganda-regions";
import "./enterprise-uganda.css";

/* ---------------- Impact map (hero) ---------------- */

type Region = keyof typeof UGANDA_REGIONS;
type MapState = { region: Region };

const STORIES: Partial<Record<Region, { title: string; people: [string, string][] }>> = {
  central: {
    title: "Central Uganda",
    people: [
      ["Barbara Ofwono Buyondo", "Victorious Education Services"],
      ["Jane Baine", "Sleek and Slender Wellness Centre"],
      ["Alex Niyonzima", "Dunwell Dry Cleaners"],
    ],
  },
  northern: {
    title: "Northern Uganda",
    people: [
      ["Thomas Oloya", "Oasis Island"],
      ["Richard Okema", "Pupwonya Growers Cooperative"],
      ["Christine Auma", "Evato Foods"],
    ],
  },
};

const mapScript = async (a: Act<MapState>) => {
  await a.wait(LEAD + 300);
  await a.move({ at: "region-northern", x: 0.45, y: 0.55 });
  await a.click({ at: "region-northern", x: 0.45, y: 0.55 });
  await a.set({ region: "northern" });
};

function ImpactMap() {
  const [picture, width] = usePictureWidth(640);
  const compact = width < 560;
  const height = compact ? 330 : 300;
  return (
    <Tile
      area="hero"
      title={<b>Impact across Uganda.</b>}
      picture={
        <div ref={picture} className="ud-picture">
          <Stage<MapState>
            width={width}
            height={height}
            initial={{ region: "central" }}
            poster={{ region: "northern" }}
            play="once"
            script={mapScript}
            cursor={{ at: { x: Math.min(width - 60, compact ? 300 : 360), y: height - 40 } }}
            className="ud-stage"
          >
            {(s) => {
              const story = STORIES[s.region]!;
              return (
                <div className="eu-map" data-compact={compact || undefined}>
                  <svg className="eu-map-svg" viewBox={UGANDA_VIEWBOX} aria-hidden>
                    {(Object.keys(UGANDA_REGIONS) as Region[]).map((r) => (
                      <path
                        key={r}
                        d={UGANDA_REGIONS[r]}
                        data-target={`region-${r}`}
                        data-cursor="pointer"
                        data-active={s.region === r || undefined}
                      />
                    ))}
                  </svg>
                  <div className="eu-stories ud-card">
                    <Swap id={s.region} className="eu-stories-swap">
                      <div className="eu-stories-inner">
                        <span className="eu-stories-title">{story.title}</span>
                        {story.people.map(([name, business], i) => (
                          <span key={name} className="eu-story" data-open={i === 0 || undefined}>
                            <span className="eu-story-n">{String(i + 1).padStart(2, "0")}</span>
                            <span className="eu-story-text">
                              <span className="eu-story-name">{name}</span>
                              <span className="eu-story-biz">{business}</span>
                            </span>
                          </span>
                        ))}
                      </div>
                    </Swap>
                  </div>
                </div>
              );
            }}
          </Stage>
        </div>
      }
    >
      Click a region to see the entrepreneurs the programmes work with there.
    </Tile>
  );
}

/* ---------------- Anniversary (component) ---------------- */

const CONFETTI = ["#F5C500", "#1B2670", "#FF4B4B", "#FFFFFF", "#4CAF50", "#FF9800"];
// A fixed scatter, so every load falls the same way
const PIECES = Array.from({ length: 34 }, (_, i) => {
  const r = (n: number) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1;
  return {
    x: Math.round((r(1) - 0.5) * 260),
    y: Math.round(90 + r(2) * 120),
    rot: Math.round((r(3) - 0.5) * 540),
    delay: Math.round(r(4) * 180),
    size: 5 + Math.round(r(5) * 4),
    round: r(6) > 0.5,
    color: CONFETTI[i % CONFETTI.length],
  };
});

function Anniversary() {
  return (
    <PictureTile area="anniv" index={2} height={210} title="Twenty-five years, counted." copy="The hero counts the years, months and days since 2001, and one button celebrates.">
      {(s) => (
        <div className="eu-anniv">
          <span className="eu-anniv-since">Since 2001 and still counting…</span>
          <span className="eu-anniv-count">
            {[
              ["25", "Years"],
              ["10", "Months"],
              ["17", "Days"],
            ].map(([n, l]) => (
              <span key={l} className="eu-anniv-col">
                <span className="eu-anniv-n">{n}</span>
                <span className="eu-anniv-l">{l}</span>
              </span>
            ))}
          </span>
          <span className="eu-anniv-btn" data-on={s.on || undefined}>
            Click here to celebrate
            <span className="eu-confetti" aria-hidden>
              {PIECES.map((p, i) => (
                <span
                  key={i}
                  style={
                    {
                      "--x": `${p.x}px`,
                      "--y": `${p.y}px`,
                      "--rot": `${p.rot}deg`,
                      "--d": `${p.delay}ms`,
                      "--s": `${p.size}px`,
                      background: p.color,
                      borderRadius: p.round ? "50%" : "1px",
                    } as React.CSSProperties
                  }
                />
              ))}
            </span>
          </span>
        </div>
      )}
    </PictureTile>
  );
}

/* ---------------- Stairs (diagram) ---------------- */

const STEPS = [
  ["Starting", "01"],
  ["Growing", "02"],
  ["Scaling", "03"],
];

function Stairs() {
  return (
    <PictureTile area="stairs" index={3} height={200} title="Where are you in your business journey?" copy="Programmes sorted by stage, not by name.">
      {(s) => (
        <div className="eu-stairs" data-on={s.on || undefined}>
          {STEPS.map(([label, n], i) => (
            <span key={label} className="eu-step" style={{ "--i": i } as React.CSSProperties}>
              <span className="eu-step-label">{label}</span>
              <span className="eu-step-n">{n}</span>
            </span>
          ))}
        </div>
      )}
    </PictureTile>
  );
}

/* ---------------- BDS (statement, letters light up) ---------------- */

const BDS = "BDS Center of Excellence.";

function Bds() {
  const reduced = useReducedMotion();
  const [ref, seen] = useInView<HTMLDivElement>(LEAD + 4 * 110);
  const lit = seen || reduced;
  return (
    <Tile area="bds" tone="dark">
      <div ref={ref} className="ud-statement eu-bds">
        <span className="ud-statement-big eu-bds-big" aria-label={BDS}>
          {BDS.split("").map((ch, i) => (
            <span key={i} aria-hidden data-lit={lit || undefined} style={{ transitionDelay: `${i * 28}ms` }}>
              {ch}
            </span>
          ))}
        </span>
        <span className="ud-statement-small">
          On the site the full sentence lights up letter by letter as you scroll, beside a ring of the centre&apos;s three services.
        </span>
      </div>
    </Tile>
  );
}

export function EnterpriseUgandaDetails() {
  return (
    <div className="ud-bento eu-details">
      <div className="ud-grid eu-grid">
        <ImpactMap />
        <StatTile area="stat" index={1} lead="Entrepreneurs trained" value={200000} unit="+" label="across all four regions of Uganda." />
        <Anniversary />
        <Stairs />
        <Bds />
      </div>
    </div>
  );
}
