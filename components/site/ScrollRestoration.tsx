"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Per-route scroll restoration with direction awareness.
 *
 * Behaviour:
 *  - Forward navigations (clicking a Link): the destination route
 *    always lands at the top. Any previously-saved scroll for that
 *    route is cleared, so a fresh visit shows the page from its hero
 *    and entry animations play normally.
 *  - Back / forward browser navigations (popstate): the destination
 *    route's last scroll position is restored. This means reading
 *    halfway down a case study, hitting Back, and landing on the same
 *    row in /work — but going INTO /work via "See all projects" still
 *    starts at the top.
 *  - Initial mount (full page load / refresh): if there's a saved
 *    position for the current route, restore it; otherwise stay at
 *    the top. This preserves scroll across hard refreshes.
 *
 * On every route change (mount/unmount of this effect), the
 * unmounting route's scrollY is persisted to sessionStorage keyed by
 * its pathname so a later Back can restore it.
 *
 * Lenis smooth scrolling tracks window.scrollY, so a
 * `window.scrollTo({ behavior: "instant" })` jump bypasses Lenis's
 * smoothing and updates Lenis's internal state in the same frame.
 */
export function ScrollRestoration() {
  const pathname = usePathname();
  const isPopRef = useRef(false);
  const hasMountedRef = useRef(false);

  // Detect browser back/forward — popstate fires for those, but not
  // for router.push() / Link clicks (those use pushState directly).
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    const onPop = () => {
      isPopRef.current = true;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = `scroll:${pathname}`;
    const isInitialMount = !hasMountedRef.current;
    hasMountedRef.current = true;

    // Reset both the DOM and Lenis's internal target. Calling
    // window.scrollTo alone leaves Lenis lerping back to its old
    // target; calling lenis.scrollTo alone doesn't help on browsers
    // where Lenis isn't active (reduced-motion users).
    const jump = (y: number) => {
      window.scrollTo({ top: y, left: 0, behavior: "instant" });
      const lenis = window.__lenis;
      if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
    };

    if (isPopRef.current || isInitialMount) {
      const saved = sessionStorage.getItem(key);
      if (saved) {
        const y = Number.parseInt(saved, 10);
        if (Number.isFinite(y)) {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => jump(y));
          });
        }
      }
      isPopRef.current = false;
    } else {
      // Forward navigation — drop any stale entry for this route and
      // start the page from the top so the intro animations run.
      sessionStorage.removeItem(key);
      requestAnimationFrame(() => jump(0));
    }

    return () => {
      sessionStorage.setItem(key, String(window.scrollY));
    };
  }, [pathname]);

  // Persist on hard unload (refresh, tab close) so refresh-on-the-spot
  // restores.
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
