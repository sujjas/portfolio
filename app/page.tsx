import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { FeaturedWork } from "@/components/site/FeaturedWork";
import { Capabilities } from "@/components/site/Capabilities";
import { About } from "@/components/site/About";
import { Process } from "@/components/site/Process";
import { CtaBand } from "@/components/site/CtaBand";
import { Footer } from "@/components/site/Footer";
import { GlitchIntro } from "@/components/site/GlitchIntro";

export default function Home() {
  return (
    <>
      {/* Header sits OUTSIDE GlitchIntro so the hamburger button isn't
          buried inside GlitchIntro's will-change:transform stacking
          context — otherwise the portalled mobile menu (z-40 at body
          level) would cover the hamburger and the morph-into-X effect
          would be invisible. GlitchIntro still wraps the rest of the
          page so the visual hit lands across the hero and below. */}
      <Header />
      <GlitchIntro>
        <main className="relative mx-auto w-full max-w-[1280px] flex-1">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-30 hidden w-px bg-neutral-200/80 md:block"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-30 hidden w-px bg-neutral-200/80 md:block"
          />
          <Hero />
          <FeaturedWork />
          <Capabilities />
          <About />
          <Process />
          <CtaBand />
        </main>
        <Footer />
      </GlitchIntro>
    </>
  );
}
