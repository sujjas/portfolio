import { Block, HairLine, Wireframe } from "../primitives";
import { Figure, FlowSteps, Panels, Pipeline } from "./figures";

export function SenaHome() {
  return (
    <Wireframe
      title="Home · chat-first"
      meta="Wireframe"
      annotations={[
        { x: 400, y: 150, label: "The chat input is the primary object on the page" },
        { x: 400, y: 235, label: "Starters generated from the data this customer holds" },
        { x: 400, y: 330, label: "Attach data sources before the first message, or drag them in" },
        { x: 400, y: 470, label: "Recent reports ranked by activity, not purchase date" },
        { x: 100, y: 300, label: "Sidebar: Home, Orders, New chat, History. Collapses to a rail inside reports" },
      ]}
    >
      <Block x="20" y="20" w="160" h="560" label="" />
      <Block x="36" y="40" w="128" h="28" label="Sena" tone="dark" />
      <Block x="36" y="90" w="128" h="26" label="Home" tone="accent" />
      <Block x="36" y="124" w="128" h="26" label="Order list" />
      <Block x="36" y="158" w="128" h="26" label="New chat" />
      <Block x="36" y="192" w="128" h="26" label="Chat history" />
      <Block x="36" y="500" w="128" h="26" label="Plans" />
      <Block x="36" y="536" w="128" h="26" label="Account" />

      <text x="200" y="80" fontSize="22" fontFamily="inherit" fontWeight="600" fill="#0a0a0a">
        What do you want to find out?
      </text>
      <Block x="200" y="110" w="580" h="72" label="Ask Sena about your markets, outlets or consumers…" tone="accent" />
      <Block x="200" y="212" w="186" h="44" label="Where is share slipping?" />
      <Block x="397" y="212" w="186" h="44" label="Compare two cities" />
      <Block x="594" y="212" w="186" h="44" label="What changed this month?" />
      <HairLine y="290" label="Data sources" />
      <Block x="200" y="306" w="140" h="48" label="Consumer insight" />
      <Block x="350" y="306" w="140" h="48" label="Retail mapping" />
      <Block x="500" y="306" w="140" h="48" label="Uploaded file" />
      <Block x="650" y="306" w="130" h="48" label="+ Add source" tone="dark" />
      <HairLine y="400" label="Recent reports" />
      <Block x="200" y="420" w="280" h="120" label="Report · opened today" />
      <Block x="500" y="420" w="280" h="120" label="Report · chatted yesterday" />
    </Wireframe>
  );
}

export function SenaReport() {
  return (
    <Wireframe
      title="Inside a report · side chat"
      meta="Wireframe"
      annotations={[
        { x: 60, y: 300, label: "Sidebar collapsed to a rail; expands on hover over the content, never shifting it" },
        { x: 300, y: 60, label: "Back, report selector for super-reports, share" },
        { x: 300, y: 120, label: "Tabs for report sections with a snapshot / trending toggle" },
        { x: 300, y: 360, label: "Dashboards unchanged: same filters, titles and tooltips as before" },
        { x: 660, y: 200, label: "Chat scoped to this report. An info tooltip states the scope" },
        { x: 660, y: 540, label: "Composer stays visible on every tab of the report" },
      ]}
    >
      <Block x="20" y="20" w="60" h="560" label="" />
      <Block x="32" y="40" w="36" h="36" label="S" tone="dark" />
      <Block x="32" y="100" w="36" h="30" label="" />
      <Block x="32" y="140" w="36" h="30" label="" tone="accent" />
      <Block x="32" y="180" w="36" h="30" label="" />

      <Block x="100" y="36" w="60" h="32" label="← Back" />
      <Block x="170" y="36" w="240" h="32" label="Nigeria retail · Q2  ▾" />
      <Block x="440" y="36" w="80" h="32" label="Share" tone="dark" />
      <Block x="100" y="100" w="100" h="30" label="Overview" tone="accent" />
      <Block x="210" y="100" w="100" h="30" label="Insights" />
      <Block x="320" y="100" w="100" h="30" label="Outlets" />
      <Block x="430" y="100" w="90" h="30" label="Trend ⇄" />
      <Block x="100" y="150" w="420" h="180" label="Dashboard · hero chart (unchanged)" />
      <Block x="100" y="340" w="205" h="120" label="Chart" />
      <Block x="315" y="340" w="205" h="120" label="Chart" />
      <Block x="100" y="470" w="420" h="100" label="Table" />

      <Block x="540" y="36" w="240" h="544" label="" tone="accent" />
      <text x="556" y="66" fontSize="11" fontFamily="inherit" fontWeight="600" fill="#5b21b6">
        SENA · THIS REPORT ⓘ
      </text>
      <Block x="556" y="90" w="200" h="48" label="Why did availability drop in Lagos?" />
      <Block x="576" y="150" w="188" h="110" label="Answer with sources" />
      <Block x="556" y="280" w="200" h="40" label="Show me by outlet type" />
      <Block x="576" y="330" w="188" h="150" label="Chart + explanation" />
      <Block x="556" y="520" w="208" h="44" label="Ask about this report…" />
    </Wireframe>
  );
}

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
      return <SenaHome />;
    case "report":
      return <SenaReport />;
    case "simulation":
      return <SenaSimulation />;
    case "system":
      return <SenaSystem />;
    default:
      return null;
  }
}
