/**
 * Per-slug "Up close" details: a bento of a site's moving parts, drawn as
 * live HTML with the stageshow kit. Only slugs listed here get the section.
 */
import { CassiaLodgeDetails } from "./cassia-lodge";
import { EnterpriseUgandaDetails } from "./enterprise-uganda";
import { KabojjaDetails } from "./kabojja";
import { DivinusDetails } from "./divinus";

const details: Record<string, React.ComponentType> = {
  "cassia-lodge": CassiaLodgeDetails,
  "enterprise-uganda": EnterpriseUgandaDetails,
  kabojja: KabojjaDetails,
  divinus: DivinusDetails,
};

export function hasCaseDetails(slug: string) {
  return slug in details;
}

export function CaseDetails({ slug }: { slug: string }) {
  const C = details[slug];
  return C ? <C /> : null;
}
