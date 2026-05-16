"use client";

import { useEffect } from "react";

/**
 * Idle-prefetch the Lanyard 3D scene chunk on every page load so it's
 * already cached by the time the user navigates to /about. The chunk
 * is ~600KB (Three.js + Rapier + meshline), so we wait for the
 * browser to be idle (or fall back to a 2s timeout) before kicking
 * off the import — that keeps the homepage's LCP unaffected.
 *
 * Skipped on slow / save-data connections so we don't burn cellular
 * bandwidth users haven't budgeted for.
 */
export function LanyardPrefetch() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Respect the user's data preference.
    const conn = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    if (conn?.saveData) return;
    if (conn?.effectiveType && /(^|-)2g$/.test(conn.effectiveType)) return;

    const start = () => {
      // Dynamic import warms the chunk in the browser cache; we
      // intentionally don't await it.
      import("@/components/site/Lanyard/Lanyard").catch(() => {
        /* prefetch is best-effort */
      });
      // Also preload the card portrait so the canvas texture has
      // it cached by the time the scene mounts on /about. Without
      // this the user sees the name render first and the portrait
      // pop in a few hundred ms later.
      try {
        const img = new window.Image();
        img.decoding = "async";
        img.src = "/portrait.png";
      } catch {
        /* best-effort */
      }
    };

    const ric = (
      window as Window & {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
        cancelIdleCallback?: (id: number) => void;
      }
    ).requestIdleCallback;

    if (typeof ric === "function") {
      const id = ric(start, { timeout: 4000 });
      return () => {
        const cic = (
          window as Window & { cancelIdleCallback?: (id: number) => void }
        ).cancelIdleCallback;
        cic?.(id);
      };
    }
    // Safari / older browsers: no requestIdleCallback. Wait until
    // the main thread has had a couple of seconds to settle, then
    // fire on a low-priority timeout.
    const t = window.setTimeout(start, 2000);
    return () => window.clearTimeout(t);
  }, []);

  return null;
}
