type ArrowChipSize = 7 | 8 | 9 | 10;

const sizeClasses: Record<ArrowChipSize, string> = {
  7: "size-7",
  8: "size-8",
  9: "size-9",
  10: "size-10",
};

export function ArrowChip({
  size = 9,
  className = "",
}: {
  size?: ArrowChipSize;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`relative inline-flex shrink-0 ${sizeClasses[size]} items-center justify-center overflow-hidden rounded-full border border-neutral-300 ${className}`}
    >
      {/* Icon sits in the parent's flex centering. The hover cycle
          animation translates this span left-out then back; the parent's
          overflow-hidden clips it during the slide. No absolute
          positioning — that previously dropped the icon at (0,0) of the
          chip, outside the rounded-full clip area, which is why arrows
          weren't rendering. */}
      <span className="icon group-hover:arrow-cycle-hover" style={{ fontSize: "0.8rem", lineHeight: 1 }}>
        arrow-right
      </span>
    </span>
  );
}
