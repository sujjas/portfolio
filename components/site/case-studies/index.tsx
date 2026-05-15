/**
 * Per-slug dispatcher for case study artifacts. The detail page calls
 * <CaseSitemap slug={slug} /> and <CaseWireframe slug={slug} /> — this
 * file resolves the right component for each.
 */
import {
  EnterpriseUgandaSitemap,
  EnterpriseUgandaWireframe,
} from "./enterprise-uganda";
import {
  SpaceForWildlifeSitemap,
  SpaceForWildlifeWireframe,
} from "./space-for-wildlife";
import {
  GravitasSitemap,
  GravitasWireframe,
} from "./gravitas-leadership-institute";
import { AerocruiseSitemap, AerocruiseWireframe } from "./aerocruise";
import { KabojjaSitemap, KabojjaWireframe } from "./kabojja";
import { WithelaSitemap, WithelaWireframe } from "./withela";
import { AyneSitemap, AyneWireframe } from "./ayne";
import { DivinusSitemap } from "./divinus/Sitemap";
import {
  DivinusHomeWireframe,
  DivinusDivisionWireframe,
} from "./divinus/Wireframes";

const sitemaps: Record<string, React.ComponentType> = {
  "enterprise-uganda": EnterpriseUgandaSitemap,
  "space-for-wildlife": SpaceForWildlifeSitemap,
  "gravitas-leadership-institute": GravitasSitemap,
  aerocruise: AerocruiseSitemap,
  kabojja: KabojjaSitemap,
  withela: WithelaSitemap,
  ayne: AyneSitemap,
  divinus: DivinusSitemap,
};

const wireframes: Record<string, React.ComponentType> = {
  "enterprise-uganda": EnterpriseUgandaWireframe,
  "space-for-wildlife": SpaceForWildlifeWireframe,
  "gravitas-leadership-institute": GravitasWireframe,
  aerocruise: AerocruiseWireframe,
  kabojja: KabojjaWireframe,
  withela: WithelaWireframe,
  ayne: AyneWireframe,
  // Divinus historically had two wireframes; keep both visible.
  divinus: function DivinusBoth() {
    return (
      <div className="grid grid-cols-1 gap-5">
        <DivinusHomeWireframe />
        <DivinusDivisionWireframe />
      </div>
    );
  },
};

export function CaseSitemap({ slug }: { slug: string }) {
  const C = sitemaps[slug];
  if (!C) return null;
  return <C />;
}

export function CaseWireframe({ slug }: { slug: string }) {
  const C = wireframes[slug];
  if (!C) return null;
  return <C />;
}
