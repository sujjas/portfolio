import { PrototypeFrame } from "./hifi/PrototypeFrame";

/**
 * Sena figures, all live HTML behind the preview gate:
 *   - /design/sena-mvp      the first MVP, rebuilt from Figma node 85:377
 *   - /design/sena/design-system  the design system's own documentation site
 *   - /design/sena-live     a static build of the flagship SvelteKit app,
 *                           re-based to this subpath (see next.config.ts)
 */

const M = "/design/sena-mvp/index.html";
const DS = "/design/sena/design-system/index.html";
const L = "/design/sena-live";

export function SenaFigure({ name }: { name?: string }) {
  switch (name) {
    case "mvp-home":
      return (
        <PrototypeFrame
          src={`${M}?screen=home`}
          width={1440}
          height={1024}
          title="Sena first MVP, home, interactive"
          label="First MVP · home. Select reports, ask a question, open a recent report"
        />
      );
    case "mvp-report":
      return (
        <PrototypeFrame
          src={`${M}?screen=report`}
          width={1591}
          height={1024}
          title="Sena first MVP, report view with side chat"
          label="First MVP · inside a report. Hover the rail to open the sidebar"
        />
      );
    case "brand":
      return (
        <PrototypeFrame
          src={DS}
          width={1280}
          height={860}
          title="Sena Design System documentation, interactive"
          label="Sena Design System v1.0 · browse colours, type and components"
        />
      );
    case "flagship":
      return (
        <div className="grid grid-cols-1 gap-8">
          <PrototypeFrame
            src={`${L}/home`}
            width={1440}
            height={1024}
            title="Sena flagship, home, interactive"
            label="Flagship · home"
          />
          <PrototypeFrame
            src={`${L}/simulation`}
            width={1440}
            height={1024}
            title="Sena flagship, revenue simulation, interactive"
            label="Flagship · a revenue simulation. Move a lever"
          />
        </div>
      );
    default:
      return null;
  }
}
