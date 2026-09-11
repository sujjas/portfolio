import { Block, HairLine, Wireframe } from "../primitives";
import { Figure, FlowSteps, Pipeline } from "./figures";

export function WebQuiz() {
  return (
    <Wireframe
      title="Quiz · landing to read"
      meta="Wireframe"
      annotations={[
        { x: 400, y: 40, label: "Free · No sign-up pill centred in the nav on every page" },
        { x: 220, y: 200, label: "One question at a time, topic colour, progress in the corner" },
        { x: 600, y: 200, label: "The read: written for you, not a bucket label" },
        { x: 600, y: 470, label: "Share and Get the app, in that order" },
      ]}
    >
      <Block x="20" y="20" w="100" h="36" label="Ela" tone="dark" />
      <Block x="320" y="24" w="160" h="28" label="Free · No sign-up" />
      <Block x="560" y="20" w="100" h="36" label="All quizzes" tone="accent" />
      <Block x="670" y="20" w="110" h="36" label="Sign up free" />
      <HairLine y="80" />
      <Block x="20" y="100" w="370" h="440" label="" />
      <text x="40" y="150" fontSize="11" fontFamily="inherit" fill="#a3a3a3">
        QUESTION 4 OF 8
      </text>
      <text x="40" y="190" fontSize="20" fontFamily="inherit" fontWeight="600" fill="#0a0a0a">
        When money is tight, you…
      </text>
      <Block x="40" y="220" w="330" h="44" label="Cut back quietly" />
      <Block x="40" y="274" w="330" h="44" label="Look for a cheaper way to do the same" tone="accent" />
      <Block x="40" y="328" w="330" h="44" label="Borrow and sort it later" />
      <Block x="40" y="382" w="330" h="44" label="Ignore it until payday" />
      <Block x="40" y="480" w="330" h="40" label="Next" tone="dark" />

      <Block x="410" y="100" w="370" h="440" label="" tone="accent" />
      <text x="430" y="150" fontSize="11" fontFamily="inherit" fill="#7c3aed">
        YOUR MONEY READ
      </text>
      <text x="430" y="190" fontSize="20" fontFamily="inherit" fontWeight="600" fill="#0a0a0a">
        The quiet optimiser
      </text>
      <Block x="430" y="215" w="330" h="180" label="Three paragraphs, written from your answers" />
      <Block x="430" y="410" w="160" h="40" label="Share your read" />
      <Block x="600" y="410" w="160" h="40" label="Get the app" tone="dark" />
      <Block x="430" y="470" w="330" h="50" label="Go deeper in the app · gated" />
    </Wireframe>
  );
}

export function WebHub() {
  return (
    <Wireframe
      title="Hub · signed in"
      meta="Wireframe"
      annotations={[
        { x: 400, y: 150, label: "Greeting by name and a Continue where you left off hero" },
        { x: 400, y: 260, label: "Progress across the four topics" },
        { x: 200, y: 400, label: "Remaining quizzes first; done ones show a tick and View your read" },
        { x: 600, y: 540, label: "Get Ela on your phone, with a QR that routes to the right store" },
      ]}
    >
      <Block x="20" y="20" w="100" h="36" label="Ela" tone="dark" />
      <Block x="320" y="24" w="160" h="28" label="Free · No sign-up" />
      <Block x="670" y="20" w="110" h="36" label="Get the app" tone="accent" />
      <HairLine y="80" />
      <text x="20" y="120" fontSize="22" fontFamily="inherit" fontWeight="600" fill="#0a0a0a">
        Welcome back, Maya.
      </text>
      <Block x="20" y="140" w="760" h="90" label="Continue where you left off → Health quiz, 3 questions in" tone="accent" />
      <Block x="20" y="250" w="760" h="18" label="" />
      <Block x="20" y="250" w="380" h="18" label="2 of 4 complete" tone="dark" />
      <HairLine y="300" label="Quizzes" />
      <Block x="20" y="320" w="180" h="150" label="Health · continue" tone="accent" />
      <Block x="213" y="320" w="180" h="150" label="Business · start" />
      <Block x="406" y="320" w="180" h="150" label="✓ Love · view read" />
      <Block x="599" y="320" w="181" h="150" label="✓ Money · view read" />
      <HairLine y="500" label="Get the app" />
      <Block x="20" y="515" w="500" h="65" label="Value props · App Store · Google Play" />
      <Block x="540" y="515" w="240" h="65" label="QR · device-aware" tone="dark" />
    </Wireframe>
  );
}

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
      return <WebQuiz />;
    case "hub":
      return <WebHub />;
    case "share":
      return <WebShare />;
    case "architecture":
      return <WebArchitecture />;
    default:
      return null;
  }
}
