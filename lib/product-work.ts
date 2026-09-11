/**
 * Product case studies — Rwazi work. A different template from the
 * website case studies in lib/work.ts: problem → evidence → trade-offs →
 * process → solution → build → outcome → reflection. Rendered by
 * app/product/[slug]/page.tsx behind the private-preview gate (proxy.ts).
 */

export type Metric = {
  value: string;
  label: string;
  /** Where the number came from, shown in mono under the tile. */
  source?: string;
};

export type Fact = {
  title: string;
  body: string;
  /** Dated, sourced receipt. Keeps the case study honest. */
  source?: string;
};

export type TradeOff = {
  decision: string;
  gave: string;
  got: string;
  why: string;
};

export type ProcessStep = {
  date: string;
  title: string;
  body: string;
};

export type SolutionPart = {
  title: string;
  body: string;
  /** Optional named figure rendered by the per-study component set. */
  figure?: string;
};

export type ProductCaseStudy = {
  slug: string;
  name: string;
  /** One-line thesis under the title. */
  thesis: string;
  /** Short description for cards and metadata. */
  description: string;
  logo: string | null;
  snapshot: {
    role: string;
    team: string;
    platform: string;
    timeline: string;
    status: string;
  };
  headline: Metric[];
  problem: { user: string; business: string };
  evidence: Fact[];
  tradeoffs: TradeOff[];
  process: ProcessStep[];
  solution: SolutionPart[];
  build: Fact[];
  outcome: { summary: string; metrics: Metric[]; open: string };
  reflection: string[];
  /** Live link, shown only when the product is public. */
  liveUrl?: string;
};

export const productCaseStudies: ProductCaseStudy[] = [
  {
    slug: "ela-budget",
    name: "Ela Budget",
    thesis:
      "A personal-finance assistant that lives inside WhatsApp. Designed and built end to end, then launched and grown as a product with a trial, a referral loop and paying users.",
    description:
      "WhatsApp-first budgeting for Uganda: log spending in plain words, get nudged at the right hour, and be shown a cheaper way to buy what you already buy.",
    logo: "/work/logos/ela-budget.png",
    snapshot: {
      role: "Product design, engineering, growth and operations",
      team: "Solo build, with engineering support for payments and a small field team collecting offers",
      platform:
        "WhatsApp (Meta Cloud API), Telegram, companion web app. Cloudflare Workers, D1, Claude Haiku 4.5",
      timeline: "Prototype early 2026. Organic pilot, May to June. Launch and growth, July to August 2026",
      status: "Live at budget.withela.com. Part of Ela by Rwazi",
    },
    headline: [
      { value: "0 → 1", label: "From prototype to a live, paid product in under six months" },
      { value: "100%", label: "Organic growth during the pilot, with no marketing spend" },
      { value: "343", label: "Live offers from 141 vendors across 99 areas of Kampala" },
      { value: "~$30", label: "Monthly fixed infrastructure cost through launch" },
    ],
    problem: {
      user:
        "Most people in Kampala know roughly what they earn and almost nothing about where it goes. Budgeting apps ask for a download, an account and a daily ritual inside a new app, and the spreadsheet everyone starts dies in week two. The one place people already type all day is WhatsApp.",
      business:
        "Ela needed a habit it could monetise. Life coaching is a once-a-week conversation; money is a several-times-a-day one. A budgeting capability with a seven-day trial and a low monthly plan gave Ela a high-frequency product with almost no marginal cost, if it could get people to keep logging.",
    },
    evidence: [
      {
        title: "A pilot before a launch",
        body:
          "The bot ran for six weeks on organic sharing alone. Growth came from friends inviting friends, helped by an instant reward of extra free days when a referral joined. Roughly two in five people who messaged went on to log an expense, an income or a budget.",
      },
      {
        title: "Reading the conversations, not just the dashboard",
        body:
          "After each release I read new users' first conversations end to end. That is how the leaks showed up: people who stated amounts up front got a budget applied, people who did not got nothing, and users past the trial were typing expenses that went nowhere.",
      },
      {
        title: "Retention breaks in week one, not day two",
        body:
          "About half of first-time users came back on a second day, which meant the first conversation worked. Far fewer were still logging after day five. The habit was not forming, so the product had to prove its value inside the first week.",
      },
      {
        title: "Reminders identify committed users, they do not create them",
        body:
          "Users who opted into reminders logged many times more expenses than everyone else, which looks like reminders working. Normalised per active logging day the gap almost disappears. The nudges find people who were going to log anyway, so the real lever is the first few days.",
      },
    ],
    tradeoffs: [
      {
        decision: "Removed the Google Connect step",
        gave: "Data living in the user's own Google Sheet, the original privacy story",
        got: "A first message that is also the first logged expense. No setup at all",
        why: "Connecting a Google account was the single biggest drop-off in the funnel. People do not hand a stranger their Drive before they trust it. Data moved server-side, with a claim code to open the web app later.",
      },
      {
        decision: "Moved the savings moment from day six to day one",
        gave: "A week of logging history to make the recommendation robust",
        got: "The aha moment on the first purchase we can price against the catalogue",
        why: "Most people who stopped did so inside the first week, and many logged on exactly one day. Gating the one message that proves value to days six to ten meant almost nobody saw it. It now fires as soon as there is something true to say.",
      },
      {
        decision: "Sent fewer notifications than we could",
        gave: "Reach. Every rule below cost us messages",
        got: "A reminder system people did not mute",
        why: "Never-activated users get no regular cycle. Nothing scheduled fires within three hours of a user's own message. The last reminder carries Keep and Stop buttons, so the opt-out is never buried. The rules were simulated against real usage before they shipped.",
      },
      {
        decision: "Priced for the market, not the spreadsheet",
        gave: "Higher revenue per user",
        got: "A monthly price people pay without thinking, and an annual plan they prefer",
        why: "At a few thousand shillings a month, paid acquisition alone cannot work. The model leans on organic invites and a small creator-led burst, with AI cost per user measured in cents and infrastructure that is almost entirely fixed.",
      },
    ],
    process: [
      {
        date: "Early 2026",
        title: "Telegram prototype",
        body:
          "The finance engine started life as a Telegram bot: parsing amounts and hashtags, categorising by keyword, weekly and monthly reports, receipt OCR with Claude. Telegram was the fastest place to learn what people would actually type.",
      },
      {
        date: "May to June",
        title: "WhatsApp port and organic pilot",
        body:
          "Ported to the WhatsApp Cloud API on a Cloudflare Worker. Added witty morning, midday and evening reminders with reaction stickers, a seven-day trial, referral rewards and mobile-money SMS capture. Shared organically only.",
      },
      {
        date: "June",
        title: "The business case",
        body:
          "Wrote the growth and financial model: organic invites plus a small creator-led burst, fixed costs near $30 a month, AI cost of cents per user, and a path to positive monthly cash flow within a few months of launch.",
      },
      {
        date: "July",
        title: "Migration and relaunch",
        body:
          "Moved code, services and user data onto company infrastructure, reskinned the web app and landing page to the Ela design system, and relaunched on a new business number with a branded domain.",
      },
      {
        date: "August",
        title: "Payments and the deals engine",
        body:
          "In-chat checkout went live, with the upgrade applied automatically on return to WhatsApp. The cheaper-alternatives recommender was switched on after simulating weekly against daily triggers on real logs.",
      },
      {
        date: "August",
        title: "Second transport",
        body:
          "Telegram shipped as a second transport on the same engine, so the product now meets people on whichever messenger they already use.",
      },
    ],
    solution: [
      {
        title: "Logging is just talking",
        body:
          "\"5k juice with Allen\" becomes a categorised expense. A receipt photo comes back as total, merchant and category with Save, Edit and Discard. Amounts take k and m shorthand, hashtags override the auto-category, and a message ending in a question mark is answered from the user's own numbers.",
        figure: "conversation",
      },
      {
        title: "Reminders with a personality and a limit",
        body:
          "Three windows a day, each with a sticker rather than a paragraph. The midday nudge is the single biggest driver of daily logging. Reminders respect Meta's 24-hour window, back off after a user's own message, and always carry a way out.",
        figure: "reminders",
      },
      {
        title: "Spend less, not just see more",
        body:
          "A catalogue of real offers collected on the ground, priced against what a user actually logged. \"You paid 12k for lunch four times this week, there's a place doing it at 8k, so that's 16k you'd have kept.\" Ask for a cheap dinner or a night out and it plans one from the catalogue.",
        figure: "savings",
      },
      {
        title: "Trial, referral and upgrade in the same thread",
        body:
          "Seven free days. Invite a friend and both of you get more. When the trial ends, the upgrade is a link in the chat that returns you to WhatsApp already upgraded. The annual plan with two months free turned out to be the one people preferred.",
        figure: "funnel",
      },
    ],
    build: [
      {
        title: "One Worker, no servers",
        body:
          "The whole backend, the web app and the landing page run on a single Cloudflare Worker with D1 and KV. Fixed infrastructure cost stayed around $30 a month through launch.",
      },
      {
        title: "Instrumented before scaling",
        body:
          "A product analytics dashboard tracks acquisition to activation to trial to paid. A daily metrics post reports active users and revenue to the team. The catalogue has its own collector form and live list.",
      },
      {
        title: "Written down for the next owner",
        body:
          "An internal wiki covers architecture, accounts, runbook, UX patterns, AI parsing, legal and a decisions log, written so someone who is not me can run or take over the product.",
      },
      {
        title: "Payments without holding keys",
        body:
          "The bot requests a payment link from an internal endpoint and receives a signed activation callback. Payment credentials never touch the chat layer.",
      },
    ],
    outcome: {
      summary:
        "Ela Budget went from a side project to a funded product with a live payment route, a deals catalogue built by a field team, and a second transport on Telegram. It is live and growing in Kampala.",
      metrics: [
        { value: "2", label: "Messaging platforms served by one finance engine" },
        { value: "343", label: "Offers in the deals catalogue, collected on the ground" },
        { value: "1 in 4", label: "Active user-weeks where a real cheaper option could be shown" },
        { value: "Day 1", label: "When a new user now sees their first savings message" },
      ],
      open:
        "Week-one retention is the next problem to solve, and widening the catalogue beyond food and telecom is the next product piece.",
    },
    reflection: [
      "Instrument first. Every decision that worked came from reading real conversations or simulating a rule against real logs before shipping it.",
      "The best design decisions in this product were restraint decisions: fewer notifications, no setup step, one honest savings message instead of a dashboard. None of them show up as pixels.",
      "Owning the whole loop, from the first message to the payment webhook, made every trade-off concrete.",
    ],
    liveUrl: "https://budget.withela.com",
  },
];
