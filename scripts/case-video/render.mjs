// Usage: node render.mjs <url[,url2,...]> <outDir> [maxSeconds] [pxPerSecond]
//
// Frame-exact scroll render. Instead of recording in real time (which gives
// an uneven 30–45 fps that judders once resampled to 60), the page's clock is
// slowed and frozen between frames:
//
//   for each output frame i (t = i / 60 s):
//     run the page clock until it reaches t      (JS timers, rAF, CSS animations, video)
//     freeze it
//     set scrollY to exactly where it should be at t
//     capture one screenshot
//
// So every frame is evenly spaced in time and in scroll distance, which is
// what keeps text readable while it moves. JS time (performance.now, Date.now,
// rAF timestamps, setTimeout/setInterval) is scaled by an injected shim; CSS
// animations and transitions follow via CDP Animation.setPlaybackRate; <video>
// elements are slowed and paused alongside.
import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [urlArg, outDir, maxArg, speedArg] = process.argv.slice(2);
const MAX = Number(maxArg ?? 34); // seconds of scrolling at most (all pages)
const BASE_SPEED = Number(speedArg ?? 340); // px per second when the page is short enough
const W = 1600, H = 900, FPS = 60;
const RUN = 0.25; // page clock speed while advancing between frames
const HOLD_TOP = 1.6, HOLD_END = 1.4, RAMP = 1.1; // seconds
mkdirSync(outDir, { recursive: true });

const port = 9300 + Math.floor(Math.random() * 500);
const chrome = spawn(
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ["--headless=new", "--hide-scrollbars", "--mute-audio", "--autoplay-policy=no-user-gesture-required",
   `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), "render-"))}`,
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
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
});
const send = (method, params = {}) => new Promise((r) => {
  const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params }));
});
const evalJs = async (expr) =>
  (await send("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true })).result.result?.value;

// Injected before any page script: a clock whose speed we control.
const CLOCK = `(() => {
  const rp = performance.now.bind(performance), rd = Date.now;
  let rate = 1, realAt = rp(), virtAt = rp();
  const now = () => virtAt + (rp() - realAt) * rate;
  const dOff = rd() - rp();
  window.__clock = {
    now,
    set(r) { virtAt = now(); realAt = rp(); rate = r;
      for (const v of document.querySelectorAll('video')) {
        if (r === 0) { if (!v.paused) { v.dataset.rp = '1'; v.pause(); } }
        else { v.playbackRate = Math.max(0.0625, r); if (v.dataset.rp === '1') { v.dataset.rp = ''; v.play().catch(() => {}); } }
      }
    },
  };
  performance.now = now;
  Date.now = () => Math.round(dOff + now());
  const raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (cb) => raf(() => cb(now()));
  const st = window.setTimeout.bind(window), si = window.setInterval.bind(window);
  // Timers wait in virtual time. While frozen (rate 0) they are re-checked.
  window.setTimeout = (fn, ms = 0, ...a) => {
    const due = now() + (+ms || 0);
    const box = {};
    const tick = () => { const left = due - now(); if (left <= 0) { typeof fn === 'function' ? fn(...a) : 0; return; }
      box.h = st(tick, rate > 0 ? Math.max(1, left / rate) : 16); };
    box.h = st(tick, rate > 0 ? Math.max(0, (+ms || 0) / rate) : 16);
    const handle = box.h; window.__tmap = window.__tmap || new Map(); window.__tmap.set(handle, box); return handle;
  };
  const ct = window.clearTimeout.bind(window);
  window.clearTimeout = (h) => { const b = window.__tmap && window.__tmap.get(h); ct(b ? b.h : h); };
  window.setInterval = (fn, ms = 0, ...a) => si(fn, Math.max(1, (+ms || 0) / Math.max(rate, 0.0625)), ...a);
})();`;

const HIDE = `html,body{scroll-behavior:auto!important}
nextjs-portal,astro-dev-toolbar,[data-nextjs-toast],[data-next-badge-root],#__next-build-watcher,[data-agentation-root],[data-agentation-toolbar]{display:none!important}`;

await send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: 1, mobile: false });
await send("Network.enable");
await send("Network.setBlockedURLs", { urls: ["*/dist/agentation.js*", "*/dist/interface-kit.js*", "*localhost:4747*", "*chat-widget.neexa.ai*"] });
await send("Page.enable");
await send("Animation.enable");
await send("Page.addScriptToEvaluateOnNewDocument", { source: CLOCK });
await send("Page.addScriptToEvaluateOnNewDocument", {
  source: `addEventListener('DOMContentLoaded',()=>{const s=document.createElement('style');s.textContent=${JSON.stringify(HIDE)};document.documentElement.appendChild(s)});`,
});

const setRate = async (r) => {
  await evalJs(`window.__clock && window.__clock.set(${r})`);
  await send("Animation.setPlaybackRate", { playbackRate: r });
};

const urls = urlArg.split(",");
let frame = 0;

for (const u of urls) {
  await setRate(1);
  await send("Page.navigate", { url: u });
  await sleep(6500);
  for (let i = 0; i < 40; i++) {
    const h = await evalJs("Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)");
    if (h > H + 50) break;
    await sleep(500);
  }
  // Hide cookie banners (no consent is given either way).
  await evalJs(`(() => { for (const e of document.querySelectorAll('body *')) { const s = getComputedStyle(e);
    if (!['fixed','sticky'].includes(s.position)) continue; const r = e.getBoundingClientRect();
    if (r.width * r.height > innerWidth * innerHeight * 0.5) continue;
    if (/cookie|consent/i.test(e.innerText || '')) e.style.setProperty('display','none','important'); } })()`);
  await evalJs("scrollTo(0,0)");
  await sleep(1200);
  const height = await evalJs("Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)");
  const dist = Math.max(0, height - H);
  const budget = MAX / urls.length;
  const speed = Math.max(BASE_SPEED, dist / budget);
  // Travel time with smoothstep ramps: ramps cover RAMP*speed/2 each.
  const cruise = Math.max(0, (dist - RAMP * speed) / speed);
  const travel = dist > 0 ? cruise + 2 * RAMP : 0;
  const total = HOLD_TOP + travel + HOLD_END;
  const yAt = (t) => {
    const s = t - HOLD_TOP;
    if (s <= 0 || dist === 0) return 0;
    if (s >= travel) return dist;
    // velocity profile: ramp up, cruise, ramp down; integrate analytically
    const rampD = (RAMP * speed) / 2;
    if (s < RAMP) { const x = s / RAMP; return rampD * (x * x * x - 0.5 * x * x * x * x) * 2; }
    if (s < RAMP + cruise) return rampD + (s - RAMP) * speed;
    const x = (s - RAMP - cruise) / RAMP;
    return Math.min(dist, rampD + cruise * speed + rampD * (1 - ((1 - x) ** 3 - 0.5 * (1 - x) ** 4) * 2));
  };
  const frames = Math.round(total * FPS);
  console.log(`${u}: ${height}px, ${dist}px at ${Math.round(speed)} px/s, ${frames} frames`);

  await setRate(0);
  for (let i = 0; i < frames; i++) {
    const t = i / FPS;
    // Advance the page clock by one frame, then freeze it.
    if (i > 0) {
      await setRate(RUN);
      await sleep(1000 / FPS / RUN);
      await setRate(0);
    }
    await evalJs(`scrollTo(0, ${yAt(t).toFixed(2)})`);
    const shot = await send("Page.captureScreenshot", { format: "jpeg", quality: 94, optimizeForSpeed: false });
    writeFileSync(join(outDir, `f${String(frame).padStart(5, "0")}.jpg`), Buffer.from(shot.result.data, "base64"));
    frame++;
    if (i % 300 === 0) console.log(`  frame ${i}/${frames}`);
  }
}

// Evenly spaced frames: timestamps are exact.
writeFileSync(join(outDir, "timestamps.json"), JSON.stringify(Array.from({ length: frame }, (_, i) => i / FPS)));
writeFileSync(join(outDir, "end.json"), JSON.stringify(frame / FPS));
console.log(`${frame} frames, ${(frame / FPS).toFixed(2)}s at ${FPS} fps`);
ws.close();
chrome.kill();
process.exit(0);
