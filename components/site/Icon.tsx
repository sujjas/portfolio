type IconProps = {
  name: string;
  className?: string;
  size?: string;
};

export function Icon({ name, className = "", size = "1em" }: IconProps) {
  return (
    <span
      aria-hidden="true"
      className={`icon shrink-0 ${className}`}
      style={{
        fontSize: size,
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
      }}
    >
      {name}
    </span>
  );
}
