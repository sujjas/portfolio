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
      className={`relative inline-flex ${sizeClasses[size]} items-center justify-center overflow-hidden rounded-full border border-neutral-300 ${className}`}
    >
      <span className="absolute inline-flex group-hover:arrow-cycle-hover">
        <span className="icon" style={{ fontSize: "0.8rem", lineHeight: 1 }}>
          arrow-right
        </span>
      </span>
    </span>
  );
}
