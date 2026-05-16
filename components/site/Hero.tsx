"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { SectionShell } from "./Section";
import { Crosshair } from "./Crosshair";
import { ImageTrail } from "./ImageTrail";
import { caseStudies } from "@/lib/work";

const VERBS = ["design", "build", "ship"];

export function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const verbRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const verb = verbRef.current!;
      const container = containerRef.current!;

      // Measure every verb's natural width by temporarily writing it into
      // the single visible verb span. End on VERBS[0] so the page paints
      // with "design" already in place — no blank gap on load.
      const widths: number[] = [];
      for (const v of VERBS) {
        verb.textContent = v;
        widths.push(verb.offsetWidth);
      }
      verb.textContent = VERBS[0];
      gsap.set(container, { width: widths[0] });

      // Entry animation — "I", "it." and the second line slide in around
      // the already-visible "design".
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from(".hero-stamp", { opacity: 0, y: 8, duration: 0.6 })
        .from(
          ".hero-word",
          { yPercent: 110, duration: 1.1, stagger: 0.07 },
          "-=0.2",
        )
        .from(
          ".hero-side",
          { opacity: 0, y: 12, duration: 0.7, stagger: 0.08 },
          "-=0.7",
        )
        .from(
          ".hero-cta",
          { opacity: 0, y: 8, duration: 0.6, stagger: 0.08 },
          "-=0.4",
        )
        .from(
          ".hero-ticker-item",
          {
            xPercent: 220,
            opacity: 0,
            duration: 1.8,
            ease: "expo.out",
            stagger: 0.06,
          },
          "-=0.2",
        );

      // Continuous loop: design → build → ship → design → build → ship …
      // Each verb holds, then slides up out while the next slides up in
      // from below; the container width animates to hug the next word.
      let currentIdx = 0;

      const cycleOnce = () => {
        const nextIdx = (currentIdx + 1) % VERBS.length;

        gsap
          .timeline({
            onComplete: () => {
              currentIdx = nextIdx;
              gsap.delayedCall(1.4, cycleOnce);
            },
          })
          .to(
            verb,
            {
              yPercent: -100,
              autoAlpha: 0,
              duration: 0.32,
              ease: "power2.in",
            },
            0,
          )
          .to(
            container,
            {
              width: widths[nextIdx],
              duration: 0.6,
              ease: "power3.inOut",
            },
            0,
          )
          .call(() => {
            verb.textContent = VERBS[nextIdx];
          })
          .set(verb, { yPercent: 100, autoAlpha: 0 })
          .to(verb, {
            yPercent: 0,
            autoAlpha: 1,
            duration: 0.32,
            ease: "power2.out",
          });
      };

      gsap.delayedCall(1.6, cycleOnce);
    },
    { scope: stageRef },
  );

  return (
    <SectionShell>
      <div ref={stageRef}>
      <div
        ref={root}
        className="relative px-5 pt-16 pb-12 sm:px-8 sm:pt-20 sm:pb-16 md:px-12 md:pt-28 md:pb-24"
      >
        {/* Image trail — follows the cursor across the hero with project
            thumbnails. Listens on the section itself (the `root` ref) since
            the trail layer is pointer-events:none so the CTAs stay clickable. */}
        <ImageTrail
          items={caseStudies.map((c) => c.cover)}
          variant={1}
          eventTargetRef={root}
        />
        <div className="mx-auto flex max-w-[80ch] flex-col items-center text-center">
          <p className="hero-stamp inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-3 py-1 font-mono text-[0.7rem] uppercase tracking-wider text-neutral-700">
            <span
              aria-hidden="true"
              className="relative inline-flex size-2"
            >
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500 opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            Available · Kampala · Booking June 2026
          </p>

          <h1 className="mt-6 text-[40px] font-medium leading-[44px] tracking-[-0.025em] text-neutral-950 sm:mt-8 sm:text-[52px] sm:leading-[56px] md:text-[60px] md:leading-[60px] [&_.line-mask]:block [&_.line-mask]:overflow-hidden [&_.line-mask]:pb-3 [&_.line-mask]:-mb-3 [&_.line-mask:last-child]:mb-0">
            <span className="line-mask">
              <span className="inline-flex items-baseline gap-3">
                <span className="hero-word">I</span>
                {/* Verb container — line-height tracks the h1's leading per
                    breakpoint via inline CSS variables. The 1.2× height
                    gives Inter's "g" descender clearance the line-mask
                    alone would clip. */}
                <span
                  ref={containerRef}
                  className="relative inline-block h-[52px] overflow-hidden align-baseline leading-[44px] whitespace-nowrap sm:h-[64px] sm:leading-[56px] md:h-[72px] md:leading-[60px]"
                >
                  <span
                    ref={verbRef}
                    className="inline-block leading-[44px] sm:leading-[56px] md:leading-[60px]"
                  >
                    design
                  </span>
                </span>
                <span className="hero-word">it.</span>
              </span>
            </span>
            <span className="line-mask">
              <span className="hero-word inline-block">
                From first sketch to final handover.
              </span>
            </span>
          </h1>

          <p className="hero-side mt-6 max-w-[58ch] text-base text-neutral-500 sm:mt-8 sm:text-lg">
            By day I lead product design at Rwazi. Alongside my product work,
            I design and build websites with clear structure, thoughtful CMS
            setup and a clean handover.
          </p>

          <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
            <Link
              href="/work"
              className="hero-cta inline-flex min-h-12 items-center justify-center rounded-full bg-neutral-950 px-5 py-3 text-base font-medium text-white transition-[transform,background-color,color] duration-200 hover:bg-neutral-800 active:scale-[0.96] sm:min-h-10 sm:py-2.5 sm:text-sm"
            >
              See the work
            </Link>
            <Link
              href="/contact"
              className="hero-cta inline-flex min-h-12 items-center justify-center rounded-full border border-neutral-300 bg-white px-5 py-3 text-base font-medium text-neutral-950 transition-[transform,background-color,color] duration-200 hover:bg-neutral-50 active:scale-[0.96] sm:min-h-10 sm:py-2.5 sm:text-sm"
            >
              Send a brief
            </Link>
          </div>
        </div>
      </div>

      <div className="hero-ticker relative border-t border-neutral-200/80 bg-white">
        <Crosshair position="tl" />
        <Crosshair position="tr" />
        <div className="px-5 py-8 sm:px-8 sm:py-10 md:px-12 md:py-12">
          <p className="text-center font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500">
            Recent clients
          </p>
          {/* Marquee — fade mask + animation applied via inline styles so
              they bypass any cascade-layer quirks. The mask is ~80px on
              each side, well inside the px-8/md:px-12 padding around the
              ticker, so the soft fade never reaches the section rails. */}
          <div
            className="group/ticker relative mt-7 overflow-hidden"
            aria-label="Recent clients"
            style={{
              maskImage:
                "linear-gradient(to right, transparent 0, black 80px, black calc(100% - 80px), transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0, black 80px, black calc(100% - 80px), transparent 100%)",
            }}
          >
            <ul
              role="list"
              className="flex w-max items-center gap-14 group-hover/ticker:[animation-play-state:paused] motion-reduce:animate-none"
              style={{
                animation: "client-ticker-scroll 42s linear infinite",
                willChange: "transform",
              }}
            >
              {/* Two consecutive copies of the logo list — the keyframe
                  translates -50%, snapping back to copy one seamlessly. */}
              {[...caseStudies, ...caseStudies].map((c, i) => {
                const isClone = i >= caseStudies.length;
                return (
                  <li
                    key={`${c.slug}-${i}`}
                    className="hero-ticker-item flex h-9 w-44 shrink-0 items-center justify-center"
                    aria-hidden={isClone || undefined}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        c.logo
                          ? `${c.logo}?v=2`
                          : `https://assets.ui.sh/marks/${(i % 8) + 1}.svg?color=neutral-700&textColor=neutral-700&text=${encodeURIComponent(
                              c.client,
                            )}&font=inter`
                      }
                      alt={isClone ? "" : `${c.client} logo`}
                      loading="lazy"
                      decoding="async"
                      className="opacity-70 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        width: "auto",
                        height: "auto",
                        objectFit: "contain",
                        // Opt out of the global `img { outline: 1px solid
                        // rgba(0,0,0,0.1) }` rule in globals.css — that rule
                        // exists to frame case-study screenshots, but here
                        // it was drawing visible boxes around every logo.
                        outline: "none",
                        // Aerocruise's source has heavy padding around its
                        // mark, so contain-fit renders it much smaller than
                        // the others. A 1.8× scale brings it to a visually
                        // comparable weight without re-cropping the file.
                        transform:
                          c.slug === "aerocruise" ? "scale(1.8)" : undefined,
                        transformOrigin: "center",
                      }}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
      </div>
    </SectionShell>
  );
}
