"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type Entry = {
  role: string;
  org: string;
  start: number;
  end: number | "now";
  /** Striped pattern for ongoing / cross-cutting entries. */
  striped?: boolean;
};

const source: Entry[] = [
  { role: "Green Hill Academy", org: "Primary school", start: 2007, end: 2013 },
  { role: "St. Mary's College Kisubi", org: "Secondary school", start: 2014, end: 2016 },
  { role: "Green Hill Academy", org: "Continuing secondary", start: 2017, end: 2017 },
  { role: "Nalia Secondary School", org: "Secondary school", start: 2018, end: 2019 },
  { role: "Isbat University", org: "Undergraduate", start: 2021, end: 2025 },
  { role: "Brand & web designer", org: "Elevate Uganda", start: 2021, end: 2023 },
  { role: "Product designer", org: "Rwazi", start: 2023, end: "now" },
  {
    role: "Independent practice",
    org: "Web design + development",
    start: 2023,
    end: "now",
    striped: true,
  },
];

const NOW = new Date().getFullYear();
const MIN_YEAR = 2007;
const MAX_YEAR = 2030;
const SPAN = MAX_YEAR - MIN_YEAR;
const YEAR_COUNT = MAX_YEAR - MIN_YEAR + 1;
const YEARS_VISIBLE = 4;

function pct(year: number | "now"): number {
  const y = year === "now" ? NOW : year;
  return ((y - MIN_YEAR) / SPAN) * 100;
}

function endRank(e: Entry): number {
  return e.end === "now" ? Number.POSITIVE_INFINITY : e.end;
}

const entries = [...source].sort((a, b) => {
  const dr = endRank(b) - endRank(a);
  if (dr !== 0) return dr;
  return b.start - a.start;
});

type TooltipState = { x: number; y: number; text: string } | null;

export function Timeline() {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef<HTMLDivElement>(null);
  const hoverLabelRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showHover, setShowHover] = useState(false);
  const [innerWidth, setInnerWidth] = useState<number>(2500);
  const [tooltip, setTooltip] = useState<TooltipState>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const tooltipHideTimerRef = useRef<number | null>(null);
  const initialScrollDoneRef = useRef(false);

  // Include MIN_YEAR so the axis 0% mark lines up with pct(MIN_YEAR) = 0.
  const years = useMemo(() => {
    const out: number[] = [];
    for (let y = MIN_YEAR; y <= MAX_YEAR; y++) out.push(y);
    return out;
  }, []);

  useGSAP(
    () => {
      const bars =
        rootRef.current?.querySelectorAll<HTMLElement>("[data-bar]");
      if (!bars || bars.length === 0) return;
      gsap.fromTo(
        bars,
        { x: -20, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.7,
          ease: "expo.out",
          stagger: 0.06,
        },
      );
    },
    { scope: rootRef },
  );

  // Compute canvas width so YEARS_VISIBLE fit per viewport. On the
  // first measurement, also set the default scrollLeft so the
  // current year lands near the right edge — keeps the user on the
  // "active events" side of the canvas. Earlier years are off-screen
  // left, revealed by dragging back. Doing this inside the same
  // callback that produces the real width avoids the stale-width
  // race that caused the previous setting to no-op.
  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;
    const update = () => {
      const viewportW = scrollEl.offsetWidth;
      if (viewportW <= 0) return;
      const perYear = viewportW / YEARS_VISIBLE;
      const newInnerWidth = perYear * YEAR_COUNT;
      setInnerWidth(newInnerWidth);
      if (!initialScrollDoneRef.current) {
        initialScrollDoneRef.current = true;
        // Wait one frame for React to commit the new inline width
        // before we set scrollLeft, otherwise the browser clamps it
        // to the old (pre-update) scroll width.
        requestAnimationFrame(() => {
          const nowX = (pct(NOW) / 100) * newInnerWidth;
          // Place "now" at ~92% of viewport so the marker is right
          // near the right edge with a tiny breathing margin.
          const target = nowX - viewportW * 0.92;
          scrollEl.scrollLeft = Math.max(0, target);
        });
      }
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(scrollEl);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const scrollEl = scrollRef.current;
    const innerEl = innerRef.current;
    if (!scrollEl || !innerEl) return;

    let dragging = false;
    let startX = 0;
    let scrollLeftStart = 0;

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      dragging = true;
      setIsDragging(true);
      startX = e.clientX;
      scrollLeftStart = scrollEl.scrollLeft;
      scrollEl.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && !dragging) {
        const hover = hoverRef.current;
        const label = hoverLabelRef.current;
        if (hover && label) {
          const innerRect = innerEl.getBoundingClientRect();
          const x = e.clientX - innerRect.left;
          const w = innerEl.offsetWidth;
          if (x >= 0 && x <= w) {
            const yearAt = MIN_YEAR + (x / w) * SPAN;
            hover.style.transform = `translate3d(${x}px, 0, 0)`;
            label.textContent = String(Math.round(yearAt));
          }
        }
      }

      if (!dragging) return;
      e.preventDefault();
      const dx = e.clientX - startX;
      scrollEl.scrollLeft = scrollLeftStart - dx;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      setIsDragging(false);
      try {
        scrollEl.releasePointerCapture(e.pointerId);
      } catch {
        /* pointer may already be released */
      }
    };

    const onEnter = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      setShowHover(true);
    };
    const onLeave = () => {
      setShowHover(false);
      hideTooltip();
    };

    scrollEl.addEventListener("pointerdown", onPointerDown);
    scrollEl.addEventListener("pointermove", onPointerMove);
    scrollEl.addEventListener("pointerup", onPointerUp);
    scrollEl.addEventListener("pointercancel", onPointerUp);
    scrollEl.addEventListener("pointerenter", onEnter);
    scrollEl.addEventListener("pointerleave", onLeave);

    return () => {
      scrollEl.removeEventListener("pointerdown", onPointerDown);
      scrollEl.removeEventListener("pointermove", onPointerMove);
      scrollEl.removeEventListener("pointerup", onPointerUp);
      scrollEl.removeEventListener("pointercancel", onPointerUp);
      scrollEl.removeEventListener("pointerenter", onEnter);
      scrollEl.removeEventListener("pointerleave", onLeave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isDragging) hideTooltip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]);

  function showTooltip(data: NonNullable<TooltipState>) {
    if (tooltipHideTimerRef.current) {
      window.clearTimeout(tooltipHideTimerRef.current);
      tooltipHideTimerRef.current = null;
    }
    setTooltip(data);
    // Defer the "visible" flip a frame so the from-state can paint
    // before the transition kicks in.
    requestAnimationFrame(() => setTooltipVisible(true));
  }

  function hideTooltip() {
    setTooltipVisible(false);
    if (tooltipHideTimerRef.current) {
      window.clearTimeout(tooltipHideTimerRef.current);
    }
    tooltipHideTimerRef.current = window.setTimeout(() => {
      setTooltip(null);
      tooltipHideTimerRef.current = null;
    }, 180);
  }

  // Tooltip anchors to the cursor, not to the bar's geometric centre —
  // wide bars (e.g. multi-year roles) extend well past the visible
  // viewport, so centring on the bar would put the tooltip somewhere
  // unrelated to where the cursor actually is. Tracking the cursor
  // keeps the tooltip directly above the user's pointer regardless.
  const handleBarEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    text: string,
  ) => {
    if (isDragging) return;
    showTooltip({
      x: e.clientX,
      y: e.clientY,
      text,
    });
  };

  const handleBarMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) return;
    // Only update if a tooltip is currently shown — avoids needless
    // re-renders when the cursor is just passing through.
    if (!tooltip) return;
    setTooltip((prev) =>
      prev ? { ...prev, x: e.clientX, y: e.clientY } : prev,
    );
  };

  return (
    <div ref={rootRef} className="mt-10 select-none sm:mt-14">
      <div className="mb-4 flex items-end justify-between gap-3">
        <p className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500">
          Timeline · Education and work
        </p>
        <p className="hidden font-mono text-[0.65rem] uppercase tracking-wider text-neutral-400 sm:block">
          Drag to scroll
        </p>
      </div>

      {/* Edge mask softens the left/right cut so the scroll feels
          continuous instead of hard-clipped. */}
      <div
        ref={scrollRef}
        className={`relative overflow-x-auto ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          touchAction: "pan-x pan-y",
          WebkitOverflowScrolling: "touch",
          userSelect: "none",
          WebkitUserSelect: "none",
          maskImage:
            "linear-gradient(to right, transparent 0, black 64px, black calc(100% - 64px), transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0, black 64px, black calc(100% - 64px), transparent 100%)",
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar { display: none; }
        `}</style>

        <div
          ref={innerRef}
          className="relative pb-4 pt-2"
          style={{ width: `${innerWidth}px` }}
        >
          {/* Year axis */}
          <div className="relative border-b border-neutral-200 pb-2">
            <div className="relative flex justify-between font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500">
              {years.map((y) => (
                <span
                  key={y}
                  className={
                    y === NOW ? "font-medium text-neutral-950" : ""
                  }
                >
                  {y}
                </span>
              ))}
            </div>
          </div>

          {/* "Now" marker */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 top-7"
            style={{ left: `${pct(NOW)}%` }}
          >
            <div className="relative h-full">
              <span className="absolute left-1/2 top-0 -ml-px h-full w-px bg-neutral-950/30" />
              <span className="absolute -top-1 left-1/2 inline-block h-2.5 w-2 -translate-x-1/2 rounded-sm bg-neutral-950" />
            </div>
          </div>

          {/* Hover line */}
          <div
            ref={hoverRef}
            aria-hidden="true"
            className={`pointer-events-none absolute bottom-4 top-7 left-0 transition-opacity duration-150 ease-out ${
              showHover && !isDragging ? "opacity-100" : "opacity-0"
            }`}
            style={{ willChange: "transform" }}
          >
            <div className="relative h-full">
              <span className="absolute left-0 top-0 h-full border-l border-dashed border-neutral-950/40" />
              <div
                ref={hoverLabelRef}
                className="absolute -top-7 left-0 -translate-x-1/2 rounded-md bg-neutral-950 px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-wider text-white"
              >
                ----
              </div>
            </div>
          </div>

          {/* Bars */}
          <div className="relative mt-7 flex flex-col gap-5">
            {entries.map((e, i) => {
              const left = pct(e.start);
              const right = pct(e.end);
              const width = Math.max(2, right - left);
              const ongoing = e.end === "now";
              const past = !ongoing && (e.end as number) < NOW;
              const dateLabel = ongoing
                ? "Now"
                : e.start === e.end
                  ? String(e.start)
                  : `${e.start} – ${e.end}`;
              const titleText = `${e.role} · ${e.org} · ${dateLabel}`;
              return (
                <div
                  key={`${e.role}-${e.start}-${i}`}
                  data-bar
                  className="relative h-[56px]"
                >
                  <div
                    onMouseEnter={(ev) => handleBarEnter(ev, titleText)}
                    onMouseMove={handleBarMove}
                    onMouseLeave={hideTooltip}
                    className={`absolute top-0 flex h-full items-center justify-between gap-4 rounded-lg border px-4 text-[14px] ${
                      past
                        ? "border-neutral-200 bg-neutral-100"
                        : "border-neutral-200 bg-white"
                    }`}
                    style={{
                      left: `${left}%`,
                      width: `calc(${width}% - 4px)`,
                      ...(e.striped
                        ? {
                            backgroundImage:
                              "repeating-linear-gradient(135deg, rgba(10,10,10,0.04) 0 8px, transparent 8px 16px)",
                          }
                        : null),
                    }}
                  >
                    <span className="flex min-w-0 items-baseline gap-2 truncate">
                      <span
                        className={`truncate font-medium ${
                          past ? "text-neutral-700" : "text-neutral-950"
                        }`}
                      >
                        {e.role}
                      </span>
                      <span className="truncate text-neutral-500">
                        {e.org}
                      </span>
                    </span>
                    <span
                      className={`shrink-0 font-mono text-[0.65rem] uppercase tracking-wider tabular-nums ${
                        ongoing ? "text-neutral-950" : "text-neutral-500"
                      }`}
                    >
                      {dateLabel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tooltip — anchored to the cursor, sits ~18 px above it.
          Outer div places it in viewport coords (position: fixed);
          inner pill carries the opacity / rise transition for the
          entrance and exit animations. */}
      {tooltip ? (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed z-50"
          style={{
            left: tooltip.x,
            top: tooltip.y - 18,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div
            className={`whitespace-nowrap rounded-md bg-neutral-950 px-3 py-1.5 text-xs font-medium text-white shadow-[0_8px_24px_rgba(10,10,10,0.18)] transition-[opacity,transform] duration-200 ease-out ${
              tooltipVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-1 opacity-0"
            }`}
          >
            {tooltip.text}
          </div>
        </div>
      ) : null}
    </div>
  );
}
