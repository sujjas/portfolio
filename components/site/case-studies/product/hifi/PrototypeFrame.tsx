"use client";

import { ScaledFrame } from "./Frame";

/**
 * Embeds a real prototype page from the product's own repo (copied under
 * /public/design/…, served behind the same preview gate). The design system
 * CSS, fonts, icons and JS are the production prototype's, and the frame is
 * interactive: viewers can click through the flow.
 */
export function PrototypeFrame({
  src,
  width = 390,
  height = 844,
  label,
  title,
}: {
  src: string;
  width?: number;
  height?: number;
  label?: string;
  title: string;
}) {
  return (
    <div>
      <ScaledFrame width={width} height={height} className={width < 500 ? "!rounded-[48px] !border-neutral-300" : ""}>
        <iframe
          src={src}
          title={title}
          width={width}
          height={height}
          loading="lazy"
          style={{ border: 0, display: "block", width, height, background: "#eef1ef" }}
        />
      </ScaledFrame>
      {label ? (
        <p className="mt-3 text-center font-mono text-[0.65rem] uppercase tracking-wider text-neutral-500">{label}</p>
      ) : null}
    </div>
  );
}
