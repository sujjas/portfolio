/**
 * Landscape video slot for case study pages. Plays a screen-recording of
 * the user scrolling through the live site, falling back to the cover
 * screenshot as the `poster` image when the video isn't yet on disk.
 *
 * Drop your recording into `public/work/<slug>.mp4` (or .webm). MP4
 * H.264 + AAC plays everywhere; for smaller files prefer WebM/VP9 or
 * AV1 and ship both with `<source>` tags.
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
  const ratioClass = {
    "16/9": "aspect-[16/9]",
    "21/9": "aspect-[21/9]",
    "32/9": "aspect-[32/9]",
  }[ratio];

  return (
    <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-100 ring-1 ring-black/5">
      <div className={`relative ${ratioClass} w-full`}>
        <video
          className="absolute inset-0 h-full w-full object-cover object-top"
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src={`/work/${slug}.webm`} type="video/webm" />
          <source src={`/work/${slug}.mp4`} type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
