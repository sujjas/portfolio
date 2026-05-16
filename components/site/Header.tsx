"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Crosshair } from "./Crosshair";
import { Icon } from "./Icon";
import { haptic } from "@/lib/haptics";

gsap.registerPlugin(useGSAP);

const navLinks = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/process", label: "Process" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Portal target only exists after hydration.
  useEffect(() => setMounted(true), []);

  // Close the mobile sheet whenever the route changes.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // GSAP-driven menu entry. The bg fades; the sheet slides down from
  // above with expo.out; the eyebrow, links and CTAs stagger in
  // underneath. Close is a quicker reverse so the page doesn't sit
  // half-visible behind an exiting menu.
  useGSAP(
    () => {
      const nav = mobileNavRef.current;
      const bg = bgRef.current;
      const sheet = sheetRef.current;
      if (!nav || !bg || !sheet) return;
      const items = nav.querySelectorAll<HTMLElement>("[data-menu-item]");

      if (mobileOpen) {
        gsap.killTweensOf([bg, sheet, items]);
        gsap.set(nav, { autoAlpha: 1 });
        gsap.fromTo(
          bg,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.35, ease: "power2.out" },
        );
        gsap.fromTo(
          sheet,
          { yPercent: -8, autoAlpha: 0 },
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 0.7,
            ease: "expo.out",
          },
        );
        gsap.fromTo(
          items,
          { y: 24, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.7,
            ease: "expo.out",
            stagger: 0.06,
            delay: 0.15,
          },
        );
      } else {
        gsap.killTweensOf([bg, sheet, items]);
        gsap.to(bg, {
          autoAlpha: 0,
          duration: 0.25,
          ease: "power2.in",
        });
        gsap.to(sheet, {
          yPercent: -4,
          autoAlpha: 0,
          duration: 0.25,
          ease: "power2.in",
        });
        gsap.to(items, {
          autoAlpha: 0,
          duration: 0.15,
          ease: "power2.in",
        });
      }
    },
    { dependencies: [mobileOpen] },
  );

  // Lock body scroll while the sheet is open so the page beneath doesn't move.
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (mobileOpen) {
      const previous = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previous;
      };
    }
  }, [mobileOpen]);

  const getActiveEl = useCallback((): HTMLElement | null => {
    if (pathname === "/") return logoRef.current;
    const idx = navLinks.findIndex(
      (l) => pathname === l.href || pathname.startsWith(l.href + "/"),
    );
    return idx !== -1 ? linkRefs.current[idx] : null;
  }, [pathname]);

  const moveTo = useCallback(
    (animate: boolean) => {
      const container = containerRef.current;
      const indicator = indicatorRef.current;
      const activeEl = getActiveEl();
      if (!container || !indicator || !activeEl) return;

      const cr = container.getBoundingClientRect();
      const lr = activeEl.getBoundingClientRect();

      // Toggle transition before updating position so the
      // browser animates from the current painted left value.
      indicator.style.transition = animate
        ? "left 320ms ease-out, width 200ms ease-out"
        : "none";
      indicator.style.left = `${lr.left - cr.left}px`;
      indicator.style.width = `${lr.width}px`;
    },
    [getActiveEl],
  );

  // Place indicator at correct position before first paint — no animation.
  useLayoutEffect(() => {
    moveTo(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Slide to new position whenever the route changes.
  useEffect(() => {
    moveTo(true);
  }, [pathname, moveTo]);

  return (
    <>
    <header
      className={`sticky top-0 transition-colors duration-200 ${
        mobileOpen
          ? "z-50 border-transparent bg-transparent"
          : "z-40 border-b border-neutral-200/80 bg-white/85 backdrop-blur"
      }`}
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0">
        <div className="relative mx-auto max-w-[1280px]">
          <Crosshair position="bl" />
          <Crosshair position="br" />
        </div>
      </div>

      <div
        ref={containerRef}
        className={`relative mx-auto flex max-w-[1280px] items-center justify-between px-5 py-3.5 sm:px-8 md:px-12 ${
          mobileOpen ? "border-x border-transparent" : "border-x border-neutral-200/80"
        }`}
      >
        <Link
          ref={logoRef}
          href="/"
          aria-label="Homepage"
          className={`flex items-center transition-colors duration-200 ${mobileOpen ? "text-white" : "text-neutral-950"}`}
        >
          <span className="text-base font-medium tracking-tight">
            Elijah Kasujja
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 text-sm md:flex [&_a]:inline-flex [&_a]:min-h-10 [&_a]:items-center [&_a]:px-1 [&_a]:transition-colors [&_a]:duration-200">
          {navLinks.map((link, i) => {
            const isActive =
              pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                ref={(el) => {
                  linkRefs.current[i] = el;
                }}
                className={
                  isActive
                    ? "text-neutral-950"
                    : "text-neutral-400 hover:text-neutral-700"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop active-page indicator — slides under the nav links. */}
        <div
          ref={indicatorRef}
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[-1px] hidden h-px bg-neutral-950 md:block"
          style={{ left: 0, width: 0 }}
        />

        <div className="flex items-center gap-2">
          <a
            href="/cv.pdf"
            download="Elijah-Kasujja-CV.pdf"
            className="hidden min-h-10 items-center rounded-full border border-neutral-300 bg-white px-3.5 text-sm font-medium text-neutral-950 transition-[transform,background-color,color] duration-200 hover:bg-neutral-50 active:scale-[0.96] sm:inline-flex"
          >
            Download CV
          </a>
          <Link
            href="/contact"
            className="hidden min-h-10 items-center rounded-full bg-neutral-950 px-3.5 text-sm font-medium text-white transition-[transform,background-color,color] duration-200 hover:bg-neutral-800 active:scale-[0.96] sm:inline-flex"
          >
            Get in touch
          </Link>

          {/* Mobile hamburger — three bars that animate into an X.
              The top bar rotates 45° and slides down to the centre;
              the middle bar fades out; the bottom rotates -45° and
              slides up. Bar colour flips white when the dark menu is
              open so the X stays visible against the new background. */}
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            data-no-haptic
            onClick={() => {
              // Pair the haptic with the action: heavier for open,
              // lighter for close. Fires before setState so the cue
              // lands on the press, not after the next paint.
              haptic(mobileOpen ? "light" : "medium");
              setMobileOpen((v) => !v);
            }}
            className={`-mr-1 relative z-50 inline-flex size-10 items-center justify-center rounded-full transition active:scale-[0.96] md:hidden ${mobileOpen ? "text-white" : "text-neutral-950"}`}
          >
            <span aria-hidden="true" className="relative block h-3 w-5">
              <span
                className={`absolute left-0 right-0 top-0 h-[2px] origin-center rounded-full bg-current transition-transform duration-300 ease-out ${mobileOpen ? "translate-y-[5px] rotate-45" : ""}`}
              />
              <span
                className={`absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-current transition-opacity duration-200 ease-out ${mobileOpen ? "opacity-0" : "opacity-100"}`}
              />
              <span
                className={`absolute right-0 left-0 bottom-0 h-[2px] origin-center rounded-full bg-current transition-transform duration-300 ease-out ${mobileOpen ? "-translate-y-[5px] -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </div>
    </header>

    {/* Full-viewport mobile menu — portalled to document.body so no
        ancestor with `will-change: transform` (e.g. GlitchIntro on
        the homepage) can promote itself to a containing block and
        knock `position: fixed` off the viewport. */}
      {mounted && createPortal(
      <div
        ref={mobileNavRef}
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        style={{ visibility: "hidden", opacity: 0 }}
        className={`fixed inset-0 z-40 md:hidden ${mobileOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <div ref={bgRef} className="absolute inset-0 bg-neutral-950" />
        <div ref={sheetRef} className="relative flex h-dvh flex-col">
          {/* Spacer matching the header height so the first link doesn't
              tuck under the hamburger. The hamburger button in the
              header itself morphs into the white X — no duplicate
              close affordance needed inside the portal. */}
          <div className="h-[57px] shrink-0 border-b border-white/10" />

          <nav
            className="flex flex-1 flex-col px-5 pt-8 pb-[max(env(safe-area-inset-bottom),1.5rem)] sm:px-8"
          >
            <p
              data-menu-item
              className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500"
            >
              Menu
            </p>
            <ul role="list" className="mt-4 flex flex-col">
              {[{ href: "/", label: "Home" }, ...navLinks].map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname === link.href ||
                      pathname.startsWith(link.href + "/");
                return (
                  <li key={link.href} data-menu-item>
                    <Link
                      href={link.href}
                      className={`group flex items-center justify-between gap-6 border-b border-white/10 py-5 text-[40px] font-medium leading-[1.1] tracking-[-0.025em] transition-colors ${isActive ? "text-white" : "text-neutral-500 hover:text-white"}`}
                    >
                      <span>{link.label}</span>
                      <Icon
                        name="arrow-right"
                        size="1.1rem"
                        className={`transition-colors ${isActive ? "text-white" : "text-neutral-600 group-hover:text-white"}`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-auto flex flex-col gap-3 pt-10">
              {/* Primary CTA: invert for dark bg — white pill, dark text. */}
              <Link
                href="/contact"
                data-menu-item
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-5 text-base font-medium text-neutral-950 transition active:scale-[0.98]"
              >
                Get in touch
              </Link>
              {/* Secondary CTA: outlined, transparent on dark. */}
              <a
                href="/cv.pdf"
                download="Elijah-Kasujja-CV.pdf"
                data-menu-item
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 bg-transparent px-5 text-base font-medium text-white transition active:scale-[0.98] hover:bg-white/5"
              >
                Download CV
              </a>
              <p
                data-menu-item
                className="mt-4 font-mono text-[0.65rem] uppercase tracking-wider text-neutral-500"
              >
                Kampala · Booking June 2026
              </p>
            </div>
          </nav>
        </div>
      </div>,
      document.body,
      )}
    </>
  );
}
