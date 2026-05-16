"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = {
  children: ReactNode;
  /** Stagger across direct children when true (e.g. lists, grids). */
  stagger?: boolean;
  /** y-offset for the rise. */
  y?: number;
  /** Delay before the timeline starts (mostly useful on entry-only). */
  delay?: number;
  /** Disable scroll trigger and animate immediately on mount. */
  immediate?: boolean;
  /** Custom selector for which children to animate. Defaults to all direct children. */
  selector?: string;
  className?: string;
};

/**
 * Scroll-triggered fade-up reveal. Wrap any block to animate it (or its
 * direct children, when `stagger`) once on enter. Respects
 * prefers-reduced-motion.
 */
export function Reveal({
  children,
  stagger = false,
  y = 24,
  delay = 0,
  immediate = false,
  selector,
  className,
}: Props) {
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

      const targets: Element[] | Element = stagger
        ? Array.from(
            selector ? el.querySelectorAll(selector) : el.children,
          )
        : el;

      if (Array.isArray(targets) && targets.length === 0) return;

      gsap.set(targets, { y, opacity: 0 });

      gsap.to(targets, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power3.out",
        delay,
        stagger: stagger ? 0.08 : 0,
        ...(immediate
          ? {}
          : {
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                once: true,
              },
            }),
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
