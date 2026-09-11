import { Figure, FlowSteps, Panels, Phone } from "./figures";

function Msg({ from, children }: { from: "ela" | "user"; children: React.ReactNode }) {
  return from === "user" ? (
    <div className="flex justify-end">
      <p className="max-w-[80%] rounded-2xl rounded-br-md bg-neutral-950 px-3 py-1.5 text-[12px] leading-snug text-white">
        {children}
      </p>
    </div>
  ) : (
    <p className="max-w-[85%] rounded-2xl rounded-bl-md border border-neutral-200 bg-white px-3 py-1.5 text-[12px] leading-snug text-neutral-800">
      {children}
    </p>
  );
}

function Widget({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-2.5">
      <p className="font-mono text-[0.6rem] uppercase tracking-wider text-neutral-400">{label}</p>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

export function LogsFlow() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Phone label="Start · required question">
        <div className="rounded-xl bg-neutral-200/70 px-3 py-2 text-[11px] font-medium text-neutral-700">
          Weekly shopping log · 2 of 6
        </div>
        <Msg from="ela">Where did you do most of your grocery shopping this week?</Msg>
        <Widget label="Multiple choice">
          <div className="flex flex-wrap gap-1.5">
            {["Supermarket", "Market stall", "Kiosk", "Online"].map((c) => (
              <span key={c} className={`rounded-full border px-2.5 py-1 text-[11px] ${c === "Market stall" ? "border-neutral-950 bg-neutral-950 text-white" : "border-neutral-300 bg-white text-neutral-800"}`}>
                {c}
              </span>
            ))}
          </div>
        </Widget>
        <Msg from="user">Market stall</Msg>
        <Msg from="ela">Market stalls it is. Roughly how much did you spend there?</Msg>
        <Widget label="Slider">
          <div className="h-1.5 rounded-full bg-neutral-200">
            <div className="h-1.5 w-2/5 rounded-full bg-neutral-950" />
          </div>
          <p className="mt-1.5 text-[11px] text-neutral-700">UGX 40,000</p>
        </Widget>
      </Phone>
      <Phone label="Follow-up · contextual insight">
        <Msg from="user">40k</Msg>
        <Msg from="ela">Got it. That is stored. Out of interest, why the stall over a supermarket this week?</Msg>
        <Msg from="user">Cheaper and it&apos;s on my way home</Msg>
        <Msg from="ela">Makes sense. Quick tip: buying tomatoes late in the day at stalls is usually cheaper. Two more questions and you&apos;re done.</Msg>
        <div className="mt-auto rounded-xl border border-neutral-200 bg-white p-2.5 text-[11px] text-neutral-600">
          <p className="font-medium text-neutral-900">What gets stored</p>
          <p className="mt-1">Required: channel = market stall, spend = 40,000.</p>
          <p>Contextual: price and convenience drove the choice.</p>
        </div>
      </Phone>
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
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Phone label="Completion · status tag">
        <div className="rounded-xl bg-neutral-200/70 px-3 py-2 text-[11px] font-medium text-neutral-700">
          Weekly shopping log · Done
        </div>
        <Msg from="ela">That&apos;s your log for the week. You spent a little less than last week, mostly by shopping at stalls.</Msg>
        <div className="rounded-xl border border-neutral-200 bg-white p-2.5">
          <p className="font-mono text-[0.6rem] uppercase tracking-wider text-neutral-400">Linked topic</p>
          <p className="mt-1 text-[12px] font-medium text-neutral-900">Money · Budgeting</p>
        </div>
        <Msg from="ela">Want to keep talking about this? I can help you plan next week&apos;s shop.</Msg>
        <div className="flex gap-1.5">
          {["Plan next week", "Back to logs"].map((c, i) => (
            <span key={c} className={`rounded-full border px-2.5 py-1 text-[11px] ${i === 0 ? "border-neutral-950 bg-neutral-950 text-white" : "border-neutral-300 bg-white text-neutral-800"}`}>
              {c}
            </span>
          ))}
        </div>
      </Phone>
      <Phone label="Chat history · log card on top">
        <div className="rounded-xl bg-neutral-200/70 px-3 py-2 text-[11px] font-medium text-neutral-700">
          Money · Budgeting
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-2.5">
          <p className="font-mono text-[0.6rem] uppercase tracking-wider text-neutral-400">From log</p>
          <p className="mt-1 text-[12px] font-medium text-neutral-900">Weekly shopping log · Done</p>
          <p className="text-[11px] text-neutral-500">6 answers · 2 notes</p>
        </div>
        <Msg from="user">Plan next week</Msg>
        <Msg from="ela">Let&apos;s start with what you already know you need…</Msg>
        <p className="mt-auto text-center text-[11px] text-neutral-500">
          Same header, same behaviour as any topic chat. The card is the only addition.
        </p>
      </Phone>
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
