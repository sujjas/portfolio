import { Figure, FlowSteps, Panels } from "./figures";
import { PrototypeFrame } from "./hifi/PrototypeFrame";
import { DesignFrame } from "./hifi/DesignFrame";

const P = "/design/ela/mobile-prototype";
const F = "/design/ela/figma/conversational-logs";

export function LogsFlow() {
  return (
    <div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <PrototypeFrame src={`${P}/logs.html`} title="Ela logs list" label="Logs · tap the first card" />
        <PrototypeFrame src={`${P}/log-detail.html?log=rover&live=0`} title="Rover or Thumbtack log, interactive" label="Start now · type, choose, drag to rate" />
        <PrototypeFrame src={`${P}/log-detail.html?log=store-observations&live=0`} title="Store observations upload log" label="Upload log · photo checks" />
      </div>
      <p className="mt-4 text-xs leading-relaxed text-neutral-500">
        The production design from the Conversational Logs file, built in the Ela design-system components and running live. Press Start now, type a name, pick a platform, then drag the heart to rate.
      </p>
    </div>
  );
}

export function LogsWidgets() {
  return (
    <Figure title="Widget set" meta="5 types · iOS and Android" note="Every widget has loading, error and retry states. Submissions that fail are retried and then explained; a slow first reply from the model is a separate state with its own copy.">
      <Panels
        cols={4}
        items={[
          { label: "Slider", title: "Ratings and amounts", body: "Snaps to steps, shows the value as you drag, confirms on release." },
          { label: "Picker", title: "Quantities and dates", body: "Native picker per platform inside a shared card." },
          { label: "Multiple choice", title: "Chips", body: "Single or multi-select, selected state carries into the transcript." },
          { label: "Text", title: "Short and long", body: "Auto-grows, character guidance when a limit applies." },
          { label: "Upload", title: "Photos and video", body: "Checked before acceptance, with a preview for anything flagged." },
          { label: "Loader", title: "Circular progress", body: "One loader for submission and first reply, so waiting looks intentional." },
          { label: "Retry", title: "Hold on, I hit a snag", body: "Up to five tries or sixty seconds, then a plain apology and a way back." },
          { label: "Status", title: "Done tag", body: "A completed log is marked in the thread and in the logs list." },
        ]}
      />
    </Figure>
  );
}

export function LogsPhotos() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
      <div className="md:col-span-3">
        <DesignFrame src={`${F}/08-retry-timeout.webp`} alt="Failure state after five retries or a sixty second timeout, with a way back" label="After 5 tries or 60s" />
      </div>
      <div className="md:col-span-9">
    <Figure title="Photo checks and failure states" meta="Hard and soft validation" note="Auto-close of the review pane depends on how it was opened: from the flagged call to action it closes when flagged images are dealt with; from the stack it stays open so unflagged images are not lost.">
      <FlowSteps
        steps={[
          { label: "Too small", note: "Removed automatically with a one-line note. Nothing to decide." },
          { label: "Blurry", note: "Flagged. Tap the thumbnail to preview, then keep or remove." },
          { label: "Contains people", note: "Flagged for privacy. Same preview, same choice." },
          { label: "Video length", note: "Too long or short is a hard fail with guidance; no in-app trimming." },
        ]}
      />
    </Figure>
      </div>
    </div>
  );
}

export function LogsLinking() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
      <div className="md:col-span-4">
        <PrototypeFrame src={`${P}/log-detail.html?log=rover&live=0&flow=recap&style=topic`} title="Log completion linked to a topic" label="Complete the log · it folds into a topic chat" />
      </div>
      <div className="md:col-span-8">
        <PrototypeFrame src={`${P}/topic-linking.html`} width={1180} height={760} title="Ela topic linking admin prototype" label="Admin · link a log to a topic and the conversation re-themes" />
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
    case "photos":
      return <LogsPhotos />;
    case "linking":
      return <LogsLinking />;
    default:
      return null;
  }
}
