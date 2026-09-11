/**
 * Canned streaming reply for the embedded Sena prototype. Mirrors the SSE
 * shape the prototype's chat engine expects: `data: {"text": "..."}` lines
 * and a final `data: [DONE]`. No model is called.
 */
const REPLY = `I've looked at the Q4 brand tracker and the November retail scanner data across your markets.

**Availability is the story this quarter.** Shelf availability for the Kilima core range fell from **81%** to **78%**, and the drop is concentrated in kiosks, where out-of-stock rose to **21%** after the April price change. Supermarkets held steady.

| City | Availability | Out of stock | Change |
|---|---|---|---|
| Lagos | 81% | 9.8% | +2.1 |
| Abuja | 76% | 14.2% | −1.4 |
| Port Harcourt | 72% | 16.9% | −3.0 |
| Nairobi | 84% | 8.1% | +0.6 |

Two things worth doing next:

1. **Order a retail mapping run in Port Harcourt kiosks.** The last audit there is eleven weeks old.
2. **Cut the Gen Z study by channel.** Purchase intent is up, but we cannot yet see whether kiosks or supermarkets are driving it.

Want me to draft either as a report, or compare Lagos and Nairobi directly?`;

export async function POST() {
  const encoder = new TextEncoder();
  const words = REPLY.split(/(\s+)/);
  const stream = new ReadableStream({
    async start(controller) {
      for (const w of words) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: w })}\n\n`));
        await new Promise((r) => setTimeout(r, 18));
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
