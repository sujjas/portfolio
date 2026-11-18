"use client";

/**
 * Shared parts for every "Up close" bento: the tile frame, the run-in copy,
 * the measured picture slot, the scroll-in beat and the type-only tiles.
 * Each site's file composes these and adds its own pictures; colours, fonts
 * and grid areas come from the site's root class (see shared.css).
 */
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Count, Stage, useReducedMotion } from "@/components/stageshow/kit";
import type { Act, Rect } from "@/components/stageshow/kit";
import "@/components/stageshow/kit/stageshow.css";
import "./shared.css";

export const STEP = 110;
export const LEAD = 450;

export type Beat = { on: boolean };
export const before: Beat = { on: false };
export const after: Beat = { on: true };
/** One beat, played once as the grid scrolls in, `i` tiles after the first. */
export const beat = (i: number) => async (a: Act<Beat>) => {
  await a.wait(LEAD + i * STEP);
  await a.set({ on: true });
};

export const right = (r: Rect) => ({ x: r.x + r.width, y: r.y + r.height / 2 });
export const left = (r: Rect) => ({ x: r.x, y: r.y + r.height / 2 });

export function usePictureWidth(initial = 340) {
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

export function useInView<T extends Element>(delay: number) {
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

export function Tile({
  area,
  title,
  children,
  picture,
  tone,
}: {
  area: string;
  title?: ReactNode;
  children?: ReactNode;
  picture?: ReactNode;
  tone?: "brand" | "dark";
}) {
  return (
    <section className={`ud-tile ud-tile--${area}`} data-tone={tone}>
      {title ? (
        <p className="ud-copy">
          {title} {children}
        </p>
      ) : (
        children
      )}
      {picture}
    </section>
  );
}

/**
 * A tile whose picture is one Stage at the tile's measured width, pinned to
 * its bottom and cropped by it.
 */
export function PictureTile({
  area,
  title,
  copy,
  height,
  index,
  tone,
  children,
}: {
  area: string;
  title: ReactNode;
  copy: ReactNode;
  height: number | ((width: number) => number);
  index: number;
  tone?: "brand" | "dark";
  children: (s: Beat, rect: (name: string) => Rect | null, width: number) => ReactNode;
}) {
  const [picture, width] = usePictureWidth();
  const h = typeof height === "function" ? height(width) : height;
  return (
    <Tile
      area={area}
      tone={tone}
      title={<b>{title}</b>}
      picture={
        <div ref={picture} className="ud-picture">
          <Stage<Beat> width={width} height={h} initial={before} poster={after} play="once" script={beat(index)} className="ud-stage">
            {(s, rect) => children(s, (n) => rect(n) ?? null, width)}
          </Stage>
        </div>
      }
    >
      {copy}
    </Tile>
  );
}

/** One big number that counts once as it scrolls in. */
export function StatTile({
  area,
  lead,
  value,
  from = 0,
  unit,
  label,
  index,
  tone = "brand",
}: {
  area: string;
  lead: string;
  value: number;
  from?: number;
  unit?: string;
  label: string;
  index: number;
  tone?: "brand" | "dark";
}) {
  const reduced = useReducedMotion();
  const [ref, seen] = useInView<HTMLDivElement>(LEAD + index * STEP);
  return (
    <Tile area={area} tone={tone}>
      <div ref={ref} className="ud-stat">
        <span className="ud-stat-lead">{lead}</span>
        <span className="ud-stat-number">
          <Count value={seen || reduced ? value : from} duration={1100} />
          {unit ? <span className="ud-stat-unit">{unit.length > 1 ? ` ${unit}` : unit}</span> : null}
        </span>
        <span className="ud-stat-label">{label}</span>
      </div>
    </Tile>
  );
}

/** One sentence in large type. Holds still. */
export function StatementTile({ area, big, small }: { area: string; big: string; small: string }) {
  return (
    <Tile area={area}>
      <div className="ud-statement">
        <span className="ud-statement-big">{big}</span>
        <span className="ud-statement-small">{small}</span>
      </div>
    </Tile>
  );
}
