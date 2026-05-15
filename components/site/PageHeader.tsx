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
      <div className="px-5 pt-16 pb-12 sm:px-8 sm:pt-20 sm:pb-16 md:px-12 md:pt-28 md:pb-20">
        <p className="font-mono text-[0.75rem] uppercase tracking-wider text-neutral-500">
          {eyebrow}
        </p>
        <h1 className="mt-6 max-w-[24ch] text-[40px] font-medium leading-[44px] tracking-[-0.025em] text-neutral-950 sm:text-[52px] sm:leading-[56px] md:text-[60px] md:leading-[60px] [&_.line-soft]:text-neutral-400">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-5 max-w-[60ch] text-base text-neutral-500 sm:mt-6 sm:text-lg">
            {subtitle}
          </p>
        ) : null}
        {meta ? <div className="mt-6 sm:mt-8">{meta}</div> : null}
      </div>
    </SectionShell>
  );
}
