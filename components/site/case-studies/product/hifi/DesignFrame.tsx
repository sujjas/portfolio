/* eslint-disable @next/next/no-img-element */

/**
 * A design frame exported from Figma at 3x, shown at phone proportions.
 * Served from /design (behind the preview gate). WebP keeps the file small;
 * the 3x export keeps it sharp on retina screens.
 */
export function DesignFrame({
  src,
  alt,
  label,
  ratio = "393 / 852",
}: {
  src: string;
  alt: string;
  label?: string;
  ratio?: string;
}) {
  return (
    <figure className="m-0">
      <div
        className="overflow-hidden rounded-[9%/4.2%] border border-neutral-300 bg-neutral-100 ring-1 ring-black/5"
        style={{ aspectRatio: ratio }}
      >
        <img src={src} alt={alt} loading="lazy" decoding="async" className="block h-full w-full object-cover" />
      </div>
      {label ? (
        <figcaption className="mt-3 text-center font-mono text-[0.65rem] uppercase tracking-wider text-neutral-500">
          {label}
        </figcaption>
      ) : null}
    </figure>
  );
}
