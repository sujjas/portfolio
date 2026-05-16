import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PageRails } from "@/components/site/PageRails";
import { PageHeader } from "@/components/site/PageHeader";
import { SectionShell } from "@/components/site/Section";
import { Icon } from "@/components/site/Icon";
import { ArrowChip } from "@/components/site/ArrowChip";
import { ContactForm } from "@/components/site/ContactForm";
import { Reveal } from "@/components/site/Reveal";

export const metadata: Metadata = {
  title: "Contact — Elijah Kasujja",
  description:
    "Send a project brief or get in touch. I usually reply within one to two working days.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <PageRails>
        <PageHeader
          eyebrow="Contact"
          title="Send a brief or say hello."
          subtitle="If you already have a timeline, some references, or a rough sense of what you need, send them through. It helps me respond with something useful."
          meta={
            <dl className="flex flex-wrap items-start gap-x-8 gap-y-5 sm:gap-x-12">
              <Meta label="Email" value="elijahkasujja@gmail.com" />
              <Meta label="Based" value="Kampala · GMT+3" />
              <Meta label="Reply time" value="1 to 2 working days" />
              <Meta label="Booking" value="From June 2026" />
            </dl>
          }
        />

        <SectionShell>
          <div className="px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-28">
            <Reveal stagger className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5">
                <div className="lg:sticky lg:top-32">
                  <p className="font-mono text-[0.75rem] uppercase tracking-wider text-neutral-500">
                    Direct
                  </p>
                  <h2 className="mt-4 max-w-[20ch] text-[28px] font-medium leading-[34px] tracking-[-0.025em] text-neutral-950 sm:text-[36px] sm:leading-10">
                    Prefer email?{" "}
                    <span className="text-neutral-400">
                      Reach me directly.
                    </span>
                  </h2>
                  <ul role="list" className="mt-8 divide-y divide-neutral-950/5 sm:mt-10">
                    {[
                      { icon: "envelope", label: "Email", value: "elijahkasujja@gmail.com", href: "mailto:elijahkasujja@gmail.com" },
                      { icon: "phone", label: "Phone", value: "+256 759 561506", href: "tel:+256759561506" },
                      { icon: "linkedin", label: "LinkedIn", value: "linkedin.com/in/elijah-kasujja", href: "https://www.linkedin.com/" },
                      { icon: "file-arrow-down", label: "CV", value: "Download (PDF)", href: "/cv.pdf", download: "Elijah-Kasujja-CV.pdf" },
                    ].map(({ icon, label, value, href, download }) => (
                      <li key={label}>
                        <a
                          href={href}
                          download={download}
                          target={download || href.startsWith("mailto:") || href.startsWith("tel:") ? undefined : "_blank"}
                          rel={download || href.startsWith("mailto:") || href.startsWith("tel:") ? undefined : "noreferrer"}
                          className="group flex min-h-[64px] items-center justify-between gap-4 py-4 sm:py-5"
                        >
                          <div className="flex min-w-0 items-center gap-4">
                            {icon === "linkedin" ? (
                              <LinkedInIcon className="shrink-0 text-neutral-400" />
                            ) : (
                              <Icon name={icon} size="1rem" className="text-neutral-400" />
                            )}
                            <div className="min-w-0">
                              <p className="font-mono text-[0.65rem] uppercase tracking-wider text-neutral-400">{label}</p>
                              <p className="mt-0.5 truncate text-base font-medium text-neutral-950 group-hover:text-neutral-600 transition-colors duration-200">{value}</p>
                            </div>
                          </div>
                          <ArrowChip size={8} />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="lg:col-span-7">
                <p className="font-mono text-[0.75rem] uppercase tracking-wider text-neutral-500">
                  Brief form
                </p>
                <h2 className="mt-4 max-w-[26ch] text-[28px] font-medium leading-[34px] tracking-[-0.025em] text-neutral-950 sm:text-[36px] sm:leading-10">
                  Tell me about your project.
                </h2>
                <div className="mt-8 sm:mt-10">
                  <ContactForm />
                </div>
              </div>
            </Reveal>
          </div>
        </SectionShell>
      </PageRails>
      <Footer />
    </>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500">
        {label}
      </dt>
      <dd className="mt-1 text-base font-medium text-neutral-950 sm:text-sm">{value}</dd>
    </div>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      style={{ width: "1.1rem", height: "1.1rem", flexShrink: 0 }}
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function Channel({
  icon,
  label,
  value,
  href,
  download,
}: {
  icon: string;
  label: string;
  value: string;
  href: string;
  download?: boolean;
}) {
  return (
    <li>
      <a
        href={href}
        download={download}
        target={download || href.startsWith("mailto:") || href.startsWith("tel:") ? undefined : "_blank"}
        rel={download || href.startsWith("mailto:") || href.startsWith("tel:") ? undefined : "noreferrer"}
        className="group flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-5 ring-1 ring-black/5 transition-colors duration-200 hover:bg-neutral-50"
      >
        <div className="flex items-center gap-4">
          {icon === "linkedin" ? (
            <LinkedInIcon className="text-neutral-500" />
          ) : (
            <Icon name={icon} size="1.1rem" className="text-neutral-500" />
          )}
          <div>
            <p className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500">
              {label}
            </p>
            <p className="mt-1 text-base font-medium text-neutral-950">
              {value}
            </p>
          </div>
        </div>
        <ArrowChip size={8} />
      </a>
    </li>
  );
}
