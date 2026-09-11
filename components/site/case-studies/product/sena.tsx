import { PrototypeFrame } from "./hifi/PrototypeFrame";

const P = "/design/sena/screens";
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
      return (
        <div>
          <PrototypeFrame src={`${P}/home.html`} width={1180} height={760} title="Sena home, interactive prototype" label="Home · type a question or pick a starter" />
          <p className="mt-4 text-xs leading-relaxed text-neutral-500">
            The static prototype from the Sena design-system repo, running live with a fictional company seeded in. Ask something and Sena answers; the reply is canned for the portfolio, the interface is the real one.
          </p>
        </div>
      );
    case "report":
      return (
        <div className="grid grid-cols-1 gap-6">
          <PrototypeFrame src={`${P}/custom-report.html`} width={1180} height={760} title="Sena report with side chat, interactive prototype" label="Inside a report · side chat, tabs, charts" />
          <PrototypeFrame src={`${P}/data-sources.html`} width={1180} height={760} title="Sena data sources, interactive prototype" label="Data sources · select to chat" />
        </div>
      );
    case "simulation":
      return <SenaSimulation />;
    case "system":
      return <SenaSystem />;
    default:
      return null;
  }
}
