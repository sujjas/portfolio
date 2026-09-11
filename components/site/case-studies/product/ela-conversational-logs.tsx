import { Figure, FlowSteps, Panels } from "./figures";
import { ElaPhone, ElaMsg, ElaChips, ElaSlider, ElaComposer, ElaProgressHeader, ElaLogCard } from "./hifi/ElaScreens";

export function LogsFlow() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <ElaPhone title="Logs" label="A log in the list">
        <ElaLogCard title="Weekly shopping log" reward="$0.50" time="4m" days="3d left" />
        <ElaLogCard title="Energy drink preferences" reward="25% off" time="2m" days="2d left" />
        <ElaLogCard title="Medication" reward="$0.10" time="2m" days="1d left" done />
      </ElaPhone>
      <ElaPhone title="Weekly shopping log" label="Required question, answered with a widget">
        <ElaProgressHeader title="Weekly shopping log" pct={33} />
        <ElaMsg from="ela">Where did you do most of your grocery shopping this week?</ElaMsg>
        <ElaChips options={["Supermarket", "Market stall", "Kiosk", "Online"]} selected="Market stall" />
        <ElaMsg from="user">Market stall</ElaMsg>
        <ElaMsg from="ela">Market stalls it is. Roughly how much did you spend there?</ElaMsg>
        <ElaSlider value={40} label="UGX 40,000" />
      </ElaPhone>
      <ElaPhone title="Weekly shopping log" label="Follow-up becomes contextual insight">
        <ElaProgressHeader title="Weekly shopping log" pct={66} />
        <ElaMsg from="user">40k</ElaMsg>
        <ElaMsg from="ela">Got it, that&apos;s stored. Out of interest, why the stall over a supermarket this week?</ElaMsg>
        <ElaMsg from="user">Cheaper and it&apos;s on my way home</ElaMsg>
        <ElaMsg from="ela">Makes sense. Buying tomatoes late in the day at stalls is usually cheaper too. Two more questions and you&apos;re done.</ElaMsg>
      </ElaPhone>
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
    <Figure title="Photo checks" meta="Hard and soft validation" note="Auto-close of the review pane depends on how it was opened: from the flagged call to action it closes when flagged images are dealt with; from the stack it stays open so unflagged images are not lost.">
      <FlowSteps
        steps={[
          { label: "Too small", note: "Removed automatically with a one-line note. Nothing to decide." },
          { label: "Blurry", note: "Flagged. Tap the thumbnail to preview, then keep or remove." },
          { label: "Contains people", note: "Flagged for privacy. Same preview, same choice." },
          { label: "Video length", note: "Too long or short is a hard fail with guidance; no in-app trimming." },
        ]}
      />
    </Figure>
  );
}

export function LogsLinking() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <ElaPhone title="Weekly shopping log" label="Completion, linked to a topic" footer={<ElaComposer />}>
        <ElaProgressHeader title="Weekly shopping log" pct={100} tag="Completed" />
        <ElaMsg from="ela">That&apos;s your log for the week. You spent a little less than last week, mostly by shopping at stalls.</ElaMsg>
        <ElaMsg from="ela">Want to keep talking about this? I can help you plan next week&apos;s shop.</ElaMsg>
        <ElaChips options={["Plan next week", "Cheaper staples", "Back to logs"]} />
      </ElaPhone>
      <ElaPhone title="Money · Budgeting" label="Same chat in history, log card on top" footer={<ElaComposer />}>
        <ElaLogCard title="Weekly shopping log" reward="" time="6 answers" days="2 notes" done />
        <ElaMsg from="user" bubbleBg="#fecdca">Plan next week</ElaMsg>
        <ElaMsg from="ela">Let&apos;s start with what you already know you need. Staples first, then the extras.</ElaMsg>
        <ElaMsg from="user" bubbleBg="#fecdca">Rice, beans, cooking oil, tomatoes</ElaMsg>
        <ElaMsg from="ela">Good list. At the stall you used, that comes to about UGX 32,000. Want me to hold that as this week&apos;s plan?</ElaMsg>
      </ElaPhone>
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
