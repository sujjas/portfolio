"use client";

import dynamic from "next/dynamic";

// Browser-only — listens for pointer events and drives a GSAP timeline.
const ImageTrailCanvas = dynamic(() => import("./ImageTrail"), {
  ssr: false,
});

export { ImageTrailCanvas as ImageTrail };
export type { ImageTrailVariantNumber } from "./ImageTrail";
