"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useEffect, useLayoutEffect, useCallback } from "react";
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
        className="relative mx-auto flex max-w-[1280px] items-center justify-between border-x border-neutral-200/80 px-8 py-3.5 md:px-12"
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

        <nav className="hidden items-center gap-7 text-sm md:flex [&_a]:inline-flex [&_a]:min-h-10 [&_a]:items-center [&_a]:px-1 [&_a]:transition-colors [&_a]:duration-200">
          {navLinks.map((link, i) => {
            const isActive =
              pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                ref={(el) => { linkRefs.current[i] = el; }}
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

        {/* Indicator — position driven directly via ref, never via React state */}
        <div
          ref={indicatorRef}
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[-1px] h-px bg-neutral-950"
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
            className="inline-flex min-h-10 items-center rounded-full bg-neutral-950 px-3.5 text-sm font-medium text-white transition-[transform,background-color,color] duration-200 hover:bg-neutral-800 active:scale-[0.96]"
          >
            Get in touch
          </Link>
        </div>
      </div>
    </header>
  );
}
