"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

// Heavy WebGL/Rapier scene — keep three.js + R3F + rapier + meshline out
// of the initial JS bundle. SSR off because it touches `window` and the
// `<canvas>` GL context is client-only anyway. Mount is deferred until
// the wrapper enters the viewport (see <Lanyard /> below), so the chunk
// + assets (card.glb, lanyard textures) don't compete with anything
// above the fold.
const LanyardCanvas = dynamic(() => import("./Lanyard"), {
  ssr: false,
  loading: () => null,
});

/**
 * Lanyard slot. Renders an instant poster image (a static portrait the
 * user already sees elsewhere on the site) and only kicks the heavy 3D
 * import once this slot is within ~600px of the viewport. The poster
 * then fades out as the canvas takes over.
 *
 * Net effect: the section never looks blank, the 3D download doesn't
 * block first paint, and mobile gets the same showpiece desktop does.
 *
 * Interaction hints:
 *  - Desktop: a small label follows the cursor while it's over the
 *    lanyard area, telling the user to "Click + drag" the card.
 *  - Mobile: a static "Pull the card" pill sits near the bottom of
 *    the lanyard slot.
 *  - Both fade out the first time the user actually interacts with
 *    the card and stay hidden for the rest of the session.
 */
export function Lanyard() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [mount3D, setMount3D] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [hovering, setHovering] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  // Defer the heavy chunk import until we're close to the viewport.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setMount3D(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setMount3D(true);
            io.disconnect();
            return;
          }
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Once the canvas has had a frame to render, fade out the poster.
  useEffect(() => {
    if (!mount3D) return;
    const t = window.setTimeout(() => setCanvasReady(true), 1200);
    return () => window.clearTimeout(t);
  }, [mount3D]);

  // Wire pointer events on the wrapper to drive both hints:
  //  - pointermove updates the cursor follower's position (desktop).
  //  - pointerdown marks "interacted" and fades both hints out for
  //    the rest of the session.
  // We position the follower via direct ref.style writes rather than
  // React state so 60fps cursor tracking doesn't cause re-renders.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onEnter = () => setHovering(true);
    const onLeave = () => setHovering(false);
    const onMove = (e: PointerEvent) => {
      const cursor = cursorRef.current;
      if (!cursor) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    const onDown = () => setHasInteracted(true);
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerdown", onDown);
    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerdown", onDown);
    };
  }, []);

  const showHints = canvasReady && !hasInteracted;

  return (
    <div ref={wrapRef} className="absolute inset-0">
      {/* Poster — visible until the canvas takes over. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-700 ease-out ${
          canvasReady ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="flex w-[220px] flex-col items-center sm:w-[260px]">
          <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl bg-neutral-100 shadow-[0_10px_30px_rgba(10,10,10,0.12)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/portrait.png"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              decoding="async"
            />
          </div>
          <p className="mt-4 font-mono text-[0.65rem] uppercase tracking-wider text-neutral-400">
            Loading…
          </p>
        </div>
      </div>

      {/* Heavy 3D canvas, mounted on intersection. */}
      {mount3D ? <LanyardCanvas /> : null}

      {/* Mobile hint — static pill near the bottom of the slot. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 transition-opacity duration-500 ease-out lg:hidden ${
          showHints ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white/90 px-3.5 py-1.5 font-mono text-[0.65rem] uppercase tracking-wider text-neutral-700 shadow-[0_4px_12px_rgba(10,10,10,0.06)] backdrop-blur">
          <span aria-hidden="true" className="hint-arrow inline-block">↓</span>
          Pull the card
        </div>
      </div>

      {/* Desktop cursor follower — sits at the pointer, hidden on
          touch-only viewports (no hover capability). */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        className={`pointer-events-none absolute left-0 top-0 hidden -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 ease-out lg:block ${
          showHints && hovering ? "opacity-100" : "opacity-0"
        }`}
        style={{ willChange: "transform" }}
      >
        <div className="ml-6 inline-flex items-center gap-2 rounded-full bg-neutral-950 px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-wider text-white shadow-[0_4px_16px_rgba(10,10,10,0.18)]">
          <span aria-hidden="true">●</span>
          Click + drag
        </div>
      </div>

      <style jsx>{`
        @keyframes hint-bob {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(3px); }
        }
        .hint-arrow {
          animation: hint-bob 1.4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
