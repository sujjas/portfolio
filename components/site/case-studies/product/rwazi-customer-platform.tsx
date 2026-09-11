import { Block, HairLine, Wireframe } from "../primitives";
import { Figure, FlowSteps, Panels } from "./figures";

export function PlatformDashboard() {
  return (
    <Wireframe
      title="Report dashboard · hierarchy"
      meta="Wireframe"
      annotations={[
        { x: 400, y: 60, label: "One consistent filter bar: market, period, segment" },
        { x: 400, y: 200, label: "Hero summary first: the number that matters, labelled, with context" },
        { x: 200, y: 380, label: "Supporting charts sized from one grid, same label treatment" },
        { x: 400, y: 530, label: "Tables last, with defined empty and overflow states" },
      ]}
    >
      <Block x="20" y="20" w="140" h="36" label="Report name" tone="dark" />
      <Block x="180" y="20" w="160" h="36" label="Market ▾" />
      <Block x="350" y="20" w="160" h="36" label="Period ▾" />
      <Block x="520" y="20" w="160" h="36" label="Segment ▾" />
      <Block x="690" y="20" w="90" h="36" label="Export" />
      <HairLine y="80" label="Summary" />
      <Block x="20" y="100" w="370" h="200" label="Hero · headline metric + trend" tone="accent" />
      <Block x="410" y="100" w="180" h="95" label="KPI" />
      <Block x="600" y="100" w="180" h="95" label="KPI" />
      <Block x="410" y="205" w="180" h="95" label="KPI" />
      <Block x="600" y="205" w="180" h="95" label="KPI" />
      <HairLine y="330" label="Detail" />
      <Block x="20" y="350" w="245" h="130" label="Chart" />
      <Block x="277" y="350" w="245" h="130" label="Chart" />
      <Block x="535" y="350" w="245" h="130" label="Chart" />
      <HairLine y="505" label="Table" />
      <Block x="20" y="520" w="760" h="60" label="Table · sticky header, truncation rules, empty state" />
    </Wireframe>
  );
}

export function PlatformFamilies() {
  return (
    <Figure
      title="Visualisation families"
      meta="4 families · defaults and edge cases"
      note="Each family has a default chart, an alternative, and rules for long labels, sparse data and single values. Colours are tints of a small set with a grey scale built for light and dark."
    >
      <Panels
        cols={4}
        items={[
          { label: "Family 01", title: "Number vs number", body: "Scatter or paired bars. Rule: equal axes when units match." },
          { label: "Family 02", title: "Long text vs number", body: "Horizontal bars, labels left, truncated with full text on hover." },
          { label: "Family 03", title: "Percentages", body: "Stacked or donut; never both on one card. Always show the base." },
          { label: "Family 04", title: "Short text vs number", body: "Vertical bars or columns; sort by value unless order has meaning." },
        ]}
      />
    </Figure>
  );
}

export function PlatformSignup() {
  return (
    <Figure
      title="Self-serve sign-up"
      meta="Two variants · tracked events"
      note="Both variants shipped on separate URLs so sales could split traffic. Page load and every button fire analytics events, so the comparison is on retention and lead conversion, not taste."
    >
      <FlowSteps
        highlightLast
        steps={[
          { label: "Sales link", note: "Prospect arrives with industry and email in the URL." },
          { label: "Primed landing", note: "Industry named, a line on data quality, one button. Variant A or B." },
          { label: "Relevant demo", note: "Lands on the insights view for that industry, not a generic map." },
          { label: "Walkthrough", note: "In-app tour of the main modules, themed to the platform." },
          { label: "Book a call", note: "Prompt after real engagement, not on arrival." },
        ]}
      />
    </Figure>
  );
}

export function PlatformScorecard() {
  return (
    <Wireframe
      title="Brand scorecard · concept"
      meta="Wireframe"
      annotations={[
        { x: 160, y: 200, label: "One overall score, an average of the category sub-scores" },
        { x: 520, y: 150, label: "Each category with its own score and the metric driving it" },
        { x: 520, y: 400, label: "See detail: how the score is calculated, in plain language" },
        { x: 400, y: 540, label: "Next actions on the platform, triggered by weak categories" },
      ]}
    >
      <Block x="20" y="20" w="300" h="36" label="Brand scorecard" tone="dark" />
      <Block x="20" y="80" w="300" h="260" label="" tone="accent" />
      <text x="170" y="200" textAnchor="middle" fontSize="56" fontFamily="inherit" fontWeight="600" fill="#5b21b6">
        72
      </text>
      <text x="170" y="230" textAnchor="middle" fontSize="12" fontFamily="inherit" fill="#5b21b6">
        Overall · out of 100
      </text>
      <Block x="340" y="80" w="215" h="120" label="Affinity · 81" />
      <Block x="565" y="80" w="215" h="120" label="Availability · 64" />
      <Block x="340" y="210" w="215" h="120" label="Churn risk · 58" />
      <Block x="565" y="210" w="215" h="120" label="Price position · 85" />
      <Block x="340" y="350" w="440" h="110" label="See detail · how this is calculated" />
      <HairLine y="490" label="Next actions" />
      <Block x="20" y="510" w="245" h="60" label="Run a consumer insight" />
      <Block x="277" y="510" w="245" h="60" label="Order retail mapping" tone="dark" />
      <Block x="535" y="510" w="245" h="60" label="Compare to category" />
    </Wireframe>
  );
}

export function PlatformFigure({ name }: { name?: string }) {
  switch (name) {
    case "dashboard":
      return <PlatformDashboard />;
    case "families":
      return <PlatformFamilies />;
    case "signup":
      return <PlatformSignup />;
    case "scorecard":
      return <PlatformScorecard />;
    default:
      return null;
  }
}
