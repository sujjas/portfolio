import { NextResponse } from "next/server";

/**
 * Canned quiz "read" for the embedded Ela quiz funnel (public/design/ela/quiz).
 * Same shape as the production endpoint: archetype, lede, five traits, two
 * pairings, three tips. No model is called.
 */
const READS: Record<string, unknown> = {
  money: {
    archetype: "The Quiet Optimiser",
    lede: "You don't panic when money gets tight, you get resourceful. You'd rather find a cheaper way to keep the same life than give something up.",
    traits: [
      { name: "Resourceful", score: 88 },
      { name: "Planner", score: 64 },
      { name: "Impulse control", score: 71 },
      { name: "Risk appetite", score: 38 },
      { name: "Generosity", score: 76 },
    ],
    pairings: [
      { name: "The Steady Saver", blurb: "They slow you down just enough that the cheaper option also becomes the planned one." },
      { name: "The Bold Builder", blurb: "They take the swings you avoid, and you keep the lights on while they do." },
    ],
    tips: [
      "Log the small repeated things first. That is where your leaks hide.",
      "Give yourself one line in the budget that is allowed to be fun.",
      "When a deal shows up, check it against what you already buy, not what you might.",
    ],
  },
  dating: {
    archetype: "The Anchor",
    lede: "You show up steady. People relax around you, and you notice when they don't.",
    traits: [
      { name: "Consistency", score: 90 },
      { name: "Openness", score: 72 },
      { name: "Spontaneity", score: 41 },
      { name: "Patience", score: 84 },
      { name: "Independence", score: 66 },
    ],
    pairings: [
      { name: "The Open Book", blurb: "They say the thing out loud, and you make it safe to." },
      { name: "The Slow-Burner", blurb: "Your steadiness gives them the room they need to arrive." },
    ],
    tips: ["Say the plan out loud, they like knowing.", "Ask before assuming they're fine.", "Small, regular gestures land harder than big ones."],
  },
  fitness: {
    archetype: "The Steady Mover",
    lede: "You don't chase streaks, you keep showing up. Routine is your superpower, novelty is your blind spot.",
    traits: [
      { name: "Consistency", score: 86 },
      { name: "Intensity", score: 52 },
      { name: "Recovery", score: 74 },
      { name: "Variety", score: 39 },
      { name: "Social drive", score: 58 },
    ],
    pairings: [
      { name: "The Sprinter", blurb: "They bring the burst, you bring the follow-through." },
      { name: "The Explorer", blurb: "They drag you into something new once a month, and you thank them later." },
    ],
    tips: ["Change one variable a week, not the whole plan.", "Book the rest day like it's a session.", "Track how you feel, not just what you lifted."],
  },
  founder: {
    archetype: "The Builder",
    lede: "You'd rather ship a rough version than talk about a perfect one. Momentum is how you think.",
    traits: [
      { name: "Bias to action", score: 91 },
      { name: "Focus", score: 62 },
      { name: "Delegation", score: 44 },
      { name: "Customer obsession", score: 79 },
      { name: "Patience", score: 47 },
    ],
    pairings: [
      { name: "The Operator", blurb: "They turn your sprint into a system before it breaks." },
      { name: "The Storyteller", blurb: "They make the thing you built legible to people who weren't there." },
    ],
    tips: ["Write down what you're not doing this month.", "Hire for the thing you keep putting off.", "Talk to a customer before you talk to a designer."],
  },
};

export async function POST(req: Request) {
  let topic = "money";
  try {
    const body = (await req.json()) as { topic?: string };
    if (body.topic && READS[body.topic]) topic = body.topic;
  } catch {}
  await new Promise((r) => setTimeout(r, 900));
  return NextResponse.json(READS[topic]);
}
