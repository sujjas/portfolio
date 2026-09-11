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
  {
    slug: "sena",
    name: "Sena",
    thesis:
      "Redesigning an enterprise market-intelligence platform around a conversation. From the first chat interface to a chat-first product model, a working prototype and a production design system.",
    description:
      "Rwazi's AI copilot for market intelligence. I designed the chat experience, led the chat-first redesign of the platform, and built the prototype and design system that carry it.",
    logo: null,
    snapshot: {
      role: "Product design lead for the platform; design engineering on the prototype and design system",
      team: "With a product director, a product manager and the platform engineering team",
      platform: "Web app. Figma, a SvelteKit prototype streaming Claude, Storybook, a token-bound Figma library",
      timeline: "Chat interface, early 2025. Chat-first redesign, late 2025 to early 2026. Prototype and design system, mid 2026",
      status: "Live for enterprise customers. Prototype and design system in active use",
    },
    headline: [
      { value: "1 → many", label: "Reports a single conversation can use as context" },
      { value: "240", label: "Design tokens, generated to CSS and mirrored as Figma variables" },
      { value: "450+", label: "Automated tests behind the working prototype" },
      { value: "0", label: "Unbound colours across the Figma component library" },
    ],
    problem: {
      user:
        "Analysts bought reports and got dashboards, one per report. Real questions cut across reports, markets and time, and the answer usually meant exporting three things into a spreadsheet. The chat that existed lived inside a single report and could only see that report.",
      business:
        "The platform had grown feature by feature on a dashboard template, without a designer. AI had to become the front door: the place a new customer starts, the way an existing one gets more from data they already own, and the mechanism that surfaces what else they could order.",
    },
    evidence: [
      {
        title: "A full UI audit of the shipped product",
        body:
          "Before proposing anything I audited every screen of the live platform for consistency, contrast, spacing and edge cases, and annotated it in Figma. Most issues were structural: the same concept styled three ways, and states that had never been designed.",
      },
      {
        title: "Interviews that did not lead the witness",
        body:
          "I wrote the interview guide for customer conversations with one rule: never pitch a feature. Ask how they last used the product, watch, and note the pain points it could solve. Cross-report questions and exporting to a spreadsheet came up unprompted.",
      },
      {
        title: "Static prompts were being ignored",
        body:
          "The suggested prompts above the chat bar were the same three sentences for every dataset. I prototyped prompt generation against real report data to produce starters that depend on what the user actually has.",
      },
      {
        title: "Engineering had to be able to build it in one step",
        body:
          "A full rebuild would have split the product in two and starved an enterprise customer base of updates. The design had to look like a different product while running on the same backend.",
      },
    ],
    tradeoffs: [
      {
        decision: "Re-flow the whole app, add one new capability",
        gave: "The full vision: data sources separated from reports, mixed sources, generated report templates",
        got: "A chat-first product that engineering could ship on the existing backend, with chat across multiple reports as the single new feature",
        why: "The redesign is phased. Phase one moves everything around a central conversation and proves appetite for openness. Source management, source mixing and new report types follow once the bones are right.",
      },
      {
        decision: "Two kinds of chat, made visibly different",
        gave: "One all-knowing assistant everywhere",
        got: "A global chat on the home page and a scoped chat inside each report, with the scope stated in the interface",
        why: "An omniscient chat inside a report could quietly rewrite the report beyond its own title. Scoping it, and saying so with an info tooltip and distinct icons in history, keeps the mental model honest until context switching is designed properly.",
      },
      {
        decision: "Do not touch the dashboards",
        gave: "Fixing years of chart and filter inconsistencies in the same release",
        got: "A redesign that ships on time and does not break what customers rely on daily",
        why: "The navigation, sidebar, home and chat changed. Every dashboard inside a report stayed exactly as it was, down to filters and tooltips, so existing customers could find everything they were used to.",
      },
      {
        decision: "Build the prototype in code",
        gave: "Time that could have gone into more Figma screens",
        got: "A prototype that streams a real model, keeps state, and doubled as the source of the design system",
        why: "Chat interfaces cannot be judged from static frames. Latency, streaming, empty states and long transcripts only show up in a running thing. The prototype became where flows were tested and where the tokens now live.",
      },
    ],
    process: [
      {
        date: "Early 2025",
        title: "The first chat interface",
        body:
          "Designed Sena's original chat inside the report view, then the follow-ups: markdown formatting and structure for answers, preset prompt buttons, an integration selector in the chat bar, and the integrations page in settings.",
      },
      {
        date: "Late 2025",
        title: "Reimagining the platform",
        body:
          "A product workshop set the direction: transparency about what the AI is doing, control for the user, and AI as the entry point. I drafted the chat-first product model and the design system it would need.",
      },
      {
        date: "Late 2025",
        title: "Aligning with engineering",
        body:
          "Walked the flow with the engineering lead and agreed the MVP boundary: re-flow the app around chat, add multi-report context, keep the dashboards. Wrote the engineering ticket and groomed the Figma file for handoff.",
      },
      {
        date: "Early 2026",
        title: "Design system and first build",
        body:
          "Published a new design system in Figma and as a pure HTML and CSS component repo. QA'd the first engineering build screen by screen, designed the upload feature and its loading states, and fitted a cookie-preferences section into the existing settings layout rather than forcing a new one.",
      },
      {
        date: "Mid 2026",
        title: "The working prototype",
        body:
          "Ported the prototype to SvelteKit with a streaming model behind it: home with generated starters, chat with attached sources, side chat inside reports, a saved library, credits, and a simulation mode that turns a forecast into a costed decision with an editable presentation.",
      },
      {
        date: "Mid 2026",
        title: "Design system productionised",
        body:
          "Tokens moved to a single JSON source that generates the CSS, verified value for value against the hand-written original. Storybook deployed. The Figma library was regenerated from the same tokens, with every component bound to variables.",
      },
    ],
    solution: [
      {
        title: "A home page that is a conversation",
        body:
          "The chat input is the primary object on the home page. Starters are generated from the data the customer actually holds. Recent reports sit below, ranked by activity rather than purchase date. Data sources can be dragged or attached before the first message.",
        figure: "home",
      },
      {
        title: "Inside a report, the chat stays open",
        body:
          "A collapsible side chat travels with the user across every tab of a report. Its context is the report, and the interface says so. The sidebar collapses to a rail and expands on hover without shifting the layout, so the dashboards keep their width.",
        figure: "report",
      },
      {
        title: "From forecast to decision",
        body:
          "In the prototype, a simulation opens by asking which decision it supports, then proposes researched assumptions and three costed actions the user reacts to. The result reads as an argument: chart, target, assumptions, actions, paths to the target with a price on each, and an honest confidence card. One button turns it into an editable deck.",
        figure: "simulation",
      },
      {
        title: "One source of truth for the system",
        body:
          "Tokens in JSON generate the CSS the app uses, the Storybook that documents it, and the Figma variables designers pick from. Change a value once and all three move. Manual edits in Figma are detected as drift before a push, never silently overwritten.",
        figure: "system",
      },
    ],
    build: [
      {
        title: "Prototype with a real model behind it",
        body:
          "SvelteKit on Vercel, streaming responses, saved chats and artefacts, and a credit ledger. Over four hundred tests cover the parsing, the simulation engine and the deck builder.",
      },
      {
        title: "Token pipeline with a verifier",
        body:
          "A Style Dictionary build generates the CSS from DTCG tokens. A verifier resolves every variable chain and proves each computed value matches the previous hand-written CSS in both light and dark mode.",
      },
      {
        title: "A Figma library that mirrors the code",
        body:
          "Primitives, semantic colours in light and dark modes, spacing, radius and typography as variables, plus text and effect styles and a core component set. Every component audited for unbound paints.",
      },
      {
        title: "Handoff the team can read",
        body:
          "Each prototype session ends with a written log of what shipped, why, and the gotchas, so the next engineer or designer can pick it up cold.",
      },
    ],
    outcome: {
      summary:
        "Sena moved from a chat box inside a report to the organising idea of the platform. The MVP shipped to engineering with a clear boundary, the prototype now carries flows too dynamic for Figma, and the design system is a maintained pipeline rather than a document.",
      metrics: [
        { value: "1", label: "Platform redesign shipped without forking the product" },
        { value: "3", label: "Surfaces kept in sync from one token source: app CSS, Storybook, Figma" },
        { value: "17", label: "Text styles and 9 effect styles regenerated from code" },
        { value: "6", label: "Core components fully variable-bound in Figma" },
      ],
      open:
        "Explicit data-source management, mixing sources in one report and generated report templates are the next phases. The prototype is where each one gets tested before it is specified.",
    },
    reflection: [
      "Chat products are judged in motion. Static frames convinced nobody; a streaming prototype settled arguments in minutes.",
      "The most useful design document was the boundary: what changes, what stays exactly the same, and the single new thing.",
      "A design system only stays true if it is generated. The moment values were typed twice they drifted.",
    ],
  },
  {
    slug: "rwazi-customer-platform",
    name: "Rwazi Customer Platform",
    thesis:
      "Bringing design to an analytics product that engineers had built alone. A design system first, then the dashboards, modules and growth flows on top of it.",
    description:
      "Rwazi's consumer and retail intelligence dashboards for enterprise brands. First designer on the platform: design system, data visualisation, new modules and the self-serve funnel.",
    logo: null,
    snapshot: {
      role: "First and only product designer on the platform, later leading platform design",
      team: "With the engineering lead, product, sales and customer success",
      platform: "Web app on a dashboard template. Figma, CSS handoff, product analytics and session recordings",
      timeline: "2024 to 2025",
      status: "Live for enterprise customers. Superseded in part by the Sena redesign",
    },
    headline: [
      { value: "0 → 1", label: "Designers on the platform when I started, and the design system that followed" },
      { value: "3", label: "Versions of the Consumer Insights dashboard in the first three months" },
      { value: "4", label: "Visualisation families defined for the data the platform actually holds" },
      { value: "A/B", label: "Self-serve sign-up shipped as two pages so sales could split traffic" },
    ],
    problem: {
      user:
        "Brand managers opened a report and met dense tables, small numbers without labels and charts that changed style from page to page. The important figure was rarely the most visible one, and edge cases, empty states and long labels had never been designed.",
      business:
        "The platform had been built by engineers under delivery pressure, and new features always beat fixes. Sales was driving prospects straight into demo dashboards through a quick sign-up link, so first impressions were now a revenue problem, not a polish problem.",
    },
    evidence: [
      {
        title: "An honest assessment of the current state",
        body:
          "Organisation, consistency of text and button sizes, contrast, and edge cases such as the profile section not matching the rest of the app. I documented it before proposing changes, which made prioritisation a shared conversation instead of a taste argument.",
      },
      {
        title: "Support tickets as a research corpus",
        body:
          "I read through support tickets to identify recurring UX problems, and gathered sales feedback on where prospects stalled in checkout. Both fed directly into the backlog.",
      },
      {
        title: "Watching prospects use the demo",
        body:
          "Session recordings on the quick sign-up flow showed where prospects clicked, hovered and left. That pointed at landing them on insights rather than a map, and at reassuring them about data quality before asking for anything.",
      },
      {
        title: "Instrument the experiments, not just the designs",
        body:
          "For the sign-up redesign I asked for analytics events on page load and each button so the two variants could be compared on retention and lead conversion, rather than shipped and admired.",
      },
    ],
    tradeoffs: [
      {
        decision: "Tweak the template rather than replace it",
        gave: "A clean-slate visual identity",
        got: "A system engineering could adopt component by component without a rewrite",
        why: "The template's Figma files were not built for scale, so I rebuilt them as proper components with variables. That gave the team a shared library quickly and left the door open to a full redesign later, which Sena became.",
      },
      {
        decision: "Four visualisation families instead of a chart per question",
        gave: "Bespoke charts for every dataset",
        got: "Predictable, comparable views across reports",
        why: "Most of the data compares two variables. I defined families for number against number, long text against number, percentages, and short text against number, then documented edge cases for each: long labels, sparse data, single values.",
      },
      {
        decision: "A palette with tints and a matched grey scale",
        gave: "Freedom to pick any brand colour per chart",
        got: "Charts that read in light and dark mode and never fight the interface",
        why: "Independent colours in different shades made dashboards noisy. Tints of a small set plus greys built for both modes let series stay distinguishable while the surface stays quiet.",
      },
      {
        decision: "Two landing pages, not one clever one",
        gave: "A single optimised sign-up page",
        got: "A real A/B test that sales could run by splitting links",
        why: "Rather than argue about which reassurance worked, both variants shipped on separate URLs with tracked events. The default dashboard mapping per industry came with it so prospects landed on relevant data.",
      },
    ],
    process: [
      {
        date: "Early 2024",
        title: "First dashboard and the audit",
        body:
          "Designed the first report dashboard, matched it to the platform theme, added the missing filters, and used the work to audit everything around it.",
      },
      {
        date: "Mid 2024",
        title: "Consumer Insights v1 to v3",
        body:
          "Filters for gender, age and location, summary graphs as a hero, honeycomb and partition views for demographics, and three iterations in quick succession as the data team fed back.",
      },
      {
        date: "Late 2024",
        title: "Client-facing dashboard redesign",
        body:
          "Redesigned the main dashboard, navigation and order report, added cross-filtering, and designed the pricing module with its percentage-change graph. Made the insights dashboard responsive.",
      },
      {
        date: "Early 2025",
        title: "New modules",
        body:
          "POS data dashboard, share of shelf, retail audit tables, product ratings and reviews, a PDF report viewer, multi-month views, KPI detail improvements and a pricing page with an updated checkout.",
      },
      {
        date: "Mid 2025",
        title: "Growth flows and the brand scorecard",
        body:
          "Quick sign-up experiments with CSS handed off for the build, a brand scorecard that rolls sub-scores into one number with actionable detail, and separate sign-in pages per product line.",
      },
      {
        date: "Late 2025",
        title: "Design system complete, redesign begins",
        body:
          "With the component library finished, the work shifted to new concepts for the whole platform, which became the Sena redesign.",
      },
    ],
    solution: [
      {
        title: "Dashboards with a hierarchy",
        body:
          "One hero summary, then supporting charts, then tables. Filters in a consistent bar. Each chart labelled the same way, sized from the same grid, with defined empty and overflow states.",
        figure: "dashboard",
      },
      {
        title: "Visualisation families",
        body:
          "Four families cover almost every comparison the data supports. Each has a defined default chart, an alternative, and rules for long labels, sparse data and single values, so engineers never have to invent a treatment.",
        figure: "families",
      },
      {
        title: "Self-serve sign-up that primes, then delivers",
        body:
          "A prospect arrives from a sales link, sees the industry named, a short reassurance about data quality, and lands in a relevant demo dashboard. An onboarding walkthrough and a booking prompt follow inside the app.",
        figure: "signup",
      },
      {
        title: "Brand scorecard",
        body:
          "A single score built from categories such as affinity and churn risk, shown with the metrics that drive it and a clear route to the detail behind each. Designed to be comparable across brands and to trigger next actions on the platform.",
        figure: "scorecard",
      },
    ],
    build: [
      {
        title: "Component library with variables",
        body:
          "Rebuilt the template's components in Figma with variables and states so the library could be used consistently across every module.",
      },
      {
        title: "CSS handoff for critical flows",
        body:
          "For sign-up I delivered CSS alongside the design so the build matched to the pixel and shipped faster.",
      },
      {
        title: "Onboarding without engineering time",
        body:
          "Built the onboarding walkthrough and scheduling prompt in the in-app guidance tool, with a theme matching the platform's type and colour so it read as part of the product.",
      },
      {
        title: "Data visualisation edge cases, documented",
        body:
          "A reference in Figma for how each chart behaves with long labels, empty data and single values, so quality does not depend on who is implementing.",
      },
    ],
    outcome: {
      summary:
        "The platform went from having no designer to having a design system, a documented visualisation language, and a queue where every new module is designed before it is built. The growth funnel became measurable.",
      metrics: [
        { value: "1", label: "Design system adopted across the platform" },
        { value: "10+", label: "Modules designed, from consumer insights to brand scorecard" },
        { value: "2", label: "Product lines given their own entry points" },
        { value: "→ Sena", label: "The redesign this work made possible" },
      ],
      open:
        "The template's limits were reached. The next step was a platform built around the conversation, which is the Sena case study.",
    },
    reflection: [
      "Document the current state before you critique it. A shared, honest picture turned prioritisation into a conversation.",
      "Families beat one-offs. Defining four visualisation types did more for quality than any single beautiful chart.",
      "Ask for the events with the design. A redesign nobody can measure is an opinion.",
    ],
  },
  {
    slug: "ela-conversational-logs",
    name: "Ela · Conversational Logs",
    thesis:
      "Turning static survey forms into conversations. A feature for Ela's mobile app that collects the same structured data with richer context, and keeps people talking.",
    description:
      "Ela's mobile app asked people to fill forms. Conversational logs let Ela ask instead, with widgets, photo checks and follow-ups that become insight.",
    logo: "/work/logos/withela.png",
    snapshot: {
      role: "Product designer: concept, flows, widgets, prototype, engineering tickets and QA",
      team: "With the mobile design director and the iOS and Android engineers",
      platform: "iOS and Android app. Figma, a web prototype, Asana tickets with annotated QA",
      timeline: "Concept, late 2025. Widgets and validation, early 2026. V1 shipped mid 2026, V2 followed",
      status: "Live in production on both platforms",
    },
    headline: [
      { value: "Form → chat", label: "Same required data, collected as a conversation" },
      { value: "2", label: "Platforms shipped, iOS and Android" },
      { value: "V2", label: "Topic linking and free chat added within weeks of V1" },
      { value: "3", label: "Kinds of photo check before an image counts" },
    ],
    problem: {
      user:
        "Filling in a form on a phone is a chore. People rushed, skipped, or quit. Even when they finished, a form only captured what it asked, never the reason behind an answer.",
      business:
        "Shallow answers limited the depth of the data, lower completion hurt retention, and a form looked like every other app. A conversational approach could improve completion and produce richer, better-structured data at the same time.",
    },
    evidence: [
      {
        title: "Forms lose people",
        body:
          "Drop-off on static logs was the starting point. The pattern was consistent: long forms lost people midway, and short ones produced thin data. Both pointed to the medium, not the questions.",
      },
      {
        title: "Photos were a quality problem",
        body:
          "Uploaded images were often blurry, too small, or contained people. Reviewers spent time rejecting what the app should never have accepted. That became the validation design.",
      },
      {
        title: "Prototype first, tickets second",
        body:
          "I built the flows as a clickable web prototype so the team could feel the pacing of a conversation before anything was specified. The prototype settled the widget set and the completion moment.",
      },
      {
        title: "QA on the real build",
        body:
          "After V1 shipped I tested on production builds of both platforms and filed annotated tickets with pixel measurements, then a consolidated feedback page so engineering had one place to look.",
      },
    ],
    tradeoffs: [
      {
        decision: "Required questions stay structured",
        gave: "A fully free conversation",
        got: "Data stored identically to form submissions, so nothing downstream had to change",
        why: "Ela asks every mandatory question and stores each answer in the same structure a form would. Follow-ups are stored separately as contextual insight. Required and contextual data are never mixed.",
      },
      {
        decision: "Hard and soft photo validation",
        gave: "Rejecting everything questionable automatically",
        got: "Low-quality images removed silently, borderline ones flagged for the user to decide",
        why: "Too-small images are dropped. Blurry images or ones with people are flagged with a preview so the user can see what they are keeping or removing. Auto-close rules depend on how the preview was entered, to avoid accidental removals.",
      },
      {
        decision: "Ship V1 with known cosmetic issues",
        gave: "A pixel-perfect first release",
        got: "Real usage weeks earlier, and a V2 shaped by it",
        why: "The widgets worked. The visual issues did not block anyone. We released, I QA'd production, and V2 carried the fixes plus topic linking and free chat.",
      },
      {
        decision: "A completion that flows into chat, not a card that ends it",
        gave: "A tidy summary screen",
        got: "A log that continues as a conversation on the same topic",
        why: "Several completion treatments were explored, including an animated hand-off that was dropped because it put spectacle between the user and the chat. The final version shows a status tag and keeps talking.",
      },
    ],
    process: [
      {
        date: "Late 2025",
        title: "Concept and business case",
        body:
          "Defined the UX problem, the business context, the feature set and the acceptance criteria in a single ticket the team could rally around.",
      },
      {
        date: "Early 2026",
        title: "Integration flow and widgets",
        body:
          "Designed how a log is chosen and started, then the widget set: sliders, pickers, multiple choice, text, and upload for iOS and Android, each with its own engineering ticket.",
      },
      {
        date: "Spring 2026",
        title: "Photo checks",
        body:
          "Designed the validation states for low-resolution, blurry and people-containing images, with a preview flow and clear messages. Released after QA confirmed each case.",
      },
      {
        date: "Mid 2026",
        title: "V1 in production",
        body:
          "Conversational logs shipped on both platforms. I tested the production builds and filed annotated QA tickets within the release cycle.",
      },
      {
        date: "Mid 2026",
        title: "V2: topic linking and free chat",
        body:
          "A completed log now links to its topic and can continue as a free conversation. The chat appears in history with a log card at the top so its origin is clear.",
      },
    ],
    solution: [
      {
        title: "The log as a conversation",
        body:
          "Ela asks, the user answers with a widget or a message, Ela reacts with a tip or a follow-up, and the required data is captured along the way. Progress is saved if the user leaves.",
        figure: "flow",
      },
      {
        title: "Widgets that answer fast",
        body:
          "A slider for a rating, a picker for a quantity, chips for multiple choice, and an upload that checks the image before it is accepted. Each widget has loading, error and retry states.",
        figure: "widgets",
      },
      {
        title: "Photo checks the user understands",
        body:
          "Too small: removed automatically. Blurry or contains people: flagged with a preview and a plain explanation. The user keeps or removes, and the review pane closes itself only when it is safe to.",
        figure: "photos",
      },
      {
        title: "From a log to a topic",
        body:
          "When a log completes it links to its topic and offers to keep going. The header image switches from the log to the topic, the chat is saved to history, and the log card sits at the top of the thread.",
        figure: "linking",
      },
    ],
    build: [
      {
        title: "One ticket per widget per platform",
        body:
          "Engineering tickets were split by widget and platform so work could be scheduled independently and QA'd against a single acceptance list.",
      },
      {
        title: "Failure paths specified separately",
        body:
          "A failed submission and a slow first AI reply are different failures. Each has its own retry copy, timing and exit, so the app never claims something was saved when it was not.",
      },
      {
        title: "Annotated QA",
        body:
          "Screenshots with pixel annotations in Figma, linked from the tickets, and a single consolidated feedback page per release.",
      },
      {
        title: "Prototype as the shared reference",
        body:
          "The web prototype stayed the place where new flows were tried before being drawn for mobile.",
      },
    ],
    outcome: {
      summary:
        "Conversational logs are live on iOS and Android, collecting the same structured data forms did, with contextual follow-ups and a path into a longer conversation. V2 shipped weeks after V1.",
      metrics: [
        { value: "2", label: "Releases in production within the first two months" },
        { value: "5", label: "Widget types, each on both platforms" },
        { value: "1", label: "Data structure, unchanged for downstream analysis" },
        { value: "0", label: "Silent failures: every error path has copy and a way out" },
      ],
      open:
        "Measuring completion and depth against the old forms at scale is the next step, along with search across log-originated chats.",
    },
    reflection: [
      "Prototype the pacing. Conversations are about rhythm, and rhythm is invisible in a static frame.",
      "Separate the failures. One vague error state hides two different problems; naming both made the fixes obvious.",
      "Ship, then QA in production with the same rigour you used in design.",
    ],
  },
  {
    slug: "ela-web",
    name: "Ela · Web",
    thesis:
      "From a single-page marketing site to interactive tools that convert. Four quizzes became one connected experience, a signed-in hub, a share loop and a route into the app.",
    description:
      "Ela's web presence rebuilt around tools people actually use: topic quizzes with a shareable read, a hub that remembers you, and a prototype web app ported from static HTML to SvelteKit.",
    logo: "/work/logos/withela.png",
    snapshot: {
      role: "Product design and front-end build",
      team: "With the mobile design director and a growth lead who wrote the website brief",
      platform: "Static HTML prototype, then SvelteKit on Vercel. Shared design system with the mobile app",
      timeline: "Benchmark and brief, spring 2026. Quiz funnel, early summer. SvelteKit port and web app, mid 2026",
      status: "Quiz funnel live. Web app in prototype, being merged with the quizzes",
    },
    headline: [
      { value: "4 → 1", label: "Standalone quizzes turned into one connected experience" },
      { value: "0", label: "Sign-ups required to take a quiz and get a read" },
      { value: "1", label: "Design system shared between the mobile app and the web" },
      { value: "22", label: "Screens in the static prototype the SvelteKit app was ported from" },
    ],
    problem: {
      user:
        "People heard about Ela and landed on a page that described an app. There was nothing to do, nothing to try, and nothing to share. The only call to action was a store button.",
      business:
        "Paid traffic needed to convert to installs, organic visitors needed a way to discover Ela by topic, and the product needed a viral loop. A brochure could do none of those. Interactive tools with a gated result could do all three.",
    },
    evidence: [
      {
        title: "A benchmark of how others convert",
        body:
          "I reviewed how comparable consumer apps use quizzes, scores and shareable results to move visitors to install, and what they gate. The pattern that repeated: give a real result for free, gate the depth.",
      },
      {
        title: "The brief asked for tools, not pages",
        body:
          "The website brief defined three jobs: convert paid traffic through tool-specific landing pages, let organic visitors discover by topic, and power the share and compare loop. Every design decision was checked against those three.",
      },
      {
        title: "Lean beats a full redesign",
        body:
          "Rather than rebuild the whole site, the team chose to ship landing pages with interactive tools first and measure. The homepage could wait; the tools could not.",
      },
      {
        title: "Testing the funnel end to end",
        body:
          "Each release came with a test script: take a quiz, return to the hub, open a shared link in a private window, scan the QR on a phone. If the loop broke anywhere, it did not ship.",
      },
    ],
    tradeoffs: [
      {
        decision: "Fake the sign-in first",
        gave: "Real accounts from day one",
        got: "A hub that remembered you within a week, and a clear spec for real auth",
        why: "Finishing a quiz signs you in locally, so the hub can greet you and show where you left off. That proved the experience before the account system was built, and the sign-up and sign-in flows were then specified against it.",
      },
      {
        decision: "Shareable results are read-only for the recipient",
        gave: "Letting a friend edit or retake in place",
        got: "A share link that shows someone's read and invites the recipient to take their own",
        why: "The recipient sees the sharer's result with a banner to take the quiz themselves, without being signed in. That is the loop: a result becomes an invitation.",
      },
      {
        decision: "Port to SvelteKit, keep the static prototype as reference",
        gave: "One codebase",
        got: "A real app with routing and state, and a frozen reference that still carries flows not yet ported",
        why: "The static HTML track had no build step and was fast to iterate. Once flows stabilised, the SvelteKit port gave state, auth and an API route. The static pages remain the source the port copies from.",
      },
      {
        decision: "Share one design system with the mobile app",
        gave: "Web-specific visual freedom",
        got: "A web experience that feels like the app it is sending people to",
        why: "The web reuses the app's tokens, type and components. A visitor who installs the app after a quiz recognises it immediately.",
      },
    ],
    process: [
      {
        date: "Spring 2026",
        title: "Benchmark and brief",
        body:
          "Reviewed conversion patterns across comparable products and helped shape the website brief around tools, topic hubs and the share loop.",
      },
      {
        date: "Spring 2026",
        title: "Score prompts",
        body:
          "Prototyped quizzes driven by a model that asks questions and returns a score and a read for a topic, so results feel personal rather than bucketed.",
      },
      {
        date: "Early summer 2026",
        title: "Four quizzes, one experience",
        body:
          "Connected the quizzes through a signed-in hub with a continue prompt, remaining-first ordering and a progress bar. Added a get-the-app page with a QR that routes to the right store, and shareable read-only results.",
      },
      {
        date: "Mid 2026",
        title: "Go-live and the SvelteKit port",
        body:
          "Prepared the production checklist with the engineering team, then ported the static prototype to SvelteKit with its own API route and admin gate.",
      },
      {
        date: "Mid 2026",
        title: "Merging quiz and app",
        body:
          "The quiz prototype is being folded into the web app so a visitor's results persist through sign-up and the hub becomes the app's home.",
      },
    ],
    solution: [
      {
        title: "A quiz that gives a real read",
        body:
          "Free, no sign-up, a handful of questions, and a result written for you rather than a category. The depth is what the app offers.",
        figure: "quiz",
      },
      {
        title: "A hub that remembers you",
        body:
          "Finish one quiz and the hub greets you by name, points at the next unfinished one, and marks what you have done. The route to the app is one tap away.",
        figure: "hub",
      },
      {
        title: "A result that invites",
        body:
          "Share a read and the recipient opens it read-only with a banner to take the quiz themselves. No account needed on either side.",
        figure: "share",
      },
      {
        title: "From static pages to an app",
        body:
          "The static track proved the flows; the SvelteKit app carries them forward with state, sign-in and an API. The design system sits underneath both.",
        figure: "architecture",
      },
    ],
    build: [
      {
        title: "No build step until it earned one",
        body:
          "The static prototype is plain HTML and shared CSS, editable in a browser. It stays as the reference implementation.",
      },
      {
        title: "SvelteKit port with production behaviour",
        body:
          "Routing, state, an API route for the model, an admin gate that fails closed, and security headers verified in a production build.",
      },
      {
        title: "Device-aware download",
        body:
          "A QR and a download route that detect the device and send the visitor to the right store.",
      },
      {
        title: "Go-live checklist",
        body:
          "Verification steps agreed with engineering before production: environment, secrets, routes and the reset path for testers.",
      },
    ],
    outcome: {
      summary:
        "Ela's web went from describing the product to being a first taste of it. Visitors get a real result, can share it, and are routed to the app on the right device. The prototype web app now carries the same design system as mobile.",
      metrics: [
        { value: "4", label: "Topic quizzes live with shareable reads" },
        { value: "1", label: "Hub connecting them, with continue-where-you-left-off" },
        { value: "2", label: "App stores reached from one device-aware QR" },
        { value: "1", label: "Design system across mobile and web" },
      ],
      open:
        "Real accounts that carry quiz results into the app, and topic hubs for organic discovery, are the next pieces.",
    },
    reflection: [
      "Give something real for free. The read is the marketing.",
      "Prototype without a build step, port when the flows stop moving.",
      "A share is an invitation, so design the recipient's view as carefully as the sharer's.",
    ],
  },
];
