"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Renders a design at its native pixel width and scales it to fit the
 * container. Everything inside is real DOM (text, borders, SVG), so it stays
 * crisp at any size, unlike a screenshot.
 */
export function ScaledFrame({
  width,
  height,
  children,
  className = "",
  label,
  meta,
}: {
  width: number;
  height: number;
  children: React.ReactNode;
  className?: string;
  label?: string;
  meta?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setScale(Math.min(1, el.clientWidth / width));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);

  return (
    <figure className={`overflow-hidden rounded-2xl border border-neutral-200 bg-white ring-1 ring-black/5 ${className}`}>
      {label ? (
        <figcaption className="flex items-center justify-between gap-4 border-b border-neutral-200 px-5 py-3">
          <p className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500">{label}</p>
          {meta ? (
            <p className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500 tabular-nums">
              {meta}
            </p>
          ) : null}
        </figcaption>
      ) : null}
      <div ref={ref} className="w-full" style={{ height: height * scale }}>
        <div
          style={{
            width,
            height,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {children}
        </div>
      </div>
    </figure>
  );
}
