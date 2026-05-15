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
import { Crosshair } from "./Crosshair";

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

  // Close the mobile sheet whenever the route changes.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

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
    <header className="sticky top-0 z-40 border-b border-neutral-200/80 bg-white/85 backdrop-blur">
      <div className="pointer-events-none absolute inset-x-0 bottom-0">
        <div className="relative mx-auto max-w-[1280px]">
          <Crosshair position="bl" />
          <Crosshair position="br" />
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative mx-auto flex max-w-[1280px] items-center justify-between border-x border-neutral-200/80 px-5 py-3.5 sm:px-8 md:px-12"
      >
        <Link
          ref={logoRef}
          href="/"
          aria-label="Homepage"
          className="flex items-center text-neutral-950"
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
            download
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

          {/* Mobile hamburger — only visible below md: */}
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen((v) => !v)}
            className="-mr-1 inline-flex size-10 items-center justify-center rounded-full text-neutral-950 transition active:scale-[0.96] md:hidden"
          >
            <span
              aria-hidden="true"
              className="icon"
              style={{ fontSize: "1.1rem", lineHeight: 1 }}
            >
              {mobileOpen ? "xmark" : "bars"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile sheet — slides down under the header. Backdrop click also
          closes. Links inside automatically close on route change via the
          effect above. */}
      <div
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        className={`md:hidden ${mobileOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        {/* Backdrop */}
        <div
          aria-hidden="true"
          onClick={() => setMobileOpen(false)}
          className={`fixed inset-x-0 top-[57px] bottom-0 z-30 bg-neutral-950/30 backdrop-blur-sm transition-opacity duration-200 ${mobileOpen ? "opacity-100" : "opacity-0"}`}
        />
        {/* Sheet */}
        <div
          className={`absolute inset-x-0 top-full z-40 origin-top border-b border-neutral-200/80 bg-white shadow-[0_8px_24px_rgba(10,10,10,0.06)] transition-[transform,opacity] duration-200 ease-out ${mobileOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"}`}
        >
          <nav className="mx-auto flex max-w-[1280px] flex-col px-5 py-4 sm:px-8">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex min-h-12 items-center border-b border-neutral-100 text-lg font-medium transition-colors last:border-b-0 ${isActive ? "text-neutral-950" : "text-neutral-500 hover:text-neutral-950"}`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="mt-5 flex flex-col gap-2">
              <a
                href="/cv.pdf"
                download
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-neutral-300 bg-white px-5 text-base font-medium text-neutral-950 transition active:scale-[0.98]"
              >
                Download CV
              </a>
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-neutral-950 px-5 text-base font-medium text-white transition active:scale-[0.98]"
              >
                Get in touch
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
