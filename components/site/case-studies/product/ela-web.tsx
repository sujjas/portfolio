import { ElaWebQuizHiFi, ElaWebHubHiFi } from "./hifi/ElaScreens";
import { Figure, FlowSteps, Pipeline } from "./figures";

export function WebShare() {
  return (
    <Figure title="The share loop" meta="Result → invitation" note="The recipient stays a guest. Nothing about them is stored until they take a quiz themselves, at which point the hub starts remembering them too.">
      <FlowSteps
        highlightLast
        steps={[
          { label: "Finish a quiz", note: "Signed in locally. The hub now remembers you." },
          { label: "Share", note: "The link carries the result, not just the quiz." },
          { label: "Friend opens", note: "Read-only view of your read, titled with your name." },
          { label: "Banner", note: "Take the quiz yourself, one tap, no account." },
          { label: "Their read", note: "Now they have a result to share. The loop repeats." },
        ]}
      />
    </Figure>
  );
}

export function WebArchitecture() {
  return (
    <Figure title="From static pages to an app" meta="Two tracks, one design system" note="The static track has no build step and remains the reference the port copies from. The SvelteKit app carries state, sign-in and an API route, and reads its tokens from the same design system the mobile app uses.">
      <Pipeline
        nodes={[
          { label: "Design system", sub: "Shared with the mobile app", tone: "dark" },
          { label: "Static prototype", sub: "HTML + CSS, 22 screens, quiz funnel" },
          { label: "SvelteKit app", sub: "Routing, state, API route, admin gate", tone: "accent" },
          { label: "Vercel", sub: "Separate projects, ignore-step per track" },
        ]}
      />
    </Figure>
  );
}

export function WebFigure({ name }: { name?: string }) {
  switch (name) {
    case "quiz":
      return <ElaWebQuizHiFi />;
    case "hub":
      return <ElaWebHubHiFi />;
    case "share":
      return <WebShare />;
    case "architecture":
      return <WebArchitecture />;
    default:
      return null;
  }
}
