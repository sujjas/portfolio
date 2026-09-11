import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PageRails } from "@/components/site/PageRails";
import { PageHeader } from "@/components/site/PageHeader";
import { SectionShell } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { ArrowChip } from "@/components/site/ArrowChip";
import { productCaseStudies } from "@/lib/product-work";

export const metadata: Metadata = {
  title: "Product work — Elijah Kasujja",
  description: "Product design case studies from Rwazi: Ela Budget, Sena, Ela and the customer platform.",
  robots: { index: false, follow: false, noarchive: true },
};

export default function ProductIndexPage() {
  return (
    <>
      <Header />
      <PageRails>
        <PageHeader
          eyebrow="Product work · Private preview"
          title="Product design at Rwazi."
          subtitle="End-to-end product work: the problem, the evidence, the trade-offs and what shipped. This section is a private preview and is not linked from the public site."
        />

        <SectionShell>
          <Reveal individual className="px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-28">
            <ol role="list" className="grid grid-cols-1 gap-6">
              {productCaseStudies.map((c, i) => (
                <li key={c.slug}>
                  <Link
                    href={`/product/${c.slug}`}
                    className="group grid grid-cols-1 gap-6 rounded-3xl border border-neutral-200 bg-white p-6 ring-1 ring-black/5 transition-colors duration-200 hover:bg-neutral-50/60 sm:p-8 md:grid-cols-12 md:gap-10 md:p-10"
                  >
                    <div className="flex items-start justify-between md:col-span-2 md:block">
                      <p className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500 tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </p>
                      <div className="md:hidden">
                        <ArrowChip size={10} />
                      </div>
                    </div>
                    <div className="md:col-span-8">
                      <div className="flex items-center gap-3">
                        {c.logo ? (
                          <Image
                            src={c.logo}
                            alt=""
                            width={24}
                            height={24}
                            className="h-6 w-6 rounded object-contain"
                            unoptimized
                          />
                        ) : null}
                        <h2 className="text-[28px] font-medium leading-[34px] tracking-[-0.025em] text-neutral-950 sm:text-[36px] sm:leading-10">
                          {c.name}
                        </h2>
                      </div>
                      <p className="mt-3 max-w-[60ch] text-base text-neutral-500">{c.description}</p>
                      <p className="mt-4 font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500">
                        {c.snapshot.timeline}
                      </p>
                    </div>
                    <div className="hidden md:col-span-2 md:flex md:items-start md:justify-end">
                      <ArrowChip size={10} />
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
            <p className="mt-10 max-w-[60ch] text-sm text-neutral-500">
              Sena, the Rwazi customer platform, Ela mobile and Ela web are being written next.
            </p>
          </Reveal>
        </SectionShell>
      </PageRails>
      <Footer />
    </>
  );
}
