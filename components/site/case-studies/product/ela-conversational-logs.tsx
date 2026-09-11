import { Figure, FlowSteps, Panels } from "./figures";
import { PrototypeFrame } from "./hifi/PrototypeFrame";
import { DesignFrame } from "./hifi/DesignFrame";

const P = "/design/ela/mobile-prototype";
const F = "/design/ela/figma/conversational-logs";

export function LogsFlow() {
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-5">
        <DesignFrame src={`${F}/01-log-page.webp`} alt="Log page with illustration, reward, time and deadline, and a Start now button" label="Log page" />
        <DesignFrame src={`${F}/02-intro.webp`} alt="Ela introduces the log and asks the first question" label="Intro" />
        <DesignFrame src={`${F}/03-text-widget.webp`} alt="Text widget with the keyboard open" label="Text widget" />
        <DesignFrame src={`${F}/04-multiple-choice.webp`} alt="Multiple choice list with a Continue button" label="Multiple choice" />
        <DesignFrame src={`${F}/05-rating.webp`} alt="Drag-to-rate widget with a heart that fills as you drag" label="Rating" />
      </div>
      <p className="mt-4 text-xs leading-relaxed text-neutral-500">
        Production design, exported from the Conversational Logs Figma file at 3x. Flow: log page, intro text, text widget, multiple choice, rating, outro and submit.
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
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-cols-3 gap-4 sm:gap-6">
        <DesignFrame src={`${F}/06-outro.webp`} alt="Outro: Ela thanks the user and offers to keep talking" label="Outro" />
        <DesignFrame src={`${F}/07-done.webp`} alt="We are done, answers are submitted" label="Submit" />
        <DesignFrame src={`${F}/09-final.webp`} alt="Conversation continues after the log on the linked topic" label="Continue on the topic" />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="md:col-span-4">
          <PrototypeFrame src={`${P}/log-detail.html?log=medication&live=0&flow=recap&style=topic`} title="Ela log completion linked to a topic, prototype" label="Prototype · recap flow, click through" />
        </div>
        <div className="md:col-span-8">
          <PrototypeFrame src={`${P}/topic-linking.html`} width={1180} height={760} title="Ela topic linking admin prototype" label="Prototype · admin links a log to a topic" />
        </div>
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
