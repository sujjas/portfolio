/**
 * Ela Budget — figures for the product case study. The product is a chat,
 * so the artefacts are conversations rendered in the site's own visual
 * language rather than WhatsApp screenshots: faithful copy, neutral chrome.
 */

export type Bubble =
  | { from: "user"; text: string; time?: string }
  | { from: "ela"; text: string; time?: string; sticker?: string; buttons?: string[] };

export function Chat({
  title,
  meta,
  bubbles,
  note,
}: {
  title: string;
  meta: string;
  bubbles: Bubble[];
  note?: string;
}) {
  return (
    <figure className="flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-5 ring-1 ring-black/5 md:p-6">
      <figcaption className="mb-4 flex items-center justify-between gap-4">
        <p className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500">{title}</p>
        <p className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500 tabular-nums">
          {meta}
        </p>
      </figcaption>
      <div className="flex flex-1 flex-col gap-2.5 rounded-xl bg-neutral-50 p-4">
        {bubbles.map((b, i) =>
          b.from === "user" ? (
            <div key={i} className="flex justify-end">
              <p className="max-w-[80%] rounded-2xl rounded-br-md bg-neutral-950 px-3.5 py-2 text-[13px] leading-snug text-white">
                {b.text}
              </p>
            </div>
          ) : (
            <div key={i} className="flex flex-col items-start gap-1.5">
              {b.sticker ? (
                <div
                  aria-label="sticker"
                  className="flex h-16 w-16 items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-white text-2xl"
                >
                  {b.sticker}
                </div>
              ) : null}
              <p className="max-w-[85%] whitespace-pre-line rounded-2xl rounded-bl-md border border-neutral-200 bg-white px-3.5 py-2 text-[13px] leading-snug text-neutral-800">
                {b.text}
              </p>
              {b.buttons ? (
                <div className="flex flex-wrap gap-1.5">
                  {b.buttons.map((label) => (
                    <span
                      key={label}
                      className="rounded-full border border-neutral-300 bg-white px-3 py-1 text-[12px] font-medium text-neutral-800"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          ),
        )}
      </div>
      {note ? <p className="mt-4 text-xs leading-relaxed text-neutral-500">{note}</p> : null}
    </figure>
  );
}

export function ElaBudgetConversation() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <Chat
        title="First message, first expense"
        meta="No setup"
        bubbles={[
          { from: "user", text: "5k juice with Allen" },
          {
            from: "ela",
            text: "Logged. UGX 5,000 · Food & drinks · today.\nThat's 23,000 on food this week so far.",
          },
          { from: "user", text: "groceries 45k #want #momo" },
          {
            from: "ela",
            text: "Logged. UGX 45,000 · Groceries · want · mobile money.",
          },
          { from: "user", text: "how much on food this month?" },
          {
            from: "ela",
            text: "UGX 68,000 on food so far this month, across 9 entries. Lunch is 60% of it.",
          },
        ]}
        note="Amounts take k and m shorthand. A hashtag overrides the auto-category. Any message ending in a question mark is answered from the user's own rows."
      />
      <Chat
        title="Receipt photo"
        meta="OCR · Save / Edit / Discard"
        bubbles={[
          { from: "user", text: "📷 receipt.jpg" },
          {
            from: "ela",
            text: "I read this as:\nUGX 38,500 · Capital Shoppers · Groceries\n12 Aug, 18:42",
            buttons: ["Save", "Edit", "Discard"],
          },
          { from: "user", text: "Save" },
          {
            from: "ela",
            text: "Saved. Groceries budget is at 82% for August.",
          },
        ]}
        note="A slow or failed read falls back to a retry path and a plain apology, so a photo never disappears silently."
      />
    </div>
  );
}

export function ElaBudgetReminders() {
  const rules = [
    { rule: "Three windows a day", detail: "Morning, midday and 19:00. Midday is the single biggest driver of daily logging." },
    { rule: "Quiet period", detail: "Nothing scheduled fires within three hours of a user's own message." },
    { rule: "Never-activated users get no cycle", detail: "People who texted once and never logged are the easiest to nag and the ones we leave alone." },
    { rule: "Inside the 24-hour window", detail: "Meta bills every message outside a user's last 24 hours. Reminders are timed to stay inside it, so the loop pays for itself." },
    { rule: "Last call carries the opt-out", detail: "Keep and Stop live on the final reminder, so leaving is never buried in a menu." },
  ];
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
      <div className="md:col-span-5">
        <Chat
          title="Midday nudge"
          meta="Sticker, not a paragraph"
          bubbles={[
            { from: "ela", sticker: "👀", text: "It's midday and I've seen nothing from you. Even a boda counts." },
            { from: "user", text: "boda 3k, lunch 12k" },
            { from: "ela", text: "Both logged. 15,000 today. Transport and lunch, the usual suspects." },
            { from: "ela", sticker: "🔥", text: "Four days in a row. Keep going." },
          ]}
        />
      </div>
      <ol
        role="list"
        className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-200 ring-1 ring-black/5 md:col-span-7"
      >
        {rules.map((r, i) => (
          <li key={r.rule} className="grid grid-cols-[2.5rem_1fr] gap-3 bg-white px-5 py-4">
            <span className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-400 tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="text-sm font-medium text-neutral-950">{r.rule}</p>
              <p className="mt-1 text-sm leading-relaxed text-neutral-600">{r.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function ElaBudgetSavings() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <Chat
        title="The savings message"
        meta="Fires on the first match"
        bubbles={[
          {
            from: "ela",
            text: "You paid 12k for lunch four times this week. There's a place near Kamwokya doing it at 8k, so that's 16k you'd have kept.",
            buttons: ["Show me", "Not now"],
          },
          { from: "user", text: "Show me" },
          {
            from: "ela",
            text: "Nakumatt Food Court, Kamwokya\nLunch plate · UGX 8,000 · Mon to Sat\nLogged by a collector on 3 Aug.",
          },
        ]}
        note="A weekly trigger was simulated against a daily one on real logs before shipping: it fires for more users and shows a bigger average saving. It now fires as soon as one logged purchase has a cheaper match."
      />
      <Chat
        title="Planning from the catalogue"
        meta="343 offers · 141 vendors · 99 areas"
        bubbles={[
          { from: "user", text: "girls night out under 60k for 3 of us" },
          {
            from: "ela",
            text: "Here's one that fits:\n• Cocktails 2-for-1 at Bubbles, Kololo, until 8pm · ~15k each\n• Grilled platter for three at Café Javas, Kisementi · 30k\nTotal about 55k. Want me to hold it in your plan?",
            buttons: ["Add to plan", "Try another"],
          },
        ]}
        note="The catalogue is collected on the ground by a small field team through a form on budget.withela.com and stored in D1. Food and telecom dominate; widening it is the next product piece."
      />
    </div>
  );
}

export function ElaBudgetFunnel() {
  const stages = [
    { label: "Message", note: "Say hi, or just type an expense. No signup, no app." },
    { label: "First log", note: "The first message is the first logged expense. Activation is instant." },
    { label: "Seven-day trial", note: "Reminders, reports and the savings message all switched on." },
    { label: "Invite", note: "Share with a friend and both of you earn extra free days." },
    { label: "Upgrade", note: "A payment link inside the chat. Return to WhatsApp already on Premium." },
  ];
  return (
    <figure className="rounded-2xl border border-neutral-200 bg-white p-6 ring-1 ring-black/5 md:p-8">
      <figcaption className="mb-6 flex items-center justify-between gap-4">
        <p className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500">
          The whole funnel lives in one thread
        </p>
        <p className="font-mono text-[0.7rem] uppercase tracking-wider text-neutral-500 tabular-nums">
          5 steps · 0 screens
        </p>
      </figcaption>
      <ol role="list" className="grid grid-cols-1 gap-3 sm:grid-cols-5">
        {stages.map((s, i) => (
          <li
            key={s.label}
            className={`rounded-xl border p-4 ${
              i === stages.length - 1
                ? "border-neutral-950 bg-neutral-950 text-white"
                : "border-neutral-200 bg-neutral-50"
            }`}
          >
            <p
              className={`font-mono text-[0.65rem] uppercase tracking-wider tabular-nums ${
                i === stages.length - 1 ? "text-neutral-400" : "text-neutral-400"
              }`}
            >
              {String(i + 1).padStart(2, "0")}
            </p>
            <p className="mt-2 text-sm font-medium">{s.label}</p>
            <p
              className={`mt-1.5 text-xs leading-relaxed ${
                i === stages.length - 1 ? "text-neutral-300" : "text-neutral-600"
              }`}
            >
              {s.note}
            </p>
          </li>
        ))}
      </ol>
      <p className="mt-6 border-t border-neutral-200 pt-4 text-xs leading-relaxed text-neutral-500">
        Nothing in the funnel leaves WhatsApp. Even payment opens a hosted checkout and drops the
        user back into the conversation, already upgraded.
      </p>
    </figure>
  );
}

export function ElaBudgetFigure({ name }: { name?: string }) {
  switch (name) {
    case "conversation":
      return <ElaBudgetConversation />;
    case "reminders":
      return <ElaBudgetReminders />;
    case "savings":
      return <ElaBudgetSavings />;
    case "funnel":
      return <ElaBudgetFunnel />;
    default:
      return null;
  }
}
