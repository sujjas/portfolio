type Props = {
  children: React.ReactNode;
};

// Shared shell for every non-home page: the same continuous vertical rails
// the home page uses, so crosshairs at section corners line up.
export function PageRails({ children }: Props) {
  return (
    <main className="relative mx-auto w-full max-w-[1280px] flex-1">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-30 w-px bg-neutral-200/80"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-30 w-px bg-neutral-200/80"
      />
      {children}
    </main>
  );
}
