// Usage: node record.mjs <url[,url2,...]> <outDir> [maxSeconds]
// Records a top-to-bottom scroll of a page as timestamped JPEG frames.
// Scrolling is driven by real mouse-wheel events, so each site's own
// smooth-scroll (Lenis etc.) and scroll-triggered animations run as they
// would for a visitor. Frames come from CDP's screencast.
import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [url, outDir, maxArg] = process.argv.slice(2);
const MAX = Number(maxArg ?? 32); // seconds of scrolling at most
const W = 1600, H = 900;
mkdirSync(outDir, { recursive: true });

const port = 9300 + Math.floor(Math.random() * 500);
const chrome = spawn(
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ["--headless=new", "--hide-scrollbars", "--mute-audio",
   `--remote-debugging-port=${port}`,
   `--user-data-dir=${mkdtempSync(join(tmpdir(), "rec-"))}`,
   `--window-size=${W},${H}`, "about:blank"],
  { stdio: "ignore" },
);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let targets;
for (let i = 0; i < 50; i++) {
  try {
    targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
    if (targets.find((t) => t.type === "page")) break;
  } catch {}
  await sleep(200);
}
const ws = new WebSocket(targets.find((t) => t.type === "page").webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r));
let id = 0;
const pending = new Map();
const frames = [];
let recording = false;
let offset = 0; // shifts later segments so they follow on without a gap
let end = null;
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); return; }
  if (m.method === "Page.screencastFrame") {
    const { data, metadata, sessionId } = m.params;
    ws.send(JSON.stringify({ id: ++id, method: "Page.screencastFrameAck", params: { sessionId } }));
    if (recording) {
      const n = frames.length;
      writeFileSync(join(outDir, `f${String(n).padStart(5, "0")}.jpg`), Buffer.from(data, "base64"));
      if (segStarting) { offset = segEnd + 1 / 60 - metadata.timestamp; segStarting = false; }
      frames.push(metadata.timestamp + offset);
    }
  }
});
const send = (method, params = {}) => new Promise((r) => {
  const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params }));
});
const evalJs = async (expr) =>
  (await send("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true })).result.result?.value;

await send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: 1, mobile: false });
await send("Network.enable");
// Dev-only widgets stay out of the recording.
await send("Network.setBlockedURLs", { urls: ["*/dist/agentation.js*", "*/dist/interface-kit.js*", "*localhost:4747*", "*chat-widget.neexa.ai*"] });
await send("Page.enable");
await send("Page.addScriptToEvaluateOnNewDocument", {
  source: `addEventListener('DOMContentLoaded',()=>{const s=document.createElement('style');s.textContent='nextjs-portal,astro-dev-toolbar,[data-nextjs-toast],[data-next-badge-root],#__next-build-watcher,[data-agentation-root],[data-agentation-toolbar]{display:none!important}';document.documentElement.appendChild(s)});`,
});
// One or more pages, comma-separated; each gets its own hold + scroll and
// the segments are joined end to end.
const urls = url.split(",");
let segEnd = null; // adjusted time the previous segment ended
let segStarting = false;
for (const [ui, u] of urls.entries()) {
  await send("Page.navigate", { url: u });
  await sleep(6000); // fonts, hero media and intro animations settle
  // Wait for the page to grow past one screen (dev compiles, preloaders).
  for (let i = 0; i < 40; i++) {
    const h = await evalJs("Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)");
    if (h > H + 50) break;
    await sleep(500);
  }
  // Hide cookie banners (no consent is given either way) so they don't sit
  // over the page for the whole recording.
  await evalJs(`(() => {
    for (const e of document.querySelectorAll('body *')) {
      const s = getComputedStyle(e);
      if (!['fixed', 'sticky'].includes(s.position)) continue;
      const r = e.getBoundingClientRect();
      if (r.width * r.height > innerWidth * innerHeight * 0.5) continue;
      if (/cookie|consent/i.test(e.innerText || '')) e.style.setProperty('display', 'none', 'important');
    }
  })()`);
  await evalJs("scrollTo(0,0)");
  await sleep(800);
  await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: W / 2, y: H / 2 });
  const height = await evalJs("Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)");
  const distance = Math.max(0, height - H);
  const segMax = MAX / urls.length;
  const speed = Math.max(420, distance / segMax); // px per second
  console.log(`${u}: height ${height}px, scrolling ${distance}px at ${Math.round(speed)} px/s`);

  segStarting = segEnd !== null;
  if (ui === 0) await send("Page.startScreencast", { format: "jpeg", quality: 88, maxWidth: W, maxHeight: H, everyNthFrame: 1 });
  recording = true;
  // Nudge a repaint so a static page still yields a first frame.
  await evalJs("document.body.style.outline='0px solid transparent'");
  await sleep(1800); // hold on the hero

  const tick = 1000 / 60;
  const rampMs = 900;
  const cruiseMs = Math.max(0, (distance / speed) * 1000 - rampMs);
  const total = cruiseMs + 2 * rampMs;
  const t0 = Date.now();
  let last = t0;
  let sent = 0;
  let n = 0;
  while (distance > 0) {
    const now = Date.now();
    const t = now - t0;
    const dt = now - last;
    last = now;
    if (t > total + 8000) break;
    if (n++ % 15 === 0 && t > 1000) {
      const atEnd = await evalJs("scrollY + innerHeight >= document.documentElement.scrollHeight - 2");
      if (atEnd) break;
    }
    let v = speed;
    if (t < rampMs) v = speed * Math.max(0.1, t / rampMs);
    else if (t > total - rampMs) v = speed * Math.max(0.35, (total - t) / rampMs);
    const dy = (v * dt) / 1000;
    if (dy > 0) {
      await send("Input.dispatchMouseEvent", { type: "mouseWheel", x: W / 2, y: H / 2, deltaX: 0, deltaY: dy });
      sent += dy;
    }
    await sleep(tick);
  }
  console.log(`wheel sent ${Math.round(sent)}px, ended at`, await evalJs("Math.round(scrollY)"));
  await sleep(1500); // hold on the footer
  recording = false;
  segEnd = Date.now() / 1000 + offset;
}
await send("Page.stopScreencast");
end = segEnd;

const dur = (end - frames[0]).toFixed(2);
writeFileSync(join(outDir, "timestamps.json"), JSON.stringify(frames));
writeFileSync(join(outDir, "end.json"), JSON.stringify(end));
console.log(`${frames.length} frames over ${dur}s (${(frames.length / dur).toFixed(1)} fps)`);
ws.close();
chrome.kill();
process.exit(0);
