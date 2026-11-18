# Case-study scroll videos

Makes `/public/work/<slug>.mp4`: a 1920×1080, 60 fps scroll through a site, framed on a neutral backdrop.

1. Run the client site locally from its own code (its dev server, or a `file://` path for static HTML).
2. `node render.mjs <url> /tmp/rec/<slug> [maxSeconds] [pxPerSecond]` (preferred). This is a frame-exact render: the page's clock (JS timers, rAF, CSS animations, video) is slowed and frozen between frames, scrollY is set exactly for each 1/60 s, and one screenshot is taken per frame. The scroll moves the same few pixels every frame, so text stays readable. It takes about 4 minutes for a 30 s reel. `record.mjs` (below) is the older real-time recorder: faster, but its 30–45 fps capture judders once resampled to 60.

   Old real-time recorder: `node record.mjs <url> /tmp/rec/<slug> [maxSeconds]`. This opens headless Chrome at 1600×900 and scrolls with real wheel events, so the site's own smooth-scroll and reveal animations play. It captures timestamped screencast frames. Next.js and Astro dev badges and the Agentation toolbar are hidden. The default cap is 32 s; long one-pagers need more (EverFree used 42).
3. `./compose.sh /tmp/rec/<slug> ../../public/work/<slug>.mp4`. This puts the frames on the backdrop with rounded corners, resamples to 60 fps and encodes H.264 (crf 21, max 5 Mbps). It builds `bg.png`/`mask.png` next to the script on the first run.

Needs Google Chrome, Node 22 (built-in WebSocket), ffmpeg and Python with Pillow.

## Notes

- Several pages: pass them comma-separated (`node record.mjs http://x/,http://x/blog …`). Each gets its own hold and scroll, and the segments are joined.
- Cookie banners are hidden, not clicked, so no consent choice is made. Third-party chat pop-ups can be blocked in `setBlockedURLs`.
- Next.js dev mode often records at under 30 fps. A production build (`next build && next start`) or the deployed site runs smoother.
- Don't block `*agentation*` broadly: Next.js bundles that import it crash. Hide it with CSS instead (already done).
