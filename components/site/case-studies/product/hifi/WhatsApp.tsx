/* eslint-disable @next/next/no-img-element */
import { ScaledFrame } from "./Frame";
import { whatsapp as w, ela } from "./tokens";

export type WaBubble =
  | { from: "user"; text: string; time: string; image?: boolean }
  | { from: "ela"; text: string; time: string; sticker?: string; buttons?: string[] };

function Tick() {
  return (
    <svg width="16" height="11" viewBox="0 0 16 11" fill="none" aria-hidden>
      <path d="M11.07.65 5.2 6.5 3.3 4.6l-.9.9 2.8 2.8L12 1.55z" fill={w.tick} />
      <path d="M15.07.65 9.2 6.5 8.3 5.6l-.9.9 1.8 1.8L16 1.55z" fill={w.tick} />
    </svg>
  );
}

/**
 * A WhatsApp conversation at phone scale. Chrome follows WhatsApp's own iOS
 * layout since that is where the product lives; the content is Ela Budget.
 */
export function WhatsAppPhone({ bubbles, label, date = "Today" }: { bubbles: WaBubble[]; label?: string; date?: string }) {
  return (
    <div>
      <ScaledFrame width={390} height={844} className="!rounded-[48px] !border-neutral-300">
        <div style={{ width: 390, height: 844, display: "flex", flexDirection: "column", fontFamily: w.ff, color: w.text, background: w.chatBg, position: "relative" }}>
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.06,
              backgroundImage:
                "radial-gradient(circle at 20% 30%, #000 1px, transparent 1.5px), radial-gradient(circle at 70% 60%, #000 1px, transparent 1.5px), radial-gradient(circle at 40% 80%, #000 1px, transparent 1.5px)",
              backgroundSize: "60px 60px, 80px 80px, 50px 50px",
            }}
          />
          <header style={{ position: "relative", background: w.header, padding: "14px 12px 10px", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid #d1d7db" }}>
            <div style={{ display: "flex", justifyContent: "space-between", position: "absolute", left: 28, right: 28, top: 8, fontSize: 15, fontWeight: 600 }}>
              <span>9:41</span>
              <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
                <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5" width="3" height="7" rx="1" /><rect x="10" y="2" width="3" height="10" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" /></svg>
                <svg width="26" height="12" viewBox="0 0 26 12" fill="none"><rect x="0.5" y="0.5" width="22" height="11" rx="2.5" stroke="currentColor" /><rect x="24" y="4" width="2" height="4" rx="1" fill="currentColor" /><rect x="2" y="2" width="19" height="8" rx="1.5" fill="currentColor" /></svg>
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 28, width: "100%" }}>
              <span style={{ color: w.link, fontSize: 17, display: "inline-flex", alignItems: "center", gap: 2 }}>
                <span className="icon" style={{ fontSize: 16 }}>chevron-left</span>
                <span style={{ fontSize: 14, background: w.link, color: "#fff", borderRadius: 999, padding: "1px 7px", fontWeight: 600 }}>12</span>
              </span>
              <img src="/work/logos/ela-budget.png" alt="" style={{ width: 38, height: 38, borderRadius: 999, objectFit: "cover", marginLeft: 6 }} />
              <div style={{ flex: 1, lineHeight: 1.15 }}>
                <p style={{ margin: 0, fontSize: 16, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                  Ela Budget
                  <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden><path d="M12 1.5 14.7 4l3.6-.7.7 3.6L21.5 9.5 19.6 12.6l1.9 3.1-2.5 2.6-.7 3.6-3.6-.7L12 22.5 9.3 20l-3.6.7-.7-3.6L2.5 14.5l1.9-3.1-1.9-3.1L5 5.7l.7-3.6L9.3 3z" fill="#00a884" /><path d="m8.5 12 2.4 2.4 4.6-4.8" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </p>
                <p style={{ margin: 0, fontSize: 12, color: w.meta }}>Business account</p>
              </div>
              <span className="icon" style={{ fontSize: 17, color: w.link }}>video</span>
              <span className="icon" style={{ fontSize: 17, color: w.link, marginLeft: 14 }}>phone</span>
            </div>
          </header>

          <div style={{ position: "relative", flex: 1, minHeight: 0, overflow: "hidden", padding: "8px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ alignSelf: "center", padding: "4px 10px", borderRadius: 8, background: "rgba(255,255,255,0.9)", fontSize: 12, color: w.meta, marginBottom: 4 }}>{date}</span>
            {bubbles.map((b, i) => {
              const out = b.from === "user";
              return (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: out ? "flex-end" : "flex-start", gap: 4 }}>
                  {!out && b.sticker ? (
                    <div style={{ width: 120, height: 120, borderRadius: 16, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56, boxShadow: "0 1px 0.5px rgba(11,20,26,0.13)" }}>{b.sticker}</div>
                  ) : null}
                  <div
                    style={{
                      maxWidth: "82%",
                      padding: "6px 8px 6px 9px",
                      borderRadius: 8,
                      borderTopRightRadius: out ? 0 : 8,
                      borderTopLeftRadius: out ? 8 : 0,
                      background: out ? w.bubbleOut : w.bubbleIn,
                      boxShadow: "0 1px 0.5px rgba(11,20,26,0.13)",
                      fontSize: 15,
                      lineHeight: "20px",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {out && b.image ? <div style={{ width: 220, height: 150, borderRadius: 6, marginBottom: 6, background: "linear-gradient(160deg,#e8e4dc,#c9c2b4)", display: "flex", alignItems: "flex-end", padding: 8, color: "#4a4a4a", fontSize: 11 }}>receipt.jpg</div> : null}
                    <span>{b.text}</span>
                    <span style={{ float: "right", marginLeft: 8, marginTop: 6, fontSize: 11, color: w.meta, display: "inline-flex", alignItems: "center", gap: 3 }}>
                      {b.time}
                      {out ? <Tick /> : null}
                    </span>
                  </div>
                  {!out && b.buttons ? (
                    <div style={{ width: "82%", display: "grid", gap: 3 }}>
                      {b.buttons.map((label) => (
                        <div key={label} style={{ padding: "9px 12px", borderRadius: 8, background: w.bubbleIn, boxShadow: "0 1px 0.5px rgba(11,20,26,0.13)", textAlign: "center", fontSize: 14, fontWeight: 500, color: w.buttonText, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                          <span className="icon" style={{ fontSize: 12 }}>reply</span>
                          {label}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          <footer style={{ position: "relative", background: w.header, padding: "8px 8px 26px", display: "flex", alignItems: "center", gap: 8 }}>
            <span className="icon" style={{ fontSize: 22, color: w.link, padding: "0 4px" }}>plus</span>
            <div style={{ flex: 1, height: 36, borderRadius: 18, background: w.composer, border: "1px solid #d1d7db", display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 10px" }}>
              <span className="icon" style={{ fontSize: 16, color: w.meta }}>face-smile</span>
            </div>
            <span className="icon" style={{ fontSize: 18, color: w.link }}>camera</span>
            <span className="icon" style={{ fontSize: 18, color: w.link }}>microphone</span>
          </footer>
        </div>
      </ScaledFrame>
      {label ? <p className="mt-3 text-center font-mono text-[0.65rem] uppercase tracking-wider text-neutral-500">{label}</p> : null}
    </div>
  );
}

/** The companion web app dashboard, in the Ela design system as shipped. */
export function ElaBudgetWebHiFi() {
  const W = 1180;
  const t = ela;
  const budgets = [
    ["Food", 68, "UGX 96,000 left", "ok"],
    ["Transport", 84, "UGX 16,000 left", "near"],
    ["Groceries", 104, "Over by UGX 8,500", "over"],
    ["Airtime & data", 40, "UGX 30,000 left", "ok"],
  ] as const;
  const colour = (s: string) => (s === "over" ? t.fgError : s === "near" ? "#b54708" : t.textSecondary);
  const bar = (s: string) => (s === "over" ? t.fgError : s === "near" ? t.fgXp : t.bgBrandPrimary);
  return (
    <ScaledFrame width={W} height={640} label="Companion web app · home" meta="Ela design system · web">
      <div style={{ width: W, height: 640, background: t.bgPrimary, fontFamily: t.ffText, color: t.textPrimary, display: "flex" }}>
        <aside style={{ width: 232, padding: 20, borderRight: `1px solid ${t.strokeSecondary}`, display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/work/logos/ela-budget.png" alt="" style={{ width: 32, height: 32, borderRadius: 8 }} />
            <span style={{ fontFamily: t.ffDisplay, fontWeight: 700, fontSize: 17 }}>Ela Budget</span>
          </div>
          <nav style={{ display: "grid", gap: 4, fontSize: 15 }}>
            {[
              ["house", "Home", true],
              ["receipt", "Transactions", false],
              ["chart-pie", "Budgets", false],
              ["tag", "Deals", false],
              ["credit-card", "Billing", false],
            ].map(([ic, l, on]) => (
              <span key={String(l)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 12, background: on ? t.bgBrandSecondary : "transparent", color: on ? t.textBrand : t.textSecondary, fontWeight: on ? 600 : 400 }}>
                <span className="icon" style={{ fontSize: 14 }}>{ic}</span>
                {l}
              </span>
            ))}
          </nav>
          <div style={{ marginTop: "auto", padding: 12, borderRadius: 16, background: t.bgActive, border: `1px solid ${t.shine}`, boxShadow: t.shadow1, fontSize: 13, color: t.textSecondary }}>
            <p style={{ margin: 0, fontWeight: 600, color: t.textPrimary }}>Premium</p>
            <p style={{ margin: "2px 0 0" }}>Renews 22 Sep</p>
          </div>
        </aside>
        <main style={{ flex: 1, padding: 28, display: "grid", gridTemplateColumns: "1fr 1fr", gridAutoRows: "min-content", gap: 16, alignContent: "start" }}>
          <section style={{ gridColumn: "1 / -1", padding: 24, borderRadius: 20, background: t.bgBrandPrimary, border: "1px solid rgba(255,255,255,0.6)", boxShadow: t.shadow3, color: "#203335", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24 }}>
            <div>
              <p style={{ margin: 0, fontSize: 14, opacity: 0.8 }}>Safe to spend today</p>
              <p style={{ margin: "4px 0 0", fontFamily: t.ffDisplay, fontWeight: 700, fontSize: 40, letterSpacing: "-0.02em" }}>UGX 18,500</p>
              <p style={{ margin: "8px 0 0", fontSize: 15, maxWidth: 480, lineHeight: 1.45 }}>You&apos;ve spent UGX 12,000 today. 19 days left in the month, and your food budget is doing fine.</p>
              <p style={{ margin: "16px 0 0", paddingTop: 12, borderTop: "1px solid rgba(32,51,53,0.15)", fontSize: 14, display: "flex", gap: 6, alignItems: "center" }}>
                <span className="icon" style={{ fontSize: 14 }}>fire</span>
                6-day logging streak
              </p>
            </div>
            <div style={{ position: "relative", width: 72, height: 72 }}>
              <svg viewBox="0 0 72 72" width="72" height="72" style={{ transform: "rotate(-90deg)" }} aria-hidden>
                <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="8" />
                <circle cx="36" cy="36" r="30" fill="none" stroke="#203335" strokeWidth="8" strokeLinecap="round" strokeDasharray="188.5" strokeDashoffset={188.5 * (1 - 0.61)} />
              </svg>
              <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600 }}>61%</span>
            </div>
          </section>
          <section style={{ padding: 20, borderRadius: 20, background: t.bgActive, border: `1px solid ${t.shine}`, boxShadow: t.shadow2 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Where your budgets stand</h2>
              <span style={{ fontSize: 14, color: "#4a8978" }}>See all</span>
            </div>
            <ul style={{ listStyle: "none", margin: "14px 0 0", padding: 0, display: "grid", gap: 14 }}>
              {budgets.map(([name, pct, left, s]) => (
                <li key={name}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                    <span style={{ fontWeight: 500 }}>{name}</span>
                    <span style={{ color: colour(s) }}>{left}</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 999, background: t.bgTertiary, marginTop: 6 }}>
                    <div style={{ height: 8, width: `${Math.min(100, pct)}%`, borderRadius: 999, background: bar(s) }} />
                  </div>
                </li>
              ))}
            </ul>
          </section>
          <section style={{ padding: 20, borderRadius: 20, background: t.bgActive, border: `1px solid ${t.shine}`, boxShadow: t.shadow2 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Bills knocking this week</h2>
              <span style={{ fontSize: 14, color: t.textSecondary }}>UGX 1.28M spoken for</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14 }}>
              {[
                ["Rent", "UGX 1,200,000", "Due in 2 days", true],
                ["Internet", "UGX 80,000", "Due Friday", false],
              ].map(([n, a, d, urgent]) => (
                <div key={String(n)} style={{ padding: 12, borderRadius: 12, border: "1px solid rgba(35,41,41,0.1)" }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>{n}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 14, color: t.textSecondary }}>{a}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 14, color: urgent ? "#d92d20" : t.textTertiary }}>{d}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, padding: 12, borderRadius: 12, background: t.bgBrandLight, border: `1px solid ${t.bgBrandSecondary}`, fontSize: 14, color: t.textBrand }}>
              Lunch four times this week at 12k. A place in Kamwokya does it at 8k. That&apos;s 16k kept.
            </div>
          </section>
        </main>
      </div>
    </ScaledFrame>
  );
}
