import { PlatformDashboardHiFi, PlatformScorecardHiFi, PlatformSignupHiFi } from "./hifi/PlatformScreens";
import { Figure, FlowSteps, Panels } from "./figures";

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
    <div className="grid grid-cols-1 gap-4">
      <PlatformSignupHiFi />
      <Figure title="The funnel" meta="Two variants · tracked events" note="Both variants shipped on separate URLs so sales could split traffic. Page load and every button fire analytics events, so the comparison is on retention and lead conversion.">
        <FlowSteps
          highlightLast
          steps={[
            { label: "Sales link", note: "Prospect arrives with industry and email in the URL." },
            { label: "Primed landing", note: "Industry named, a line on data quality, one button. Variant A or B." },
            { label: "Relevant demo", note: "Lands on the insights view for that industry." },
            { label: "Walkthrough", note: "In-app tour of the main modules, themed to the platform." },
            { label: "Book a call", note: "Prompt after real engagement, not on arrival." },
          ]}
        />
      </Figure>
    </div>
  );
}

export function PlatformFigure({ name }: { name?: string }) {
  switch (name) {
    case "dashboard":
      return <PlatformDashboardHiFi />;
    case "families":
      return <PlatformFamilies />;
    case "signup":
      return <PlatformSignup />;
    case "scorecard":
      return <PlatformScorecardHiFi />;
    default:
      return null;
  }
}
