"use client";

import { useEffect } from "react";
import { haptic } from "@/lib/haptics";

/**
 * Global haptic-feedback layer. A delegated pointerdown listener
 * fires a "selection" tap whenever the user touches a button, link,
 * [role="button"] or summary. iOS Safari needs the call to happen
 * inside a real user gesture stack — pointerdown qualifies, so the
 * web-haptics library can play its CoreHaptics tap via the hidden
 * <input switch> trick.
 *
 * Specific surfaces (mobile menu open/close, etc.) override the
 * default preset by calling haptic() directly in their onClick with
 * the appropriate weight (medium for opens, light for closes).
 */
export function Haptics() {
  useEffect(() => {
    if (typeof document === "undefined") return;

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
      // Honour an opt-out attribute for surfaces that want to manage
      // their own haptic preset (and avoid the default double-fire).
      if (interactive.hasAttribute("data-no-haptic")) return;
      haptic("selection");
    };
    document.addEventListener("pointerdown", onPointerDown, { passive: true });

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return null;
}
