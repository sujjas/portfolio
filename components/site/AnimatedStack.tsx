"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type Props = {
  children: ReactNode;
  /** Selector for the elements to stagger. Defaults to direct children. */
  selector?: string;
  delay?: number;
  className?: string;
};

/**
 * Mount-time stagger reveal. Use for hero copy columns where each line
 * rises in sequence. No scroll trigger — fires immediately.
 */
export function AnimatedStack({
  children,
  selector,
  delay = 0.1,
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

      const targets = selector
        ? Array.from(el.querySelectorAll(selector))
        : Array.from(el.children);
      if (targets.length === 0) return;

      gsap.set(targets, { y: 24, opacity: 0 });
      gsap.to(targets, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        delay,
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
