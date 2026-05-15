import { SectionCrosshairs } from "./Crosshair";

type Props = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  color?: "dark" | "light";
};

export function SectionShell({ children, className = "", id, color }: Props) {
  return (
    <section
      id={id}
      className={`relative border-b border-neutral-200/80 ${className}`}
    >
      <SectionCrosshairs color={color} />
      {children}
    </section>
  );
}
