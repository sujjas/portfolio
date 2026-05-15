import { SectionShell } from "./Section";

type Props = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  meta?: React.ReactNode;
};

export function PageHeader({ eyebrow, title, subtitle, meta }: Props) {
  return (
    <SectionShell>
      <div className="px-8 pt-20 pb-16 md:px-12 md:pt-28 md:pb-20">
        <p className="font-mono text-[0.75rem] uppercase tracking-wider text-neutral-500">
          {eyebrow}
        </p>
        <h1 className="mt-6 max-w-[24ch] text-[60px] font-medium leading-[60px] tracking-[-0.025em] text-neutral-950 [&_.line-soft]:text-neutral-400">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-6 max-w-[60ch] text-lg text-neutral-500">
            {subtitle}
          </p>
        ) : null}
        {meta ? <div className="mt-8">{meta}</div> : null}
      </div>
    </SectionShell>
  );
}
