import { ScaledFrame } from "./Frame";

/**
 * Rwazi customer platform, 2024–2025 generation. Built on a dashboard
 * template with the palette I set: tints of a small set plus a grey scale.
 */
const p = {
  ff: "var(--font-sans), Inter, system-ui, sans-serif",
  bg: "#f5f7fa",
  sidebar: "#1e1e2d",
  sidebarText: "#a2a3b7",
  sidebarActive: "#ffffff",
  card: "#ffffff",
  border: "#e9edf2",
  text: "#181c32",
  muted: "#7e8299",
  primary: "#3e97ff",
  primaryLight: "#eef6ff",
  success: "#50cd89",
  warning: "#ffc700",
  danger: "#f1416c",
  series: ["#3e97ff", "#7239ea", "#50cd89", "#ffc700", "#f1416c", "#0dcaf0"],
};

const W = 1180;

function Icon({ name, size = 13, color }: { name: string; size?: number; color?: string }) {
  return <span className="icon" aria-hidden style={{ fontSize: size, width: size, height: size, color, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{name}</span>;
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ background: p.card, border: `1px solid ${p.border}`, borderRadius: 12, boxShadow: "0 1px 2px rgba(24,28,50,0.04)", ...style }}>{children}</div>;
}

function Shell({ children, active }: { children: React.ReactNode; active: string }) {
  const nav = ["Dashboard", "Consumer insights", "Retail mapping", "Pricing", "POS data", "Reports", "Settings"];
  return (
    <div style={{ width: W, height: 720, display: "flex", background: p.bg, fontFamily: p.ff, color: p.text }}>
      <aside style={{ width: 220, background: p.sidebar, padding: "22px 14px", display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px" }}>
          <span style={{ width: 28, height: 28, borderRadius: 8, background: p.primary, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14 }}>R</span>
          <span style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>Rwazi</span>
        </div>
        <nav style={{ display: "grid", gap: 2 }}>
          {nav.map((n) => {
            const on = n === active;
            return (
              <span key={n} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 8, background: on ? "rgba(255,255,255,0.08)" : "transparent", color: on ? p.sidebarActive : p.sidebarText, fontSize: 13, fontWeight: on ? 500 : 400 }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: on ? p.primary : "rgba(255,255,255,0.18)" }} />
                {n}
              </span>
            );
          })}
        </nav>
        <div style={{ marginTop: "auto", padding: 12, borderRadius: 10, background: "rgba(255,255,255,0.06)", color: p.sidebarText, fontSize: 12 }}>
          <p style={{ margin: 0, color: "#fff", fontWeight: 500 }}>Enterprise plan</p>
          <p style={{ margin: "2px 0 0" }}>4 markets · 12 reports</p>
        </div>
      </aside>
      <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <header style={{ height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", background: p.card, borderBottom: `1px solid ${p.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: p.muted }}>
            <span>Reports</span><Icon name="chevron-right" size={9} /><span style={{ color: p.text, fontWeight: 500 }}>Beverages · East Africa · Q2</span>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ padding: "7px 12px", borderRadius: 8, border: `1px solid ${p.border}`, fontSize: 12, color: p.muted, display: "inline-flex", gap: 6, alignItems: "center" }}><Icon name="download" size={11} />Export</span>
            <span style={{ padding: "7px 12px", borderRadius: 8, background: p.primary, color: "#fff", fontSize: 12, fontWeight: 500 }}>Share</span>
            <span style={{ width: 32, height: 32, borderRadius: 999, background: "#e4e6ef", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: p.muted }}>AM</span>
          </div>
        </header>
        <div style={{ flex: 1, minHeight: 0, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>{children}</div>
      </main>
    </div>
  );
}

function Filters() {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      {[
        ["Market", "Kenya, Uganda"],
        ["Period", "Apr – Jun 2025"],
        ["Gender", "All"],
        ["Age", "18 – 45"],
      ].map(([l, v]) => (
        <span key={l} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 8, background: p.card, border: `1px solid ${p.border}`, fontSize: 12 }}>
          <span style={{ color: p.muted }}>{l}</span>
          <span style={{ fontWeight: 500 }}>{v}</span>
          <Icon name="chevron-down" size={9} color={p.muted} />
        </span>
      ))}
      <span style={{ marginLeft: "auto", display: "inline-flex", gap: 2, padding: 2, borderRadius: 8, background: "#e4e6ef", fontSize: 12 }}>
        <span style={{ padding: "5px 10px", borderRadius: 6, background: p.card, fontWeight: 500 }}>Snapshot</span>
        <span style={{ padding: "5px 10px", color: p.muted }}>Over time</span>
      </span>
    </div>
  );
}

function Donut({ segments }: { segments: { v: number; c: string }[] }) {
  const total = segments.reduce((a, s) => a + s.v, 0);
  let acc = 0;
  const r = 44;
  const circ = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 120 120" width="120" height="120" style={{ transform: "rotate(-90deg)" }} aria-hidden>
      {segments.map((s, i) => {
        const len = (s.v / total) * circ;
        const el = <circle key={i} cx="60" cy="60" r={r} fill="none" stroke={s.c} strokeWidth="16" strokeDasharray={`${len} ${circ - len}`} strokeDashoffset={-acc} />;
        acc += len;
        return el;
      })}
    </svg>
  );
}

function Bars({ values, color = p.primary }: { values: number[]; color?: string }) {
  const max = Math.max(...values);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 130 }}>
      {values.map((v, i) => <div key={i} style={{ flex: 1, height: `${(v / max) * 100}%`, background: color, borderRadius: 4, opacity: 0.55 + (i / values.length) * 0.45 }} />)}
    </div>
  );
}

export function PlatformDashboardHiFi() {
  return (
    <ScaledFrame width={W} height={720} label="Consumer Insights · report dashboard" meta="Customer platform · 2025">
      <Shell active="Consumer insights">
        <Filters />
        <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 16 }}>
          <Card style={{ padding: 20 }}>
            <p style={{ margin: 0, fontSize: 12, color: p.muted }}>Brand awareness</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 4 }}>
              <p style={{ margin: 0, fontSize: 30, fontWeight: 600, letterSpacing: "-0.02em" }}>64%</p>
              <span style={{ fontSize: 12, color: p.success, fontWeight: 500 }}>▲ 4.2 pts vs Q1</span>
            </div>
            <p style={{ margin: "2px 0 16px", fontSize: 12, color: p.muted }}>2,140 respondents across 2 markets</p>
            <Bars values={[52, 58, 55, 61, 60, 64]} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: p.muted }}>
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m) => <span key={m}>{m}</span>)}
            </div>
          </Card>
          <Card style={{ padding: 20, display: "flex", gap: 18, alignItems: "center" }}>
            <Donut segments={[{ v: 38, c: p.series[0] }, { v: 27, c: p.series[1] }, { v: 20, c: p.series[2] }, { v: 15, c: p.series[3] }]} />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 12, color: p.muted }}>Purchase channel</p>
              <ul style={{ listStyle: "none", margin: "10px 0 0", padding: 0, display: "grid", gap: 8, fontSize: 12 }}>
                {[["Supermarket", "38%"], ["Kiosk", "27%"], ["Market stall", "20%"], ["Online", "15%"]].map(([l, v], i) => (
                  <li key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: p.series[i] }} />{l}</span>
                    <span style={{ fontWeight: 500 }}>{v}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {[["Consideration", "51%", "+2.8"], ["Trial", "37%", "+1.1"], ["Repeat purchase", "29%", "−0.6"], ["Recommend", "44%", "+3.4"]].map(([l, v, d]) => (
            <Card key={l} style={{ padding: 16 }}>
              <p style={{ margin: 0, fontSize: 12, color: p.muted }}>{l}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 6 }}>
                <p style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em" }}>{v}</p>
                <span style={{ fontSize: 12, fontWeight: 500, color: d.startsWith("+") ? p.success : p.danger }}>{d}</span>
              </div>
            </Card>
          ))}
        </div>
        <Card style={{ padding: 0, flex: 1, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", padding: "12px 16px", fontSize: 11, color: p.muted, textTransform: "uppercase", letterSpacing: "0.04em", borderBottom: `1px solid ${p.border}` }}>
            <span>Brand</span><span>Awareness</span><span>Trial</span><span>Repeat</span><span>Δ Q1</span>
          </div>
          {[["Brand A", "64%", "37%", "29%", "+4.2"], ["Brand B", "58%", "31%", "24%", "+1.0"], ["Brand C", "41%", "22%", "17%", "−2.3"]].map(([a, b, c, d, e]) => (
            <div key={a} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", padding: "12px 16px", fontSize: 13, borderBottom: `1px solid ${p.border}` }}>
              <span style={{ fontWeight: 500 }}>{a}</span><span>{b}</span><span>{c}</span><span>{d}</span>
              <span style={{ color: e.startsWith("+") ? p.success : p.danger, fontWeight: 500 }}>{e}</span>
            </div>
          ))}
        </Card>
      </Shell>
    </ScaledFrame>
  );
}

export function PlatformScorecardHiFi() {
  const cats = [
    ["Affinity", 81, p.success],
    ["Availability", 64, p.warning],
    ["Churn risk", 58, p.danger],
    ["Price position", 85, p.success],
  ] as const;
  return (
    <ScaledFrame width={W} height={720} label="Brand scorecard" meta="One score, four categories, next actions">
      <Shell active="Dashboard">
        <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 16 }}>
          <Card style={{ padding: 24, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, background: `linear-gradient(180deg, ${p.primaryLight}, ${p.card})` }}>
            <p style={{ margin: 0, fontSize: 12, color: p.muted }}>Brand score</p>
            <div style={{ position: "relative", width: 160, height: 160 }}>
              <svg viewBox="0 0 160 160" width="160" height="160" style={{ transform: "rotate(-90deg)" }} aria-hidden>
                <circle cx="80" cy="80" r="66" fill="none" stroke="#e4e6ef" strokeWidth="14" />
                <circle cx="80" cy="80" r="66" fill="none" stroke={p.primary} strokeWidth="14" strokeLinecap="round" strokeDasharray={2 * Math.PI * 66} strokeDashoffset={2 * Math.PI * 66 * (1 - 0.72)} />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 44, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1 }}>72</span>
                <span style={{ fontSize: 12, color: p.muted }}>out of 100</span>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: 12, color: p.success, fontWeight: 500 }}>▲ 3 since last quarter</p>
            <span style={{ marginTop: 6, padding: "8px 14px", borderRadius: 8, border: `1px solid ${p.border}`, fontSize: 12, fontWeight: 500, color: p.primary }}>See detail</span>
          </Card>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {cats.map(([l, v, c]) => (
              <Card key={l} style={{ padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>{l}</p>
                  <p style={{ margin: 0, fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em" }}>{v}</p>
                </div>
                <div style={{ height: 8, borderRadius: 999, background: "#e4e6ef", marginTop: 12 }}>
                  <div style={{ height: 8, width: `${v}%`, borderRadius: 999, background: c }} />
                </div>
                <p style={{ margin: "10px 0 0", fontSize: 12, color: p.muted }}>
                  {l === "Affinity" ? "Driven by repeat purchase and recommendation" : l === "Availability" ? "Out of stock in 14% of audited kiosks" : l === "Churn risk" ? "Consideration fell among 25 to 34s" : "Priced 6% under the category median"}
                </p>
              </Card>
            ))}
          </div>
        </div>
        <Card style={{ padding: 20 }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>Recommended next actions</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 12 }}>
            {[["Run a consumer insight", "Understand the 25 to 34 drop in consideration", false], ["Order retail mapping", "Kiosk availability in the two weakest cities", true], ["Compare to category", "Benchmark all four scores against peers", false]].map(([t, d, primary]) => (
              <div key={String(t)} style={{ padding: 14, borderRadius: 10, background: primary ? p.primary : p.bg, color: primary ? "#fff" : p.text, border: `1px solid ${primary ? p.primary : p.border}` }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>{t}</p>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: primary ? "rgba(255,255,255,0.8)" : p.muted }}>{d}</p>
              </div>
            ))}
          </div>
        </Card>
      </Shell>
    </ScaledFrame>
  );
}

export function PlatformSignupHiFi() {
  return (
    <ScaledFrame width={W} height={560} label="Quick sign-up · primed landing" meta="Variant B">
      <div style={{ width: W, height: 560, background: p.bg, fontFamily: p.ff, color: p.text, display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        <div style={{ padding: "64px 72px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 28, height: 28, borderRadius: 8, background: p.primary, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14 }}>R</span>
            <span style={{ fontWeight: 600, fontSize: 15 }}>Rwazi</span>
          </div>
          <span style={{ alignSelf: "flex-start", padding: "6px 12px", borderRadius: 999, background: p.primaryLight, color: p.primary, fontSize: 12, fontWeight: 500 }}>Prepared for Banking · Kenya</span>
          <h1 style={{ margin: 0, fontSize: 36, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em" }}>See how Kenyan consumers choose a bank, from 2,400 real conversations.</h1>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, color: p.muted, maxWidth: 440 }}>Data collected on the ground by verified mappers, cleaned and weighted to the market. No sign-up needed to explore the demo.</p>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ padding: "12px 20px", borderRadius: 8, background: p.primary, color: "#fff", fontSize: 14, fontWeight: 500 }}>Open the banking dashboard</span>
            <span style={{ fontSize: 12, color: p.muted }}>Takes 10 seconds</span>
          </div>
          <div style={{ display: "flex", gap: 18, marginTop: 8, fontSize: 12, color: p.muted }}>
            {["Verified field data", "Updated monthly", "Export to Excel"].map((s) => <span key={s} style={{ display: "inline-flex", gap: 6, alignItems: "center" }}><Icon name="check" size={10} color={p.success} />{s}</span>)}
          </div>
        </div>
        <div style={{ padding: 40, display: "flex", alignItems: "center" }}>
          <Card style={{ width: "100%", padding: 20, transform: "rotate(-2deg)" }}>
            <p style={{ margin: 0, fontSize: 12, color: p.muted }}>Bank chosen for a first account</p>
            <Bars values={[42, 36, 28, 22, 15]} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: p.muted }}>
              {["Bank A", "Bank B", "Bank C", "Bank D", "Other"].map((b) => <span key={b}>{b}</span>)}
            </div>
          </Card>
        </div>
      </div>
    </ScaledFrame>
  );
}
