# screens/ — DEPRECATED (static prototype)

> **Frozen since 2026-07-30. Do not add features here.** These are the original
> static-HTML screen prototypes, superseded by the SvelteKit app in `svelte/`
> (routes are these filenames without `.html`: `screens/home.html` → `/home`).
> The folder stays because its deployed URLs are still shared and used; keep
> pages working, but build anything new in `svelte/` (see the root `CLAUDE.md`
> and `svelte/CLAUDE.md`).
>
> Run locally with `npm start` at the repo root (legacy Node server on
> `http://localhost:3000`, needs `ANTHROPIC_API_KEY` in `.env.local`).
> A fix to shared behavior likely belongs in `../design-system/screen.js`.

Everything below is the original working guide for this tree, kept for anyone
maintaining these pages.

## Screen Flow

```
sign-in → (first run) → onboarding → home-new → (submit) → conversation → (generate) → custom-report
                                                       ↘ (connect apps) → data-sources
                                                       ↘ (sidebar) → log-creation (build a new survey/log)
                                                       ↘ (sidebar) → reports (listing of all reports)
                                                       ↘ (sidebar) → business-context
                                                       ↘ (trial row / gate) → plans → (mock payment) → subscription
                                                       ↘ (user-row menu) → subscription (Plan & billing)
```

| Screen | File | Description |
|---|---|---|
| Sign In | `sign-in.html` | Sign-in with email/password, forgot password, social auth |
| Onboarding | `onboarding.html` | First-run welcome: no sidebar, centered hero (logo + "Welcome to Sena") that stays put, scripted chat that captures first name → last name → company name → position, then 7 skippable context questions (department, industry, objectives, KPIs, geo, segments, competitors). On entry it resets `business_context` (keeping only description + company_size, the two company fields it doesn't ask). Ends with a "Start for free" button → `home-new`. |
| Home | `home.html` | Welcome + chat prompt + recent data grid |
| Home (post-onboarding) | `home-new.html` | Same shell as Home (welcome + chatbox + starters) but the Recent Data grid is replaced by a "Complete your profile" card: a progress bar mirroring the Business Context score (12 fields) + an inline composer that surfaces the next empty context field, saving each answer and advancing. Onboarding lands here. |
| Conversation | `conversation.html` | Active conversation with Sena |
| Custom Report | `custom-report.html` | Report with chat panel; add `?loading` to URL for progressive loading animation |
| Reports | `reports.html` | Reports listing with search, tab filters, status badges, data source indicators |
| Data Sources | `data-sources.html` | Data management: uploaded data table, consumer insights with progress, connected apps with toggles |
| Log Creation | `log-creation.html` | Blank starting state for building a new survey/log: empty Basic info card and empty question list. Tabs: Content / Settings / Target (Settings + Target are placeholders). |
| Log Example | `log-example.html` | Pre-filled sample log ("Beverage Habits Log") showing one question of each type from the spec. Same shell as Log Creation. |
| Consumer Insights | `consumer-insights.html` | Insights dashboard for a selected data set: demographics, locations map, satisfaction, motivations treemap, frequency donut, side chat with Sena |
| Retail Mapping · Home | `retail-mapping-home.html` | Retail mapping report home: project selector, tabs (Home/Map/Details + alpha), filters, KPI cards with sparklines, Share of Shelf treemap, side chat |
| Retail Mapping · Details | `retail-mapping-details.html` | Retail mapping details: 2-col grid of question cards (pie, outlet response lists with thumbnails, big-stat) + sub-filter (responses count, date range) |
| Retail Mapping · Map | `retail-mapping-map.html` | Retail mapping geo view: outlet-type filter strip, 3-col outlet card grid (photo + name + address), real OSM map via Leaflet with custom pins/labels |
| Users | `users.html` | User management with roles (Admin/Analyst/Viewer) and permission toggles |
| Business Context | `business-context.html` | User's business profile: company, role, market, objectives, KPIs |
| Plans | `plans.html` | Self-checkout funnel: four plan cards (Starters free 25 cr/mo, Growth 250 cr → $350/mo, Scaling up 500 cr → $675/mo, Custom slider 1k–50k cr → $1,250–$35,000/mo; annual = −20%) with monthly/annual toggle → mock payment → success (`SenaTrial.upgrade(label, cycle, price)`). Current plan is highlighted (Starters when unpaid; label match when paid). `?credits=5000` positions the Custom slider. |
| Plan & Billing | `subscription.html` | Subscription management: current plan card (Free/Active badge, plan label + stored price), upgrade/cancel (confirm modal; cancelling returns to Starters), mock billing history when paid. Entry: sidebar user-row menu. |

## Shared screen files (in `../design-system/`)

| File | Purpose |
|---|---|
| `screen.css` | Reset, base, app shell, conversation layout, message styles, theme toggle, animations |
| `screen.js` | `toggleTheme()`, `toggleSidebar()`, `wireSearchBars()`, `loadSidebar()`. Keyboard: `S` toggles sidebar, `M` toggles theme. Sidebar state persisted in `localStorage` key `sena-sidebar`. |
| `sidebar-partial.html` | Canonical sidebar HTML, copied into each screen with adjusted active states |
| `account-modal.js` | Account settings overlay (Profile / Security / Privacy), opened from the sidebar account menu. See [../docs/account-modal.md](../docs/account-modal.md) |
| `chat-engine.js` | Reusable chat instance (streaming, sena-chart cards, sena-deck cards) for screens beyond chat.html |
| `deck-builder.js` | `SenaDeck.download(deck, adapter)`: sena-deck JSON → .pptx via PptxGenJS, charts embedded as PNG. **Original 6-layout version** — the Svelte app rebuilt this as 15 layouts; see [../docs/deck-slides.md](../docs/deck-slides.md) |

## Free plan system (SenaTrial) — static copy

`window.SenaTrial` in `screen.js` drives the self-checkout funnel here. The unpaid state is the free Starters plan: 25 credits a month, resetting monthly, never expiring. States: `active` / `low` / `exhausted` / `paid`. Pricing in THIS copy: a Signal is 1 cr, presentation 50 cr, uploads/app connections 5 cr. **The Svelte app's `trial.js` is the live model and differs** (flat non-expiring balance, Signal 10, Insight 20, simulation/presentation 50, no monthly reset). Devmode (`?devmode`) adds a gear to the sidebar footer opening the admin modal.

## Screen Template

Every static screen includes:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sena — [Page Name]</title>

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=DM+Serif+Display&display=swap" rel="stylesheet">

  <!-- Design system: theme.css → component CSS → screen.css, in that order -->
  <link rel="stylesheet" href="../design-system/theme.css">
  <link rel="stylesheet" href="../design-system/buttons.css">
  <!-- ...component CSS as needed... -->
  <link rel="stylesheet" href="../design-system/sidebar.css">
  <link rel="stylesheet" href="../design-system/screen.css">

  <style>
    /* Only page-specific styles here */
  </style>
</head>
<body>

<div class="app bg-app">
  <!-- Sidebar (copy from ../design-system/sidebar-partial.html, adjust active states) -->

  <main class="main">
    <!-- Page content -->
  </main>
</div>

<script src="../design-system/screen.js"></script>
<script>
  // Page-specific JS here
</script>

</body>
</html>
```

## Maintaining a screen (legacy workflow)

1. Start from the Screen Template above; import only the component CSS actually used
2. Page-specific CSS goes in an inline `<style>`, never in `../design-system/`
3. Page-specific JS goes in an inline `<script>` after `screen.js`
4. The design rules (tokens, type, icons, copywriting) live in the root `CLAUDE.md` and apply here unchanged
