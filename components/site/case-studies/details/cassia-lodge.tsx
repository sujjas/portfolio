"use client";

/**
 * Cassia Lodge — the details under the scroll reel. A bento of the booking
 * system's moving parts, drawn as live HTML with the stageshow kit
 * (components/stageshow/kit), not screenshots.
 *
 *   Tile         Span   Kind       The one thing                         Moves
 *   Booking      2 × 1  Hero UI    the booking card, a range of nights   the range stretches to three nights, the total rolls
 *   Rooms        1 × 1  Stat       28 rooms, one calendar                counts up
 *   Back office  1 × 1  Component  one request, Confirm                  presses and turns Confirmed, the guest is emailed
 *   Channels     1 × 1  Diagram    four ways in, one availability        the lines draw in
 *   Checked      1 × 1  Statement  "Checked twice."                      still
 *
 * Every neighbour is a different kind; one picture per tile, each its own
 * Stage at 1:1, pinned to the tile's bottom. Each plays once as it scrolls
 * in, 110ms after the tile before it.
 */
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Barlow, Playfair_Display } from "next/font/google";
import { Check, CalendarDays, DoorOpen, Globe, Phone } from "lucide-react";
import { Avatar, Connector, Count, Stage, States, Text, useReducedMotion } from "@/components/stageshow/kit";
import type { Act, Rect } from "@/components/stageshow/kit";
import "@/components/stageshow/kit/stageshow.css";
import "./cassia-lodge.css";

const barlow = Barlow({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--cl-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["500"], variable: "--cl-serif" });

const STEP = 110;
const LEAD = 450;

type Beat = { on: boolean };
const before: Beat = { on: false };
const after: Beat = { on: true };
const beat = (i: number) => async (a: Act<Beat>) => {
  await a.wait(LEAD + i * STEP);
  await a.set({ on: true });
};

function usePictureWidth(initial = 340) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(initial);
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const measure = () => setWidth(Math.max(1, node.getBoundingClientRect().width));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return [ref, width] as const;
}

function useInView<T extends Element>(delay: number) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let t = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        t = window.setTimeout(() => setSeen(true), delay);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, [delay]);
  return [ref, seen] as const;
}

function Tile({ area, title, children, picture, tone }: { area: string; title?: ReactNode; children?: ReactNode; picture?: ReactNode; tone?: "brand" }) {
  return (
    <section className={`cl-tile cl-tile--${area}`} data-tone={tone}>
      {title ? (
        <p className="cl-copy">
          {title} {children}
        </p>
      ) : (
        children
      )}
      {picture}
    </section>
  );
}

/* ---------------- Booking (hero) ---------------- */

// Two weeks of March. Nights 5 and 6 are full for Doubles; the guest's stay
// starts on the 9th and stretches from one night to three.
const DAYS = Array.from({ length: 14 }, (_, i) => i + 1);
const FULL = new Set([5, 6]);
const CHECK_IN = 9;
const ROOMS = ["Single", "Double", "Twin", "Triple"];

function BookingCard({ on, compact }: { on: boolean; compact: boolean }) {
  const out = on ? 12 : 10; // check-out day
  const nights = out - CHECK_IN;
  return (
    <div className="cl-book" data-compact={compact || undefined}>
      <div className="cl-book-head">
        <span className="cl-book-title">Book a room</span>
        <span className="cl-types" role="presentation">
          {ROOMS.map((r) => (
            <span key={r} className="cl-type" data-on={r === "Double" || undefined}>
              {r}
              {r === "Triple" ? <span className="cl-left">1 left</span> : null}
            </span>
          ))}
        </span>
      </div>
      <div className="cl-book-body">
        <div className="cl-cal">
          <span className="cl-cal-month">March</span>
          <span className="cl-cal-grid">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <span key={i} className="cl-cal-dow">
                {d}
              </span>
            ))}
            {DAYS.map((d) => {
              const full = FULL.has(d);
              const inRange = d >= CHECK_IN && d < out;
              const isIn = d === CHECK_IN;
              const isOut = d === out;
              // The band runs night by night: every day from check-in to
              // check-out sits on it, capped by solid discs at the two ends.
              const band = d >= CHECK_IN && d <= out;
              const bandStart = d === CHECK_IN;
              const bandEnd = d === out;
              return (
                <span
                  key={d}
                  className="cl-day"
                  data-full={full || undefined}
                  data-band={band || undefined}
                  data-band-start={bandStart || undefined}
                  data-band-end={bandEnd || undefined}
                  data-cap={isIn || isOut || undefined}
                  data-range={inRange || undefined}
                >
                  <span className="cl-day-n">{d}</span>
                </span>
              );
            })}
          </span>
        </div>
        <div className="cl-sum">
          <span className="cl-sum-line">
            Double ·{" "}
            <span className="cl-sum-n">
              <Count value={nights} duration={500} />
            </span>{" "}
            {nights === 1 ? "night" : "nights"}
          </span>
          <span className="cl-sum-label">Estimated total</span>
          <span className="cl-sum-total">
            <span className="cl-sum-cur">$</span>
            <Count value={nights * 160} duration={900} />
          </span>
          <span className="cl-btn cl-btn--primary">Request booking</span>
        </div>
      </div>
    </div>
  );
}

function Booking() {
  const [picture, width] = usePictureWidth(600);
  const compact = width < 560;
  return (
    <Tile
      area="hero"
      title={<b>Booking, without the back-and-forth.</b>}
      picture={
        <div ref={picture} className="cl-picture cl-picture--full">
          <Stage<Beat> width={width} height={compact ? 330 : 300} initial={before} poster={after} play="once" script={beat(0)} className="cl-stage">
            {(s) => <BookingCard on={s.on} compact={compact} />}
          </Stage>
        </div>
      }
    >
      Full nights grey out as rooms fill, and the price follows the dates a guest picks.
    </Tile>
  );
}

/* ---------------- Rooms (stat) ---------------- */

function Rooms() {
  const reduced = useReducedMotion();
  const [ref, seen] = useInView<HTMLDivElement>(LEAD + STEP);
  return (
    <Tile area="stat" tone="brand">
      <div ref={ref} className="cl-stat">
        <span className="cl-stat-lead">One live calendar for</span>
        <span className="cl-stat-number">
          <Count value={seen || reduced ? 28 : 0} duration={1100} />
          <span className="cl-stat-unit"> rooms</span>
        </span>
        <span className="cl-stat-label">across four room types, opened and closed by staff from the back office.</span>
      </div>
    </Tile>
  );
}

/* ---------------- Back office (component) ---------------- */

function BackOffice() {
  const [picture, width] = usePictureWidth();
  return (
    <Tile
      area="office"
      title={<b>Confirmed in a click.</b>}
      picture={
        <div ref={picture} className="cl-picture cl-picture--full">
          <Stage<Beat> width={width} height={206} initial={before} poster={after} play="once" script={beat(2)} className="cl-stage">
            {(s) => (
              <div className="cl-req">
                <div className="cl-req-who">
                  <Avatar name="Grace Nambi" size={36} tone="accent" />
                  <span className="cl-req-text">
                    <Text className="cl-req-name">Grace Nambi</Text>
                    <Text className="cl-req-what">Double · 9–12 March</Text>
                  </span>
                  <span className="cl-req-status" data-on={s.on || undefined}>
                    <States value={s.on ? "done" : "wait"} align="end" states={{ wait: "Pending", done: "Confirmed" }} />
                  </span>
                </div>
                <div className="cl-req-actions">
                  <span className="cl-btn">Decline</span>
                  <span className="cl-btn cl-btn--primary" data-on={s.on || undefined}>
                    <States
                      value={s.on ? "done" : "ask"}
                      states={{
                        ask: "Confirm",
                        done: (
                          <span className="cl-btn-done">
                            <Check size={15} strokeWidth={2.4} aria-hidden /> Guest emailed
                          </span>
                        ),
                      }}
                    />
                  </span>
                </div>
              </div>
            )}
          </Stage>
        </div>
      }
    >
      The guest hears back either way.
    </Tile>
  );
}

/* ---------------- Channels (diagram) ---------------- */

const CHANNELS = [
  { name: "Website", icon: Globe },
  { name: "Booking.com", icon: CalendarDays },
  { name: "Phone", icon: Phone },
  { name: "Walk-in", icon: DoorOpen },
];

function Channels() {
  const [picture, width] = usePictureWidth();
  return (
    <Tile
      area="channels"
      title={<b>Every way in, one calendar.</b>}
      picture={
        <div ref={picture} className="cl-picture cl-picture--full">
          <Stage<Beat> width={width} height={214} initial={before} poster={after} play="once" script={beat(3)} className="cl-stage">
            {(s, rect) => {
              const right = (r: Rect) => ({ x: r.x + r.width, y: r.y + r.height / 2 });
              const left = (r: Rect) => ({ x: r.x, y: r.y + r.height / 2 });
              const to = rect("calendar");
              return (
                <>
                  <div className="cl-chans">
                    {CHANNELS.map((c) => (
                      <span key={c.name} className="cl-chan" data-target={`c-${c.name}`}>
                        <c.icon size={14} strokeWidth={2} aria-hidden />
                        <Text>{c.name}</Text>
                      </span>
                    ))}
                  </div>
                  <span className="cl-avail" data-target="calendar" data-on={s.on || undefined}>
                    <Text>Availability</Text>
                  </span>
                  {to &&
                    CHANNELS.map((c, i) => {
                      const from = rect(`c-${c.name}`);
                      return from ? (
                        <Connector key={c.name} from={right(from)} to={left(to)} route="step" show={s.on} className={`cl-line cl-line--${i}`} />
                      ) : null;
                    })}
                </>
              );
            }}
          </Stage>
        </div>
      }
    >
      Desk staff enter the rest by hand.
    </Tile>
  );
}

/* ---------------- Checked (statement) ---------------- */

function Checked() {
  return (
    <Tile area="checked">
      <div className="cl-statement">
        <span className="cl-statement-big">Checked twice.</span>
        <span className="cl-statement-small">Every request is checked against availability again on the server, so a page left open can&apos;t overbook a room.</span>
      </div>
    </Tile>
  );
}

export function CassiaLodgeDetails() {
  return (
    <div className={`cassia-details ${barlow.variable} ${playfair.variable}`}>
      <div className="cl-grid">
        <Booking />
        <Rooms />
        <BackOffice />
        <Channels />
        <Checked />
      </div>
    </div>
  );
}
