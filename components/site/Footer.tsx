import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto bg-white">
      <div className="mx-auto max-w-[1280px] border-x border-neutral-200/80 px-5 py-12 sm:px-8 sm:py-16 md:px-12">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-10 md:grid-cols-12">
          <div className="col-span-2 md:col-span-5">
            <Link
              href="/"
              aria-label="Homepage"
              className="inline-flex items-center"
            >
              <span className="text-base font-medium tracking-tight">
                Elijah Kasujja
              </span>
            </Link>
            <p className="mt-4 max-w-[42ch] text-base text-neutral-500 sm:text-sm">
              Design engineer based in Kampala, Uganda. I design and build
              websites from early structure through to launch and handover.
            </p>
          </div>

          <nav className="md:col-span-3">
            <p className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500">
              Site
            </p>
            <ul
              role="list"
              className="mt-3 grid gap-0.5 text-base font-medium text-neutral-600 sm:text-sm [&_a]:inline-flex [&_a]:min-h-10 [&_a]:items-center [&_a]:transition-colors [&_a]:duration-200"
            >
              <li>
                <Link href="/work" className="hover:text-neutral-950">
                  Work
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-neutral-950">
                  About
                </Link>
              </li>
              <li>
                <Link href="/process" className="hover:text-neutral-950">
                  Process
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-neutral-950">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          <div className="md:col-span-4">
            <p className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500">
              Elsewhere
            </p>
            <ul
              role="list"
              className="mt-3 grid gap-0.5 text-base font-medium text-neutral-600 sm:text-sm [&_a]:inline-flex [&_a]:min-h-10 [&_a]:items-center [&_a]:transition-colors [&_a]:duration-200"
            >
              <li>
                <a
                  href="mailto:elijahkasujja@gmail.com"
                  className="break-all hover:text-neutral-950"
                >
                  elijahkasujja@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-neutral-950"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="/cv.pdf" download className="hover:text-neutral-950">
                  Download CV
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-200/80">
        <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-2 border-x border-neutral-200/80 px-5 py-5 font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500 sm:flex-row sm:items-center sm:px-8 sm:py-6 md:px-12">
          <span>© {new Date().getFullYear()} Elijah Kasujja</span>
          <span>Kampala · Available for new work</span>
        </div>
      </div>
    </footer>
  );
}
