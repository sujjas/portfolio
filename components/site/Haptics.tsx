"use client";

import { useEffect } from "react";

/**
 * Lightweight haptic-feedback layer in the spirit of haptics.lochie.me.
 * Fires a short navigator.vibrate() pulse on initial mount (page load
 * / refresh) and on tap of any button, link, or [role="button"].
 *
 * Compatibility notes (deliberate, not a bug):
 *  - Android Chrome / Edge / Samsung Internet: works (their vibrate
 *    implementation is wired to the device motor).
 *  - iOS Safari: ignored. Apple disabled `navigator.vibrate()` in
 *    iOS Safari. There is no JS-accessible haptic API on iOS web,
 *    short of standalone PWAs that opt into specific WebKit features.
 *  - Desktop: ignored. No motor.
 *
 * The component renders nothing; it just attaches listeners.
 *
 * Respects `prefers-reduced-motion: reduce` — that media query also
 * implies the user has asked for less synthetic feedback, so we
 * skip haptics entirely.
 */
export function Haptics() {
  useEffect(() => {
    if (typeof navigator === "undefined") return;
    if (typeof navigator.vibrate !== "function") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Initial-load thump — one ~14ms pulse, just enough to register
    // on the device motor without becoming intrusive on every visit.
    const initial = window.setTimeout(() => {
      try {
        navigator.vibrate(14);
      } catch {
        /* device may reject — silently */
      }
    }, 120);

    // Tap haptics. Delegated to document so we don't have to wire
    // every CTA individually. The selector covers buttons, anchors,
    // and ARIA buttons; we deliberately ignore inputs and labels so
    // a textarea tap doesn't pulse.
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (!target) return;
      const interactive = target.closest(
        'button, a[href], [role="button"], summary',
      );
      if (!interactive) return;
      // Skip disabled controls
      if (
        interactive instanceof HTMLButtonElement &&
        interactive.disabled
      ) {
        return;
      }
      try {
        // 7ms = a sharp "tick" without the deeper hum of longer pulses
        navigator.vibrate(7);
      } catch {
        /* ignore */
      }
    };
    document.addEventListener("pointerdown", onPointerDown, { passive: true });

    return () => {
      window.clearTimeout(initial);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return null;
}
