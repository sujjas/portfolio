import { PrototypeFrame } from "./hifi/PrototypeFrame";

/**
 * Conversational Logs figures. Every screen is the real Ela prototype
 * (design-system HTML), not an export. log-detail.html takes deep links so a
 * frame can open on a given widget or state: `open=1` opens the log, `q=N`
 * answers the first N questions, `state=snag` shows the failure path.
 */

const P = "/design/ela/mobile-prototype";
const rover = `${P}/log-detail.html?log=rover&live=0`;

function LogsFlow() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <PrototypeFrame src={`${P}/logs.html`} title="Ela logs list" label="Logs · tap the first card" />
      <PrototypeFrame src={rover} title="Rover or Thumbtack log, interactive" label="A log · press Start now" />
      <PrototypeFrame src={`${P}/log-detail.html?log=store-observations&live=0`} title="Store observations upload log" label="An upload log · photo checks" />
    </div>
  );
}

const widgets = [
  { q: 0, label: "Text" },
  { q: 1, label: "Single choice" },
  { q: 2, label: "Multiple choice" },
  { q: 3, label: "Rating · drag the heart" },
];

function LogsWidgets() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
      {widgets.map((w) => (
        <PrototypeFrame
          key={w.q}
          src={`${rover}&open=1&q=${w.q}`}
          title={`Conversational log, ${w.label.toLowerCase()} widget`}
          label={w.label}
        />
      ))}
    </div>
  );
}

function LogsLinking() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
      <div className="md:col-span-4">
        <PrototypeFrame src={`${rover}&flow=recap&style=topic`} title="Log completion linked to a topic" label="Finish the log · it folds into a topic" />
      </div>
      <div className="md:col-span-8">
        <PrototypeFrame src={`${P}/topic-linking.html`} width={1180} height={760} title="Ela topic linking admin prototype" label="Admin · link a log to a topic" />
      </div>
    </div>
  );
}

export function LogsFigure({ name }: { name?: string }) {
  switch (name) {
    case "flow":
      return <LogsFlow />;
    case "widgets":
      return <LogsWidgets />;
    case "snag":
      return (
        <PrototypeFrame
          src={`${rover}&open=1&state=snag`}
          title="Conversational log, submission failure state"
          label="Retry, then a way back"
        />
      );
    case "linking":
      return <LogsLinking />;
    default:
      return null;
  }
}
