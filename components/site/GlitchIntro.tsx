"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

type Props = {
  children: ReactNode;
  /** Total run is the sum of the jitter beats + the settle ease. Override only if you need a different cadence. */
  delay?: number;
};

/**
 * One-shot full-page glitch wrapping the homepage. Animates five CSS
 * variables driving a chained filter + transform on a single parent:
 *
 *   --gx, --gy     RGB-split offsets (cyan +(gx,gy), magenta -(gx,gy))
 *   --pb           pixelation blur (0 at rest)
 *   --pc           pixelation contrast (1 at rest)
 *   --gskew        skewX in degrees (0 at rest)
 *   --gscale       scale (1 at rest)
 *
 * The trick for the "blocky pixels" look is `blur(2px) contrast(15)` —
 * the heavy contrast pushes the blurred mid-tones to either black or
 * full saturation, creating chunky cell-like shapes. At rest all
 * variables collapse to identity (no blur, contrast 1, no transform).
 * After the timeline lands we strip `filter` and `transform` so the GPU
 * isn't holding state forever.
 *
 * Respects `prefers-reduced-motion`. SSR-safe.
 */
export function GlitchIntro({ children, delay = 0.1 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }
      const el = ref.current;
      if (!el) return;

      const beat = 0.055;

      gsap
        .timeline({
          delay,
          onComplete: () => {
            el.style.filter = "none";
            el.style.transform = "none";
          },
        })
        // Opening hit — RGB tear + pixelation peak + skew.
        .set(el, {
          "--gx": 70,
          "--gy": -14,
          "--pb": 2.2,
          "--pc": 14,
          "--gskew": -2,
          "--gscale": 1.012,
        })
        // Counter-thrash.
        .to(el, {
          "--gx": -64,
          "--gy": 10,
          "--pb": 1.6,
          "--pc": 9,
          "--gskew": 2.4,
          "--gscale": 0.992,
          duration: beat,
        })
        // Second pixelation pulse — blocks at maximum.
        .to(el, {
          "--gx": 82,
          "--gy": -22,
          "--pb": 2.6,
          "--pc": 18,
          "--gskew": -1.6,
          "--gscale": 1.018,
          duration: beat,
        })
        .to(el, {
          "--gx": -42,
          "--gy": 16,
          "--pb": 1.2,
          "--pc": 6,
          "--gskew": 1.2,
          "--gscale": 0.996,
          duration: beat,
        })
        // De-emphasise pixelation, keep RGB split high.
        .to(el, {
          "--gx": 50,
          "--gy": -8,
          "--pb": 0.6,
          "--pc": 3,
          "--gskew": -0.6,
          "--gscale": 1.006,
          duration: beat,
        })
        .to(el, {
          "--gx": -32,
          "--gy": 6,
          "--pb": 0.2,
          "--pc": 1.8,
          "--gskew": 0.4,
          "--gscale": 0.998,
          duration: beat,
        })
        .to(el, {
          "--gx": 22,
          "--gy": -3,
          "--pb": 0,
          "--pc": 1.3,
          "--gskew": 0,
          "--gscale": 1.002,
          duration: beat,
        })
        .to(el, {
          "--gx": -12,
          "--gy": 2,
          "--pb": 0,
          "--pc": 1.1,
          "--gskew": 0,
          "--gscale": 1,
          duration: beat,
        })
        .to(el, {
          "--gx": 6,
          "--gy": -1,
          duration: beat,
        })
        // Settle — slower release so the recovery reads.
        .to(el, {
          "--gx": 0,
          "--gy": 0,
          "--pb": 0,
          "--pc": 1,
          "--gskew": 0,
          "--gscale": 1,
          duration: 0.34,
          ease: "power3.out",
        });
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      // `flex flex-col min-h-dvh` mirrors the body's layout so this wrapper
      // doesn't collapse to its content width — without these, on some
      // viewport widths the flex-column body computes the wrapper as
      // content-sized rather than viewport-wide, which made the centered
      // max-w-[1280px] children look shoved to one side.
      className="flex min-h-dvh w-full flex-col"
      style={{
        ["--gx" as string]: "0",
        ["--gy" as string]: "0",
        ["--pb" as string]: "0",
        ["--pc" as string]: "1",
        ["--gskew" as string]: "0",
        ["--gscale" as string]: "1",
        // Filter chain order matters:
        //   1. blur + contrast — flattens detail into chunky blocks
        //   2. cyan ghost + magenta ghost — RGB tear
        filter:
          "blur(calc(var(--pb) * 1px)) contrast(var(--pc)) drop-shadow(calc(var(--gx) * 1px) calc(var(--gy) * 1px) 0 rgba(34, 211, 238, 0.95)) drop-shadow(calc(var(--gx) * -1px) calc(var(--gy) * -1px) 0 rgba(244, 63, 175, 0.95))",
        transform:
          "scale(var(--gscale)) skewX(calc(var(--gskew) * 1deg))",
        transformOrigin: "50% 30%",
        willChange: "filter, transform",
      }}
    >
      {children}
    </div>
  );
}
