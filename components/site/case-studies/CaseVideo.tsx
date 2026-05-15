"use client";

import { useEffect, useRef } from "react";

/**
 * Landscape video slot for case study pages. Plays a screen-recording of
 * the user scrolling through the live site.
 *
 * Mobile autoplay is finicky — iOS Safari and some Android browsers
 * won't fire `autoplay` reliably from the HTML attribute alone,
 * especially under Low Power Mode or on cellular. This component
 * therefore:
 *
 *  1. Sets `muted` / `playsInline` declaratively AND on the element via
 *     ref (some engines respect the JS path more reliably).
 *  2. Calls `play()` from `useEffect` after mount.
 *  3. Uses `IntersectionObserver` to pause the video when it's off-screen
 *     (saves battery on mobile when the user scrolls past it).
 *  4. Re-attempts `play()` when visibility returns or the document tab is
 *     refocused.
 *
 * The poster (cover image) is shown until the first frame is ready, so
 * the slot is never blank.
 */
export function CaseVideo({
  slug,
  poster,
  ratio = "16/9",
}: {
  slug: string;
  poster?: string;
  ratio?: "16/9" | "21/9" | "32/9";
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Belt and braces: set both attributes via JS as well as via JSX.
    video.muted = true;
    video.playsInline = true;
    video.defaultMuted = true;

    const attemptPlay = () => {
      // play() returns a Promise that rejects if the browser blocks
      // autoplay — swallow it silently and let the poster stand in.
      const result = video.play();
      if (result && typeof result.catch === "function") {
        result.catch(() => {
          /* autoplay blocked; the poster + controls fallback take over */
        });
      }
    };

    // Try immediately on mount.
    attemptPlay();

    // Pause when off-screen to save battery; resume when back in view.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            attemptPlay();
          } else {
            video.pause();
          }
        }
      },
      { threshold: 0.1 },
    );
    io.observe(video);

    // Retry when the document regains focus (e.g. user returns to the tab).
    const onVisibility = () => {
      if (document.visibilityState === "visible") attemptPlay();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const ratioClass = {
    "16/9": "aspect-[16/9]",
    "21/9": "aspect-[21/9]",
    "32/9": "aspect-[32/9]",
  }[ratio];

  return (
    <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-100 ring-1 ring-black/5">
      <div className={`relative ${ratioClass} w-full`}>
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover object-top"
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          // `auto` (not `metadata`) tells mobile browsers to fetch enough
          // of the video that the muted-autoplay path can start cleanly.
          preload="auto"
          // Single MP4 source — the .webm fallback that used to live here
          // pointed at a file that doesn't exist and caused a 404 + iOS
          // Safari falling-back issue.
          src={`/work/${slug}.mp4`}
        />
      </div>
    </div>
  );
}
