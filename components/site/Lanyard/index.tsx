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
 */
export function Lanyard() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [mount3D, setMount3D] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);

  // Defer the heavy chunk import until we're close to the viewport.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    // If IntersectionObserver isn't available, mount immediately.
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
      // Start the chunk download a half-screen before the section is
      // actually visible — by the time the user scrolls in, the canvas
      // is usually ready.
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Once the canvas has had a frame to render, fade out the poster.
  // The R3F Canvas inside Lanyard.tsx triggers paint after init; we use
  // a short timer because there's no clean public "ready" signal across
  // R3F + rapier wasm.
  useEffect(() => {
    if (!mount3D) return;
    const t = window.setTimeout(() => setCanvasReady(true), 1200);
    return () => window.clearTimeout(t);
  }, [mount3D]);

  return (
    <div ref={wrapRef} className="absolute inset-0">
      {/* Poster — visible until the canvas takes over. Uses the same
          portrait shipped elsewhere on the site so no extra fetch is
          needed. Fades out gracefully once the 3D scene is up. */}
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
    </div>
  );
}
