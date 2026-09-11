/* eslint-disable @next/next/no-img-element */
import { ScaledFrame } from "./Frame";
import { sena as t } from "./tokens";

const W = 1180;

function Icon({ name, size = 13, color }: { name: string; size?: number; color?: string }) {
  return (
    <span className="icon" aria-hidden style={{ fontSize: size, width: size, height: size, color, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      {name}
    </span>
  );
}

function Sidebar({ collapsed = false, active = "home" }: { collapsed?: boolean; active?: string }) {
  const items = [
    { icon: "house", label: "Home", key: "home" },
    { icon: "list", label: "Order list", key: "orders" },
    { icon: "message-plus", label: "New chat", key: "new" },
    { icon: "clock-rotate-left", label: "Chat history", key: "history" },
  ];
  const width = collapsed ? 66 : 226;
  return (
    <div style={{ width, padding: 8, flexShrink: 0, height: "100%" }}>
      <aside
        style={{
          width: width - 16,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRadius: 8,
          background: t.bgPanel,
          borderTop: "1px solid #fff",
          boxShadow: t.shadowPanel,
          overflow: "hidden",
        }}
      >
        <div>
          <div style={{ height: 52, display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between", padding: "0 12px" }}>
            {collapsed ? (
              <img src="/work/design/sena-mark.svg" alt="" style={{ height: 24 }} />
            ) : (
              <>
                <img src="/work/design/sena-logo.svg" alt="Sena" style={{ height: 23 }} />
                <Icon name="angles-left" size={10} color={t.textTertiary} />
              </>
            )}
          </div>
          <ul style={{ listStyle: "none", margin: 0, padding: "4px 8px", display: "grid", gap: 2 }}>
            {items.map((it) => {
              const isActive = it.key === active;
              return (
                <li
                  key={it.key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    height: 34,
                    padding: collapsed ? 0 : "0 10px",
                    justifyContent: collapsed ? "center" : "flex-start",
                    borderRadius: 6,
                    background: isActive ? "rgba(27,55,66,0.06)" : "transparent",
                    color: isActive ? t.textPrimary : t.textSecondary,
                    fontFamily: t.ffText,
                    fontSize: 13,
                    fontWeight: isActive ? 500 : 400,
                  }}
                >
                  <Icon name={it.icon} size={14} color={isActive ? t.textPrimary : t.textTertiary} />
                  {!collapsed ? it.label : null}
                </li>
              );
            })}
          </ul>
          {!collapsed ? (
            <div style={{ padding: "14px 18px 0" }}>
              <p style={{ margin: 0, fontFamily: t.ffText, fontSize: 11, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", color: t.textTertiary }}>
                Recent chats
              </p>
              <ul style={{ listStyle: "none", margin: "8px 0 0", padding: 0, display: "grid", gap: 6, fontFamily: t.ffText, fontSize: 13, color: t.textSecondary }}>
                {[
                  ["grid-2", "Q2 shelf availability"],
                  ["message", "Compare Lagos and Abuja"],
                  ["grid-2", "Energy drink share, Nairobi"],
                  ["message", "What changed this month?"],
                ].map(([ic, label]) => (
                  <li key={label} style={{ display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    <Icon name={ic} size={11} color={t.textTertiary} />
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
        <div style={{ padding: 10, borderTop: `1px solid ${t.strokePrimary}` }}>
          {!collapsed ? (
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: t.ffText, fontSize: 11, color: t.textTertiary }}>
                <span>Plan</span>
                <span>Pricing &amp; plans</span>
              </div>
            </div>
          ) : null}
          <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: collapsed ? "center" : "flex-start" }}>
            <div style={{ width: 28, height: 28, borderRadius: 999, background: "#abbdc5", color: "#2d5b6e", fontFamily: t.ffText, fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>
              AM
            </div>
            {!collapsed ? (
              <div style={{ fontFamily: t.ffText, lineHeight: 1.2 }}>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 500, color: t.textPrimary }}>Amara M.</p>
                <p style={{ margin: 0, fontSize: 11, color: t.textTertiary }}>Brand manager</p>
              </div>
            ) : null}
          </div>
        </div>
      </aside>
    </div>
  );
}

function Chatbox({ placeholder, files = [], compact = false }: { placeholder: string; files?: string[]; compact?: boolean }) {
  return (
    <div
      style={{
        position: "relative",
        background: t.bgField,
        borderRadius: compact ? 10 : 16,
        padding: 16,
        minHeight: compact ? 0 : 103,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        boxShadow: t.glow,
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          padding: 1,
          background: t.gradientBorder,
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          pointerEvents: "none",
        }}
      />
      {files.length ? (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {files.map((f) => (
            <span key={f} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 8px", borderRadius: 6, background: t.bgSecondary, border: `1px solid ${t.strokePrimary}`, fontFamily: t.ffText, fontSize: 12, color: t.textSecondary }}>
              <Icon name="file-lines" size={11} color={t.textTertiary} />
              {f}
            </span>
          ))}
        </div>
      ) : null}
      <p style={{ margin: 0, fontFamily: t.ffText, fontSize: 14, lineHeight: "20px", color: t.textTertiary }}>{placeholder}</p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {[
            ["plus", "Add data source"],
            ["bolt", "Connect apps"],
          ].map(([ic, label]) => (
            <span key={label} style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 28, padding: "0 10px", borderRadius: 7, background: t.bgSecondary, fontFamily: t.ffText, fontSize: 12, fontWeight: 500, color: t.textSecondary }}>
              <Icon name={ic} size={11} />
              {label}
            </span>
          ))}
        </div>
        <span style={{ width: 26, height: 26, borderRadius: 7, background: t.bgAccent, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="arrow-up" size={12} color={t.textPrimary} />
        </span>
      </div>
    </div>
  );
}

export function SenaHomeHiFi() {
  const starters = [
    ["chart-line-down", "Where is shelf availability slipping this quarter, and in which outlet type?"],
    ["scale-balanced", "Compare energy-drink share between Lagos and Nairobi across the last two studies"],
    ["calendar", "What changed since last month in the markets I track?"],
  ];
  return (
    <ScaledFrame width={W} height={720} label="Home · chat-first" meta="Sena design system · light">
      <div style={{ width: W, height: 720, display: "flex", background: t.bgApp, fontFamily: t.ffText, color: t.textPrimary }}>
        <Sidebar />
        <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "34px 32px", gap: 40 }}>
          <div style={{ textAlign: "center", display: "grid", gap: 12, justifyItems: "center" }}>
            <img src="/work/design/sena-mark.svg" alt="" style={{ height: 96, opacity: 0.9 }} />
            <h1 style={{ margin: 0, fontFamily: t.ffDisplay, fontWeight: 400, fontSize: 40, lineHeight: 1.2, letterSpacing: "-0.02em", color: t.textAccent }}>
              What do you want to find out?
            </h1>
            <p style={{ margin: 0, fontSize: 14, lineHeight: "20px", color: t.textSecondary }}>
              Ask across your reports, uploads and connected apps. Sena answers with sources.
            </p>
          </div>
          <div style={{ width: "100%", maxWidth: 820, display: "grid", gap: 20 }}>
            <Chatbox placeholder="Ask Sena anything…" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {starters.map(([ic, label]) => (
                <div key={label} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 16px", background: t.bgCard, border: `1px solid ${t.strokeCard}`, borderRadius: 16, fontSize: 13, lineHeight: "18px", color: t.textSecondary }}>
                  <Icon name={ic} size={14} color={t.textAccent} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ width: "100%", maxWidth: 820 }}>
            <p style={{ margin: "0 0 10px", fontSize: 11, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", color: t.textTertiary }}>Recent reports</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {[
                ["Nigeria retail · Q2", "Opened today"],
                ["Kenya consumer insight", "Chatted yesterday"],
                ["East Africa pricing", "3 days ago"],
              ].map(([name, meta]) => (
                <div key={name} style={{ padding: 14, background: t.bgPrimary, border: `1px solid ${t.strokeCard}`, borderRadius: 12, boxShadow: t.shadowCard }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Icon name="grid-2" size={12} color={t.textTertiary} />
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: t.textPrimary }}>{name}</p>
                  </div>
                  <p style={{ margin: "4px 0 0", fontSize: 12, color: t.textTertiary }}>{meta}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </ScaledFrame>
  );
}

function MiniBars({ values, colors }: { values: number[]; colors: string[] }) {
  const max = Math.max(...values);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 120 }}>
      {values.map((v, i) => (
        <div key={i} style={{ flex: 1, height: `${(v / max) * 100}%`, background: colors[i % colors.length], borderRadius: "4px 4px 0 0" }} />
      ))}
    </div>
  );
}

export function SenaReportHiFi() {
  return (
    <ScaledFrame width={W} height={720} label="Inside a report · side chat" meta="Sidebar collapsed to a rail">
      <div style={{ width: W, height: 720, display: "flex", background: t.bgApp, fontFamily: t.ffText, color: t.textPrimary }}>
        <Sidebar collapsed active="orders" />
        <main style={{ flex: 1, minWidth: 0, display: "flex", padding: "8px 8px 8px 0", gap: 8 }}>
          <section style={{ flex: 1, minWidth: 0, background: t.bgPanel, borderTop: "1px solid #fff", borderRadius: 8, boxShadow: t.shadowPanel, padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
            <header style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Icon name="arrow-left" size={12} color={t.textTertiary} />
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 7, background: t.bgPrimary, border: `1px solid ${t.strokePrimary}`, fontSize: 13, fontWeight: 500 }}>
                Nigeria retail · Q2
                <Icon name="chevron-down" size={10} color={t.textTertiary} />
              </span>
              <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 6, height: 28, padding: "0 10px", borderRadius: 7, background: t.bgContrast, color: "#fff", fontSize: 12, fontWeight: 500 }}>
                <Icon name="share-nodes" size={11} color="#fff" />
                Share
              </span>
            </header>
            <nav style={{ display: "flex", gap: 22, borderBottom: `1px solid ${t.strokePrimary}`, fontSize: 13 }}>
              {["Overview", "Insights", "Outlets", "Pricing"].map((tab, i) => (
                <span key={tab} style={{ paddingBottom: 8, color: i === 0 ? t.textPrimary : t.textTertiary, fontWeight: i === 0 ? 500 : 400, borderBottom: `2px solid ${i === 0 ? "#182c44" : "transparent"}`, marginBottom: -1 }}>
                  {tab}
                </span>
              ))}
              <span style={{ marginLeft: "auto", display: "inline-flex", gap: 2, padding: 2, borderRadius: 6, background: t.bgSecondary, fontSize: 11 }}>
                <span style={{ padding: "3px 8px", borderRadius: 5, background: "#fff", fontWeight: 500 }}>Snapshot</span>
                <span style={{ padding: "3px 8px", color: t.textTertiary }}>Trend</span>
              </span>
            </nav>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12 }}>
              <div style={{ gridRow: "span 2", padding: 16, background: t.bgPrimary, border: `1px solid ${t.strokeCard}`, borderRadius: 12, boxShadow: t.shadowCard }}>
                <p style={{ margin: 0, fontSize: 12, color: t.textTertiary }}>Shelf availability by outlet type</p>
                <p style={{ margin: "4px 0 14px", fontSize: 26, fontWeight: 500, letterSpacing: "-0.02em" }}>78.4%</p>
                <MiniBars values={[82, 74, 91, 66, 79, 88]} colors={[t.data1, t.data2, t.dataPositive, t.data3, t.data1, t.data2]} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: t.textTertiary }}>
                  {["Super", "Mini", "Kiosk", "Pharm", "Fuel", "Online"].map((l) => <span key={l}>{l}</span>)}
                </div>
              </div>
              {[
                ["Outlets audited", "2,418", t.textPrimary],
                ["Out of stock", "12.6%", t.dataNegative],
                ["Price compliance", "91%", "#2f9c74"],
                ["Share of shelf", "23.1%", t.textPrimary],
              ].map(([l, v, c]) => (
                <div key={l} style={{ padding: 14, background: t.bgPrimary, border: `1px solid ${t.strokeCard}`, borderRadius: 12, boxShadow: t.shadowCard }}>
                  <p style={{ margin: 0, fontSize: 12, color: t.textTertiary }}>{l}</p>
                  <p style={{ margin: "6px 0 0", fontSize: 22, fontWeight: 500, letterSpacing: "-0.02em", color: c }}>{v}</p>
                </div>
              ))}
            </div>
            <div style={{ flex: 1, padding: 16, background: t.bgPrimary, border: `1px solid ${t.strokeCard}`, borderRadius: 12, boxShadow: t.shadowCard, fontSize: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 8, color: t.textTertiary, paddingBottom: 8, borderBottom: `1px solid ${t.strokePrimary}` }}>
                <span>City</span><span>Availability</span><span>OOS</span><span>Change</span>
              </div>
              {[
                ["Lagos", "81%", "9.8%", "+2.1"],
                ["Abuja", "76%", "14.2%", "−1.4"],
                ["Port Harcourt", "72%", "16.9%", "−3.0"],
                ["Kano", "84%", "8.1%", "+0.6"],
              ].map(([a, b, c, d]) => (
                <div key={a} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 8, padding: "9px 0", borderBottom: `1px solid ${t.strokePrimary}`, color: t.textSecondary }}>
                  <span style={{ color: t.textPrimary, fontWeight: 500 }}>{a}</span><span>{b}</span><span>{c}</span>
                  <span style={{ color: d.startsWith("+") ? "#2f9c74" : t.dataNegative }}>{d}</span>
                </div>
              ))}
            </div>
          </section>

          <aside style={{ width: 340, flexShrink: 0, background: t.bgPanel, borderTop: "1px solid #fff", borderRadius: 8, boxShadow: t.shadowPanel, display: "flex", flexDirection: "column" }}>
            <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: `1px solid ${t.strokePrimary}` }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: t.textSecondary }}>
                Sena · this report
                <Icon name="circle-info" size={11} color={t.textTertiary} />
              </span>
              <span style={{ display: "inline-flex", gap: 10 }}>
                <Icon name="plus" size={11} color={t.textTertiary} />
                <Icon name="angles-right" size={11} color={t.textTertiary} />
              </span>
            </header>
            <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 14, fontSize: 13, lineHeight: "19px" }}>
              <div style={{ alignSelf: "flex-end", maxWidth: "88%", padding: "8px 12px", borderRadius: 10, background: t.bgSecondary, color: t.textPrimary }}>
                Why did availability drop in Port Harcourt this quarter?
              </div>
              <div style={{ color: t.textSecondary }}>
                <p style={{ margin: 0 }}>
                  Availability in Port Harcourt fell from <strong style={{ color: t.textPrimary }}>75%</strong> to <strong style={{ color: t.textPrimary }}>72%</strong>. The drop is concentrated in kiosks, where out-of-stock rose to 21% after the April price change. Supermarkets held steady.
                </p>
                <p style={{ margin: "8px 0 0", fontSize: 11, color: t.textTertiary }}>Sources: Outlets tab · Pricing tab, April to June</p>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["Show by outlet type", "Compare with Lagos", "Draft a summary"].map((c) => (
                  <span key={c} style={{ padding: "5px 10px", borderRadius: 999, border: `1px solid ${t.strokePrimary}`, background: t.bgPrimary, fontSize: 12, color: t.textSecondary }}>{c}</span>
                ))}
              </div>
            </div>
            <div style={{ padding: 12 }}>
              <Chatbox placeholder="Ask about this report…" compact />
            </div>
          </aside>
        </main>
      </div>
    </ScaledFrame>
  );
}
