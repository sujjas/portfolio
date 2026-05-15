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
 * One-shot RGB-split glitch wrapping the page. The filter is applied to a
 * single parent so the whole rendered tree is composited through the glitch
 * in one paint — cheaper than glitching N elements individually, and the
 * cumulative effect reads as "the whole page is glitching" rather than
 * isolated bits of UI.
 *
 * Animates the `--gx` CSS variable through six fast jitter beats, then
 * settles to 0. At rest the two drop-shadows collapse onto the underlying
 * pixels and become invisible. After the timeline finishes we strip the
 * filter entirely so the GPU isn't compositing a zero-offset shadow forever.
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

      gsap
        .timeline({
          delay,
          onComplete: () => {
            el.style.filter = "none";
          },
        })
        .set(el, { "--gx": 10 })
        .to(el, { "--gx": -8, duration: 0.055 })
        .to(el, { "--gx": 11, duration: 0.055 })
        .to(el, { "--gx": -5, duration: 0.055 })
        .to(el, { "--gx": 7, duration: 0.055 })
        .to(el, { "--gx": -3, duration: 0.055 })
        .to(el, { "--gx": 2, duration: 0.055 })
        .to(el, { "--gx": 0, duration: 0.2, ease: "power2.out" });
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      style={{
        ["--gx" as string]: "0",
        // Cyan ghost +gx px on the right, magenta ghost +gx px on the left.
        // Symmetrical pair → reads as RGB split rather than a soft glow.
        filter:
          "drop-shadow(calc(var(--gx) * 1px) 0 0 rgba(34, 211, 238, 0.7)) drop-shadow(calc(var(--gx) * -1px) 0 0 rgba(244, 63, 175, 0.7))",
        // Promote to its own layer so the filter doesn't repaint adjacent
        // content during the animation.
        willChange: "filter",
      }}
    >
      {children}
    </div>
  );
}
