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
      "A personal-finance assistant that lives inside WhatsApp. Designed, built and launched as one person, then run as a product with a budget, a funnel and paying users.",
    description:
      "WhatsApp-first budgeting for Uganda: log spending in plain words, get nudged at the right hour, and be shown a cheaper way to buy what you already buy.",
    logo: "/work/logos/ela-budget.png",
    snapshot: {
      role: "Product design, engineering, growth and day-to-day operations",
      team: "Solo build. Rwazi engineering for the payments hand-off, one marketing lead, three part-time deal collectors",
      platform:
        "WhatsApp (Meta Cloud API via Kapso), Telegram, companion web app. Cloudflare Workers, D1, Claude Haiku 4.5",
      timeline: "Prototype on Telegram, early 2026. WhatsApp port and organic pilot, May to June. Rwazi launch, July to August 2026",
      status: "Live at budget.withela.com. Owned by Rwazi, Inc.",
    },
    headline: [
      { value: "153 → 64 → 13", label: "Reached, activated, paying before any marketing spend", source: "Channel brief, 29 Jun 2026" },
      { value: "20%", label: "Trial-to-paid among activated users", source: "13 of 64. Corrected from the 42% in my own brief" },
      { value: "343", label: "Live offers from 141 vendors across 99 areas of Kampala", source: "#ela-budget, 27 Jul 2026" },
      { value: "27", label: "Weekly active users, up from 14 the week before", source: "Daily metrics post, 25 Aug 2026" },
    ],
    problem: {
      user:
        "Most people in Kampala know roughly what they earn and almost nothing about where it goes. Budgeting apps ask for a download, an account and a daily ritual inside a new app, and the spreadsheet everyone starts dies in week two. The one place people already type all day is WhatsApp.",
      business:
        "Ela needed a habit it could monetise. Life coaching is a once-a-week conversation; money is a several-times-a-day one. A budgeting capability with a 7-day trial and a 5,000 UGX monthly plan gave Ela a high-frequency product with almost no marginal cost, if it could get people to keep logging.",
    },
    evidence: [
      {
        title: "Organic pilot before asking for money",
        body:
          "I ran the bot off my own WhatsApp status for six weeks with zero spend. 153 people messaged it, 64 logged at least one expense, income or budget, and 13 paid for Premium. Growth was friends inviting friends, helped by an instant three-day reward when a referral joined.",
        source: "Joseph and Elijah, Ela Budget strategy call, 29 Jun 2026",
      },
      {
        title: "Two post-launch conversation audits",
        body:
          "On 26 June I read every conversation from 17 brand-new users. Budget setup leaked worst: of about five who tried, only one, who stated amounts up front, got a budget applied. Locked users' typed expenses were being silently dropped at the paywall. On 30 June I read all 22 conversations from that day and found 14 users had received two to four copies of the evening digest.",
        source: "Monthly review receipts, Aug 2026",
      },
      {
        title: "Retention breaks in week one, not day two",
        body:
          "First week on the Rwazi number: 30 people messaged, 19 had never used Ela, 14 logged at least one expense, 97 entries and about UGX 1.5M tracked. 15 of 30 came back on a second day, but only 3 were still logging after day five. The first conversation worked; the habit did not form.",
        source: "#ela-budget, 29 Jul 2026",
      },
      {
        title: "Reminders identify committed users, they do not create them",
        body:
          "Users who opted into reminders logged 27 expenses each against 3 for everyone else, which looks like reminders working. Normalised per active logging day the gap collapsed to under five percent, and the most productive user was not opted in. The nudges find people who were going to log anyway.",
        source: "Monthly review receipts, Aug 2026",
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
        why: "Of 62 people who had logged anything, 30 logged on exactly one day and 47 stopped inside a week. Gating the one message that proves value to days six to ten meant almost nobody saw it. It now fires as soon as we can say something true.",
      },
      {
        decision: "Sent fewer notifications than we could",
        gave: "Reach. Every rule below cost us messages",
        got: "A reminder system people did not mute",
        why: "Never-activated users get no regular cycle. Nothing scheduled fires within three hours of a user's own message. The last-call message carries Keep and Stop buttons, so the opt-out is never buried. A simulation of the rules caught that anyone whose last message fell between 09:00 and 21:00 would have received no last call at all, silently removing the opt-out for most of the fleet.",
      },
      {
        decision: "Held the paid launch until the number was Rwazi's",
        gave: "Three weeks of momentum in July",
        got: "A product the company could own, fund and staff",
        why: "The bot, the WhatsApp number, the Cloudflare account and the payment route all sat under my name. Joseph approved a $1,000 July budget on the condition that everything moved onto Rwazi property first. Migration of 164 users and all services finished on 21 July; the new number went live the next day.",
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
          "Ported to the WhatsApp Cloud API through Kapso on a Cloudflare Worker. Added witty morning, midday and evening reminders with reaction stickers, a 7-day trial, referral rewards and mobile-money SMS capture. Shared only on my own WhatsApp status.",
      },
      {
        date: "15 June",
        title: "The pitch",
        body:
          "Wrote the growth case to Joseph, Ashton and Nicholas: at 5,000 UGX a month paid acquisition alone does not work, so the model leans on organic invites plus a small creator-led burst. Built the financial model with fixed costs near $30 a month and AI cost of five to ten US cents per user.",
      },
      {
        date: "29 June",
        title: "Budget approved",
        body:
          "Walked Joseph through the model. He pushed on how obtainable market was calculated and asked for reach-based conversion, which the organic channel could not measure. Approved $1,000 for July, conditional on migrating everything to Rwazi.",
      },
      {
        date: "20 to 22 July",
        title: "Migration and relaunch",
        body:
          "Code moved to the Rwazi GitHub organisation, services to Rwazi Cloudflare, data verified, web app and landing page reskinned to the Ela design system. New production number live on 22 July. Meta's verification cap of 250 conversations bit immediately when a status post brought in new users.",
      },
      {
        date: "4 August",
        title: "Payments and the deals engine",
        body:
          "Flutterwave checkout live from inside the chat, routed through Rwazi's backend so Ela holds no payment keys. Verified with my own 5,000 UGX payment and a live tail of the webhook. Same day, ungated the cheaper-alternatives recommender after simulating weekly versus daily triggers.",
      },
      {
        date: "20 August",
        title: "Second transport",
        body:
          "Telegram shipped as a second transport on the same engine, hardened and announced the next day. Then the delivery-status callbacks were fixed so a winback template could go to the first cohort of 11 lapsed users.",
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
          "A catalogue of real offers collected on the ground, priced against what a user actually logged. \"You paid 12k for lunch four times this week, there's a place doing it at 8k, so that's 16k you'd have kept.\" Ask for a cheap dinner or a girls' night out and it plans one from the catalogue.",
        figure: "savings",
      },
      {
        title: "Trial, referral and upgrade in the same thread",
        body:
          "Seven free days. Invite a friend and both of you get more. When the trial ends, the upgrade is a link in the chat that returns you to WhatsApp already upgraded. Annual at 50,000 UGX with two months free turned out to be the plan people preferred.",
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
          "A PostHog dashboard tracks acquisition to activation to trial to Premium. A daily metrics post to the channel reports DAU, WAU and revenue. The catalogue has its own collector form and live list.",
      },
      {
        title: "Written down for the next owner",
        body:
          "An eleven-page Notion wiki covers architecture, accounts and secrets, runbook, UX patterns, AI parsing, legal and a decisions log, written so someone who is not me can run or take over the product.",
      },
      {
        title: "Payments without holding keys",
        body:
          "Ela requests a payment link from an internal Rwazi endpoint and receives a signed activation callback. Flutterwave credentials never touch the bot.",
      },
    ],
    outcome: {
      summary:
        "Ela Budget went from a side project on a personal number to a funded Rwazi product with a live payment route, a deals catalogue built by a field team, and a second transport on Telegram. The numbers are small and real, and I would rather show those than a projection.",
      metrics: [
        { value: "164", label: "Users migrated onto Rwazi infrastructure", source: "Notion wiki, 21 Jul 2026" },
        { value: "15", label: "Active Premium subscribers a fortnight after relaunch", source: "Update, 6 Aug 2026" },
        { value: "25%", label: "User-weeks where the savings recommender could show a real cheaper option, average saving UGX 18,110", source: "23 of 91 user-weeks after ungating, Aug 2026" },
        { value: "$1,000", label: "First budget approved on the strength of the organic pilot", source: "29 Jun 2026" },
      ],
      open:
        "Week-one retention is still the problem to solve. Payments went dark for thirteen days in August when Flutterwave's hosted page started cancelling every checkout, and I found it late because delivery callbacks were not being recorded. Both are fixed; both taught me to instrument before I ship.",
    },
    reflection: [
      "I shipped faster than I measured. The 42 percent conversion figure in my own brief was wrong, and the two weeks in July when analytics ingestion was off went unnoticed. Following up on shipped work means having something to watch it with.",
      "The best design decisions in this product were restraint decisions: fewer notifications, no setup step, one honest savings message instead of a dashboard. None of them show up as pixels.",
      "Owning the whole loop, from the first message to the payment webhook, made every trade-off concrete. I would not trade that back for a cleaner handoff.",
    ],
    liveUrl: "https://budget.withela.com",
  },
];
