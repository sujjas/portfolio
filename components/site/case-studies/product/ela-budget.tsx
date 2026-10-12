import { WhatsAppPhone } from "./hifi/WhatsApp";
import { PrototypeFrame } from "./hifi/PrototypeFrame";

/**
 * Ela Budget figures. The product is a WhatsApp conversation, rendered as
 * live HTML in WhatsApp's own chrome; the web app and landing page are the
 * shipped builds, served from /design behind the preview gate. Venues in the
 * sample replies are fictional.
 */

function ElaBudgetConversation() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <WhatsAppPhone
        label="First message, first expense"
        bubbles={[
          { from: "user", text: "5k juice with Allen", time: "12:41" },
          { from: "ela", text: "Logged 🧃 UGX 5,000 · Food & drinks · today.\nThat's 23,000 on food this week so far.", time: "12:41" },
          { from: "user", text: "groceries 45k #want #momo", time: "18:02" },
          { from: "ela", text: "Logged 🛒 UGX 45,000 · Groceries · want · mobile money.", time: "18:02" },
          { from: "user", text: "how much on food this month?", time: "18:03" },
          { from: "ela", text: "UGX 68,000 on food so far this month, across 9 entries. Lunch is 60% of it.", time: "18:03" },
        ]}
      />
      <WhatsAppPhone
        label="Receipt photo"
        bubbles={[
          { from: "user", text: "", time: "18:42", image: true },
          { from: "ela", text: "I read this as:\nUGX 38,500 · City Fresh Supermarket · Groceries\n12 Aug, 18:42", time: "18:42", buttons: ["Save", "Edit", "Discard"] },
          { from: "user", text: "Save", time: "18:43" },
          { from: "ela", text: "Saved ✅ Groceries budget is at 82% for August.", time: "18:43" },
        ]}
      />
      <WhatsAppPhone
        label="Midday nudge with a sticker"
        bubbles={[
          { from: "ela", text: "It's midday and I've seen nothing from you. Even a boda counts.", time: "12:00", sticker: "👀" },
          { from: "user", text: "boda 3k, lunch 12k", time: "12:14" },
          { from: "ela", text: "Both logged. 15,000 today. Transport and lunch, the usual suspects.", time: "12:14" },
          { from: "ela", text: "Four days in a row 🔥 Keep going.", time: "12:14" },
        ]}
      />
    </div>
  );
}

function ElaBudgetSavings() {
  return (
    <WhatsAppPhone
      label="The savings message"
      bubbles={[
        { from: "ela", text: "You paid 12k for lunch four times this week. There's a place near Kamwokya doing it at 8k, so that's 16k you'd have kept.", time: "13:05", buttons: ["Show me", "Not now"] },
        { from: "user", text: "Show me", time: "13:06" },
        { from: "ela", text: "Mama Rose's Kitchen, Kamwokya\nLunch plate · UGX 8,000 · Mon to Sat\nLogged by a collector on 3 Aug.", time: "13:06" },
        { from: "user", text: "girls night out under 60k for 3 of us", time: "17:30" },
        { from: "ela", text: "Here's one that fits:\n• Cocktails 2-for-1 at Sunset Lounge, Kololo, until 8pm · ~15k each\n• Grilled platter for three at Grill House, Kisementi · 30k\nAbout 55k total.", time: "17:30", buttons: ["Add to plan", "Try another"] },
      ]}
    />
  );
}

function ElaBudgetReminders() {
  return (
    <WhatsAppPhone
      label="Evening digest and last call"
      bubbles={[
        { from: "ela", text: "Today: UGX 27,000 across 3 entries. Food 15k, transport 9k, airtime 3k. You're UGX 4,000 under your daily line 👌", time: "19:00" },
        { from: "ela", text: "Quiet couple of days. Want me to keep the reminders coming, or pause them for now?", time: "19:00", buttons: ["Keep", "Stop"] },
        { from: "user", text: "Keep", time: "19:20" },
        { from: "ela", text: "Keeping them. Talk tomorrow at midday.", time: "19:20" },
      ]}
    />
  );
}

export function ElaBudgetFigure({ name }: { name?: string }) {
  switch (name) {
    case "conversation":
      return <ElaBudgetConversation />;
    case "savings":
      return <ElaBudgetSavings />;
    case "app":
      return (
        <PrototypeFrame
          src="/design/ela-budget/app/index.html"
          width={1180}
          height={760}
          title="Ela Budget companion web app, interactive"
          label="Companion web app · the shipped build with demo data"
        />
      );
    case "reminders":
      return <ElaBudgetReminders />;
    case "landing":
      return (
        <PrototypeFrame
          src="/design/ela-budget/landing/index.html"
          width={1180}
          height={760}
          title="Ela Budget landing page"
          label="Landing page · budget.withela.com as shipped"
        />
      );
    default:
      return null;
  }
}
