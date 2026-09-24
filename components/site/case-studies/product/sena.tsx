import { PrototypeFrame } from "./hifi/PrototypeFrame";

const M = "/design/sena-mvp/index.html";
/** Static build of the live SvelteKit app, re-based to this subpath. */
const L = "/design/sena-live";
import { Figure, FlowSteps, Panels, Pipeline } from "./figures";

export function SenaSimulation() {
  return (
    <Figure
      title="Simulation mode · prototype"
      meta="Decision → target → proposal → paths"
      note="Assumptions are external beliefs the user can adjust; actions are internal moves with a cost. Paths to the target are priced, cheapest first. When the data is too thin to support a path, the confidence card says so instead of pretending."
    >
      <FlowSteps
        highlightLast
        steps={[
          { label: "Which decision?", note: "Budget allocation, launch timing, pricing response, a target, or defending share." },
          { label: "What target?", note: "Skipped when the opening message already carries one." },
          { label: "Researched proposal", note: "Up to four assumptions with ranges and sources, three costed actions. React, do not brainstorm." },
          { label: "The argument", note: "Chart, target pill, assumptions, actions, paths to target with a price, confidence." },
          { label: "Presentation", note: "One button builds an editable decision memo: verdict, plan, confidence, sources, method." },
        ]}
      />
    </Figure>
  );
}

export function SenaSystem() {
  return (
    <Figure
      title="Design system pipeline"
      meta="One source, three surfaces"
      note="A verifier resolves every variable chain and proves each generated value equals the previous hand-written CSS in light and dark mode. Storybook redeploys on merge. The Figma push is idempotent and checks for drift first."
    >
      <Pipeline
        nodes={[
          { label: "Tokens · JSON", sub: "Primitives, base, light, dark", tone: "dark" },
          { label: "Generated CSS", sub: "Used by the app; never hand-edited" },
          { label: "Storybook", sub: "Foundations rendered from the JSON", tone: "accent" },
          { label: "Figma variables", sub: "Modes, scopes, code syntax", tone: "accent" },
        ]}
      />
      <div className="mt-4">
        <Panels
          cols={4}
          items={[
            { label: "Colour", title: "138 primitives, 63 semantic", body: "Light and dark as a sparse overlay: only what dark changes." },
            { label: "Type", title: "17 text styles", body: "Derived from the app's utility classes, so names match code." },
            { label: "Effects", title: "9 effect styles", body: "Elevation tokens that render in both modes." },
            { label: "Components", title: "6 core, fully bound", body: "Button, field, checkbox, tabs, search, dropdown. Zero unbound paints." },
          ]}
        />
      </div>
    </Figure>
  );
}

export function SenaFigure({ name }: { name?: string }) {
  switch (name) {
    case "home":
      // Two versions of the same screen, newest first: the flagship the
      // product runs on today (a static build of the real SvelteKit app)
      // above the first MVP it grew out of.
      return (
        <div className="grid grid-cols-1 gap-8">
          <div>
            <PrototypeFrame src={`${L}/home`} width={1440} height={1024} title="Sena flagship, home, interactive" label="Flagship · home. Agents, starters drawn from the customer's own data, and the Discover set" />
            <p className="mt-4 text-xs leading-relaxed text-neutral-500">
              The product as it stands, running here as a static build of the real app: the same components, tokens and copy that ship. Click through the sidebar; anything that needs a live model or a signed-in account is inert.
            </p>
          </div>
          <div>
            <PrototypeFrame src={`${M}?screen=home`} width={1440} height={1024} title="Sena first MVP, home, interactive" label="First MVP · home. Select reports, ask a question, open a recent report" />
            <p className="mt-4 text-xs leading-relaxed text-neutral-500">
              Where it started. The first MVP, rebuilt from the Figma file as a working prototype: chat as the home page, chats scoped to reports, and the order list underneath.
            </p>
          </div>
        </div>
      );
    case "report":
      return (
        <div className="grid grid-cols-1 gap-6">
          <PrototypeFrame src={`${M}?screen=report`} width={1591} height={1024} title="Sena first MVP, report view with side chat" label="First MVP · inside a report. Sidebar collapses to a rail and expands on hover" />
          <PrototypeFrame src={`${M}?screen=orders`} width={1440} height={1024} title="Sena first MVP, order list" label="First MVP · order list. Search, then open a row" />
        </div>
      );
    case "simulation":
      return (
        <div className="grid grid-cols-1 gap-8">
          <PrototypeFrame src={`${L}/simulation`} width={1440} height={1024} title="Sena flagship, revenue simulation, interactive" label="Flagship · a simulation. Move a lever and the projection, the paths and the confidence all answer" />
          <SenaSimulation />
        </div>
      );
    case "system":
      return <SenaSystem />;
    default:
      return null;
  }
}
