"use client";

/**
 * Divinus Investment Group — the details under the scroll reel.
 *
 *   Tile        Span   Kind       The one thing                                Moves
 *   Divisions   2 × 1  Hero UI    the division rows and their following card   the cursor drops to Advisory; the card follows and changes
 *   Seven       1 × 1  Stat       seven divisions, on the gold                 counts up
 *   Menu        1 × 1  Component  the staggered menu                           Menu rolls to Close, the panel slides in, items rise
 *   Begin       1 × 1  Diagram    "Find your place in the group."              three intents draw to where they land
 *   Globe       1 × 1  Statement  "Global focus, African conviction."          still
 *
 * Strings, statuses and timings are from the site's code (Divinus/divinus-next).
 */
import { Bar, Connector, Stage, Swap, Text } from "@/components/stageshow/kit";
import type { Act } from "@/components/stageshow/kit";
import { LEAD, PictureTile, StatTile, StatementTile, Tile, left, right, usePictureWidth } from "./shared";
import "./divinus.css";

/* ---------------- Divisions (hero) ---------------- */

const DIVISIONS = [
  { n: "01", tag: "Intelligence", name: "Divinus AI · Vision Africa", status: "Active", line: "Building and deploying African AI capability." },
  { n: "02", tag: "Strategy", name: "Divinus Advisory", status: "Active", line: "Where Strategy Meets Substance." },
  { n: "03", tag: "Community", name: "Divinus Exchange", status: "In Development", line: "The community platform of the group." },
  { n: "04", tag: "Products", name: "Divinus Labs", status: "Launching Q4 2026", line: "Built to be owned, not rented." },
];

type RowState = { hover: number };

const rowsScript = async (a: Act<RowState>) => {
  await a.wait(LEAD + 250);
  await a.move({ at: "row-1", x: 0.3, y: 0.5 });
  await a.set({ hover: 1 });
};

function Divisions() {
  const [picture, width] = usePictureWidth(640);
  const compact = width < 560;
  const height = compact ? 330 : 300;
  return (
    <Tile
      area="hero"
      title={<b>Seven divisions, one list.</b>}
      picture={
        <div ref={picture} className="ud-picture">
          <Stage<RowState>
            width={width}
            height={height}
            initial={{ hover: 0 }}
            poster={{ hover: 1 }}
            play="once"
            script={rowsScript}
            cursor={{ at: { x: compact ? 120 : 160, y: 52 } }}
            className="ud-stage"
          >
            {(s, rect) => {
              const d = DIVISIONS[s.hover];
              const row = rect(`row-${s.hover}`);
              const y = row ? row.y - 70 : 0;
              return (
                <div className="dv-rows" data-compact={compact || undefined}>
                  {DIVISIONS.map((v, i) => (
                    <div key={v.n} className="dv-row" data-target={`row-${i}`} data-on={s.hover === i || undefined}>
                      <span className="dv-row-n">
                        {v.n} / {v.tag}
                      </span>
                      <span className="dv-row-name">{v.name}</span>
                      <span className="dv-row-more" aria-hidden>
                        →
                      </span>
                    </div>
                  ))}
                  {!compact ? (
                    <div className="dv-preview" style={{ transform: `translate3d(0, ${y}px, 0) rotate(${s.hover ? 2.5 : -2}deg)` }}>
                      <Swap id={s.hover} className="dv-preview-swap">
                        <span className="dv-preview-inner">
                          <span className="dv-preview-tag">
                            {d.n} / {d.tag}
                          </span>
                          <span className="dv-preview-name">{d.name}</span>
                          <span className="dv-preview-line">{d.line}</span>
                          <span className="dv-row-status" data-active={d.status === "Active" || undefined}>
                            {d.status}
                          </span>
                          <span className="dv-preview-foot">Divinus · Division</span>
                        </span>
                      </Swap>
                    </div>
                  ) : null}
                </div>
              );
            }}
          </Stage>
        </div>
      }
    >
      Hover a division and a card follows the pointer, tilting with its speed.
    </Tile>
  );
}

/* ---------------- Menu (component) ---------------- */

const ITEMS = ["Home", "About", "Divisions", "Communities", "Events"];

function Menu() {
  return (
    <PictureTile area="menu" index={2} height={214} title="A menu that staggers in." copy="Two layers slide across, then each item rises.">
      {(s) => (
        <div className="dv-menu" data-on={s.on || undefined}>
          <div className="dv-menu-bar">
            <span className="dv-menu-logo">Divinus Investment Group</span>
            <span className="dv-menu-toggle">
              <Swap id={s.on ? 1 : 0}>{s.on ? "Close" : "Menu"}</Swap>
              <span className="dv-plus" aria-hidden>
                +
              </span>
            </span>
          </div>
          <span className="dv-menu-page" aria-hidden>
            <Bar w={120} h={14} r={4} tone={2} />
            <Bar w={96} h={14} r={4} tone={2} />
            <Bar w={70} h={6} tone={1} />
            <Bar w={84} h={6} tone={1} />
          </span>
          <span className="dv-menu-pre" aria-hidden />
          <div className="dv-menu-panel">
            {ITEMS.map((it, i) => (
              <span key={it} className="dv-menu-item" data-current={it === "Divisions" || undefined} style={{ "--i": i } as React.CSSProperties}>
                <span className="dv-menu-num">{String(i + 1).padStart(2, "0")}</span>
                {it}
              </span>
            ))}
          </div>
        </div>
      )}
    </PictureTile>
  );
}

/* ---------------- Begin (diagram) ---------------- */

const BEGIN = [
  ["Build or scale a business", "Advisory"],
  ["Join a community", "Communities"],
  ["Partner with us", "Partners"],
];

function Begin() {
  return (
    <PictureTile area="begin" index={3} height={190} title="Find your place in the group." copy="Start from what you want, not from the org chart.">
      {(s, rect) => (
        <>
          <div className="dv-begin">
            {BEGIN.map(([want, to]) => (
              <span key={want} className="dv-begin-row">
                <span className="ud-chip" data-target={`w-${to}`}>
                  <Text>{want}</Text>
                </span>
                <span className="ud-chip dv-dest" data-target={`d-${to}`} data-on={s.on || undefined}>
                  <Text>{to}</Text>
                </span>
              </span>
            ))}
          </div>
          {BEGIN.map(([, to], i) => {
            const a = rect(`w-${to}`);
            const b = rect(`d-${to}`);
            return a && b ? <Connector key={to} from={right(a)} to={left(b)} show={s.on} className={`ud-line ud-line--${i}`} /> : null;
          })}
        </>
      )}
    </PictureTile>
  );
}

export function DivinusDetails() {
  return (
    <div className="ud-bento dv-details">
      <div className="ud-grid dv-grid">
        <Divisions />
        <StatTile area="stat" index={1} lead="One group," value={7} unit="divisions" label="from AI to philanthropy, under one navigation." />
        <Menu />
        <Begin />
        <StatementTile
          area="globe"
          big="Global focus, African conviction."
          small="The hero's dotted globe turns with the scroll, then docks in the corner as the page moves on."
        />
      </div>
    </div>
  );
}
