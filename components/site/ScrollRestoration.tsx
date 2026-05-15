"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Per-route scroll restoration. Saves the current scroll position to
 * sessionStorage on route change, restores it on mount of any route that
 * has a saved position.
 *
 * Default Next.js App Router behaviour scrolls to (0, 0) on every
 * client-side navigation, which means hitting "back" after scrolling
 * through a case study throws the user back to the top of the
 * previous page instead of the row they came from. This component
 * fixes that without disabling the top-of-page jump for forward
 * navigations (a forward visit to a route with no saved entry still
 * lands at the top).
 *
 * Lenis smooth scrolling is tracked through window.scrollY, so a
 * `window.scrollTo({ behavior: "instant" })` jump bypasses Lenis's
 * smoothing and updates Lenis's internal state in the same frame.
 */
export function ScrollRestoration() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Tell the browser to stop auto-restoring; we do it ourselves so
    // we have control over timing (post-layout, post-Lenis-init).
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const key = `scroll:${pathname}`;
    const saved = sessionStorage.getItem(key);
    if (saved) {
      const y = Number.parseInt(saved, 10);
      if (Number.isFinite(y)) {
        // Wait two frames for App-Router layout + Lenis to settle.
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            window.scrollTo({ top: y, left: 0, behavior: "instant" });
          });
        });
      }
    } else {
      // No saved entry for this route → fresh visit, start at the top.
      // Without this the user can land mid-page if the prior route
      // also lived at this URL slug and was scrolled.
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      });
    }

    // Save current scroll position whenever we leave this route. The
    // cleanup runs in the closure of the *previous* pathname, so this
    // is correctly scoped per-route.
    return () => {
      sessionStorage.setItem(key, String(window.scrollY));
    };
  }, [pathname]);

  // Also persist scroll on hard page unload (refresh, tab close).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onBeforeUnload = () => {
      sessionStorage.setItem(`scroll:${pathname}`, String(window.scrollY));
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [pathname]);

  return null;
}
