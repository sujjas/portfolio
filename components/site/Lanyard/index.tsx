"use client";

import dynamic from "next/dynamic";

// Lazy-load the WebGL/Rapier scene — keeps three.js + R3F out of the initial
// JS bundle for every other route. SSR off because it touches `window` and the
// `<canvas>` GL context is client-only anyway.
const LanyardCanvas = dynamic(() => import("./Lanyard"), {
  ssr: false,
  loading: () => (
    <div
      className="absolute inset-0"
      aria-hidden="true"
      style={{ background: "transparent" }}
    />
  ),
});

export { LanyardCanvas as Lanyard };
