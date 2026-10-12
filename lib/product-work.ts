/**
 * Product case studies — Rwazi work. Design-first: a hero design, three
 * numbers, the problem in a sentence or two, then the screens with a line
 * each, the decisions that mattered, and the outcome. Every UI is live HTML
 * (the real prototype or app build), never a screenshot or a Figma export.
 * Rendered by app/product/[slug]/page.tsx behind the preview gate (proxy.ts).
 */

export type Metric = {
  value: string;
  label: string;
};

export type Screen = {
  title: string;
  caption: string;
  /** Named figure rendered by the per-study component set. */
  figure: string;
  /**
   * "split" sets a single phone beside its caption; "stack" (default) runs
   * the figure full width under it.
   */
  layout?: "split" | "stack";
};

export type Decision = {
  title: string;
  body: string;
};

export type ProductCaseStudy = {
  slug: string;
  name: string;
  /** One line under the title. */
  tagline: string;
  /** Card copy on the index and in metadata. */
  description: string;
  logo: string | null;
  meta: { role: string; platform: string; year: string; status: string };
  /** Figure shown straight under the cover. */
  hero: string;
  headline: Metric[];
  problem: string;
  screens: Screen[];
  decisions: Decision[];
  outcome: string;
  /** Live link, shown only when the product is public. */
  liveUrl?: string;
};

export const productCaseStudies: ProductCaseStudy[] = [
  {
    slug: "ela-budget",
    name: "Ela Budget",
    tagline:
      "A budgeting assistant that lives inside WhatsApp. I designed and built it, then launched it with a trial, referrals and paying users.",
    description:
      "WhatsApp-first budgeting for Uganda: log spending in plain words and be shown a cheaper way to buy what you already buy.",
    logo: "/work/logos/ela-budget.png",
    meta: {
      role: "Product design, build and growth",
      platform: "WhatsApp, Telegram, web",
      year: "2026",
      status: "Live",
    },
    hero: "conversation",
    headline: [
      { value: "< 6 mo", label: "From prototype to a live, paid product" },
      { value: "343", label: "Offers from 141 vendors across Kampala" },
      { value: "100%", label: "Organic growth during the pilot" },
    ],
    problem:
      "People in Kampala know roughly what they earn and very little about where it goes. Budgeting apps ask for a download and a daily ritual. WhatsApp is where people already type all day.",
    screens: [
      {
        title: "Shown a cheaper way to buy it",
        caption:
          "Ela prices what you already buy against offers collected across Kampala, starting from your first logged purchase.",
        figure: "savings",
        layout: "split",
      },
      {
        title: "Everything you logged, in one place",
        caption: "The companion web app, running here with demo data. Add an expense or set a budget.",
        figure: "app",
      },
      {
        title: "Reminders that know when to stop",
        caption:
          "Three windows a day, nothing within three hours of your own message, and the last reminder asks whether to keep going.",
        figure: "reminders",
        layout: "split",
      },
      {
        title: "No download, no sign-up",
        caption: "The landing page hands you to WhatsApp. Your first message is your first logged expense.",
        figure: "landing",
      },
    ],
    decisions: [
      {
        title: "Cut the Google sign-in step",
        body: "It was the biggest drop-off in the funnel. Now the first message is the first logged expense.",
      },
      {
        title: "Moved the savings moment to day one",
        body: "Most people who stopped did so in the first week, so the message that proves value could not wait until day six.",
      },
      {
        title: "Sent fewer reminders than we could",
        body: "People who switch reminders on were going to log anyway. The effort went into the first few days instead.",
      },
    ],
    outcome:
      "Live at budget.withela.com and growing in Kampala, with payment inside the chat and a second channel on Telegram.",
    liveUrl: "https://budget.withela.com",
  },
  {
    slug: "sena",
    name: "Sena",
    tagline:
      "Rwazi's AI copilot for market intelligence. I designed its first MVP and supported the design system and brand the flagship is built on.",
    description:
      "Rwazi's AI copilot for market intelligence: the first MVP, and the design system and brand behind the flagship.",
    logo: "/work/design/sena-mark.svg",
    meta: {
      role: "MVP design; design system and brand support",
      platform: "Web app",
      year: "2025–2026",
      status: "Live for enterprise customers",
    },
    hero: "mvp-home",
    headline: [
      { value: "1 → many", label: "Reports one conversation can use as context" },
      { value: "240", label: "Design tokens in the system" },
      { value: "0", label: "Unbound colours in the Figma library" },
    ],
    problem:
      "Customers bought reports and got one dashboard per report. Real questions cut across reports, and the only chat could see a single one.",
    screens: [
      {
        title: "Inside a report, the chat stays open",
        caption:
          "A side chat follows you across every tab of a report and says which report it can see. The sidebar folds to a rail so the dashboards keep their width.",
        figure: "mvp-report",
      },
      {
        title: "A brand and a system to build on",
        caption: "Colour, type and components, set up once and shared by the app and the Figma library.",
        figure: "brand",
      },
      {
        title: "The flagship, built on that system",
        caption:
          "Today's product, running here as a static build of the real app. Two screens are included: home and a revenue simulation.",
        figure: "flagship",
      },
    ],
    decisions: [
      {
        title: "Chat became the home page",
        body: "The first screen asks what you want to know, with your reports one click away, instead of listing purchases.",
      },
      {
        title: "Two kinds of chat, visibly different",
        body: "A general chat sees everything you own. A report chat sees one report, and its icon and label say so.",
      },
      {
        title: "The dashboards stayed as they were",
        body: "Navigation, home and chat changed. Every dashboard kept its filters and tooltips, so customers lost nothing they knew.",
      },
    ],
    outcome:
      "The MVP moved chat from a box inside one report to the front door of the platform. The flagship now runs on the design system and brand I helped build.",
  },
  {
    slug: "rwazi-customer-platform",
    name: "Rwazi Customer Platform",
    tagline:
      "An enterprise market-intelligence platform that had grown without a designer. I gave it a design system and a visual language for its data.",
    description:
      "Rwazi's enterprise platform before Sena: dashboards with a hierarchy, a visualisation language and a self-serve sign-up.",
    logo: null,
    meta: {
      role: "First product designer on the platform",
      platform: "Web app",
      year: "2024–2025",
      status: "Live for enterprise customers",
    },
    hero: "dashboard",
    headline: [
      { value: "0 → 1", label: "Designers on the platform when I started" },
      { value: "4", label: "Visualisation families for the data it holds" },
      { value: "10+", label: "Modules designed, from insights to scorecards" },
    ],
    problem:
      "The platform had grown feature by feature on a dashboard template. Every chart looked different, and nothing was designed before it was built.",
    screens: [
      {
        title: "Four chart families, not a chart per question",
        caption:
          "Most of the data compares two things. Each family has a default chart and rules for long labels and sparse data.",
        figure: "families",
      },
      {
        title: "A sign-up that primes, then delivers",
        caption:
          "Prospects arrive from a sales link with their industry named, then land on the insights view for that industry.",
        figure: "signup",
      },
      {
        title: "Brand scorecard",
        caption:
          "One score built from categories such as affinity and churn risk, with the metrics behind it and a route to the detail.",
        figure: "scorecard",
      },
    ],
    decisions: [
      {
        title: "Tints and a matched grey scale",
        body: "Unrelated colours made dashboards noisy. Tints of a small set keep series distinct in light and dark.",
      },
      {
        title: "Rebuilt the template instead of replacing it",
        body: "Its Figma files became real components with variables, so the whole team worked from one library.",
      },
      {
        title: "Two landing pages, not one clever one",
        body: "Both variants shipped on separate URLs with tracked events, so sales could split traffic and compare.",
      },
    ],
    outcome:
      "The platform went from no designer to a shared design system, a documented visual language for data, and a rule that every new module is designed before it is built.",
  },
  {
    slug: "ela-conversational-logs",
    name: "Ela Conversational Logs",
    tagline:
      "Ela's surveys rebuilt as a conversation: the same structured data a form collects, gathered through chat on iOS and Android.",
    description: "Surveys in the Ela app, rebuilt as a conversation, with a widget for every kind of answer.",
    logo: "/work/design/ela-logo.svg",
    meta: {
      role: "Product design: concept, flows, widgets, prototype and QA",
      platform: "iOS and Android",
      year: "2025–2026",
      status: "Live on both platforms",
    },
    hero: "flow",
    headline: [
      { value: "Form → chat", label: "Same required data, collected as a conversation" },
      { value: "5", label: "Widget types, each on both platforms" },
      { value: "2", label: "Releases in the first two months" },
    ],
    problem:
      "Filling in a form on a phone is a chore. People rushed, skipped or quit, and a form never captured the reason behind an answer.",
    screens: [
      {
        title: "A widget for every answer",
        caption:
          "Text, single choice, multiple choice and rating, each a reply in the thread. These are the real prototype screens, so try them.",
        figure: "widgets",
      },
      {
        title: "Every error has a way out",
        caption:
          "If a submission fails, Ela retries, then apologises in plain words and offers a way back. Nothing fails silently.",
        figure: "snag",
        layout: "split",
      },
      {
        title: "From a log to a topic",
        caption: "A finished log can fold into a longer topic chat. An admin links the two and the conversation re-themes.",
        figure: "linking",
      },
    ],
    decisions: [
      {
        title: "Required questions stay structured",
        body: "Every answer is stored exactly as the form stored it, so nothing downstream had to change.",
      },
      {
        title: "Hard and soft photo checks",
        body: "Images that are too small are removed. Blurry ones, or ones with people, are flagged with a preview and the user decides.",
      },
      {
        title: "The ending flows into the chat",
        body: "An animated hand-off was dropped because it put spectacle between the user and the conversation.",
      },
    ],
    outcome:
      "Live on iOS and Android, collecting the same structured data forms did, with follow-ups a form could not ask. V2 added topic linking weeks after V1.",
  },
  {
    slug: "ela-web",
    name: "Ela Web",
    tagline:
      "Ela's website, turned from a page that described an app into quizzes people finish, share and come back to.",
    description:
      "Ela's web as a first taste of the product: quizzes with a real result, a hub that remembers you, and a route to the right app store.",
    logo: "/work/design/ela-logo.svg",
    meta: {
      role: "Product design and front-end build",
      platform: "Web",
      year: "2026",
      status: "Quiz funnel live",
    },
    hero: "quiz",
    headline: [
      { value: "4 → 1", label: "Standalone quizzes joined into one experience" },
      { value: "0", label: "Sign-ups needed to get a result" },
      { value: "1", label: "Design system shared with the mobile app" },
    ],
    problem:
      "People heard about Ela and landed on a page that described an app. There was nothing to try and nothing to share.",
    screens: [
      {
        title: "A hub that remembers you",
        caption:
          "Finish a quiz and you are signed in on that device, so the hub greets you and shows where you left off.",
        figure: "hub",
      },
      {
        title: "One QR code, the right store",
        caption: "The get-the-app page sends iPhones to the App Store and everything else to Google Play.",
        figure: "getapp",
      },
    ],
    decisions: [
      {
        title: "Faked the sign-in first",
        body: "Finishing a quiz signs you in locally. That proved the experience before the account system existed.",
      },
      {
        title: "Shared results are read-only",
        body: "A friend sees your result with a banner to take the quiz themselves. That is the loop.",
      },
      {
        title: "One design system with the app",
        body: "The web reuses the app's tokens, type and components, so the app feels familiar after a quiz.",
      },
    ],
    outcome:
      "Visitors now get a real result before installing anything, can share it, and land in the right app store.",
  },
];
