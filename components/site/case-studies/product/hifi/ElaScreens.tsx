/* eslint-disable @next/next/no-img-element */
import { ScaledFrame } from "./Frame";
import { ela as t } from "./tokens";

function Icon({ name, size = 14, color }: { name: string; size?: number; color?: string }) {
  return (
    <span className="icon" aria-hidden style={{ fontSize: size, width: size, height: size, color, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {name}
    </span>
  );
}

/** iPhone frame at the design system's native 390 × 844. */
export function ElaPhone({
  children,
  title,
  back = true,
  flat = false,
  footer,
  label,
}: {
  children: React.ReactNode;
  title?: string;
  back?: boolean;
  flat?: boolean;
  footer?: React.ReactNode;
  label?: string;
}) {
  return (
    <div>
      <ScaledFrame width={390} height={844} className="!rounded-[48px] !border-neutral-300">
        <div
          style={{
            width: 390,
            height: 844,
            background: flat ? t.bgSecondary : `radial-gradient(120% 60% at 50% 100%, ${t.bgBrandSecondary} 0%, ${t.bgSecondary} 60%)`,
            fontFamily: t.ffText,
            color: t.textPrimary,
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <div style={{ height: 54, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 28px 0", fontWeight: 600, fontSize: 17 }}>
            <span>9:41</span>
            <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
              <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5" width="3" height="7" rx="1" /><rect x="10" y="2" width="3" height="10" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" /></svg>
              <svg width="26" height="12" viewBox="0 0 26 12" fill="none"><rect x="0.5" y="0.5" width="22" height="11" rx="2.5" stroke="currentColor" /><rect x="24" y="4" width="2" height="4" rx="1" fill="currentColor" /><rect x="2" y="2" width="19" height="8" rx="1.5" fill="currentColor" /></svg>
            </span>
          </div>
          {title !== undefined ? (
            <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 40px", alignItems: "center", padding: "6px 16px 10px" }}>
              {back ? (
                <span style={{ width: 36, height: 36, borderRadius: 999, background: t.bgActive, boxShadow: t.shadow1, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="arrow-left" size={14} />
                </span>
              ) : <span />}
              <h1 style={{ margin: 0, textAlign: "center", fontFamily: t.ffDisplay, fontWeight: 700, fontSize: 17, letterSpacing: "-0.01em" }}>{title}</h1>
              <span />
            </div>
          ) : null}
          <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", gap: 16, padding: "8px 16px 16px", overflow: "hidden" }}>{children}</div>
          {footer ? <div style={{ padding: "0 16px 28px" }}>{footer}</div> : null}
        </div>
      </ScaledFrame>
      {label ? (
        <p className="mt-3 text-center font-mono text-[0.65rem] uppercase tracking-wider text-neutral-500">{label}</p>
      ) : null}
    </div>
  );
}

export function ElaMsg({ from, children, bubbleBg }: { from: "ela" | "user"; children: React.ReactNode; bubbleBg?: string }) {
  if (from === "ela") {
    return (
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <img src="/work/design/ela-badge.svg" alt="" style={{ width: 25, height: 25, borderRadius: 999, marginTop: 3, flexShrink: 0 }} />
        <p style={{ margin: 0, fontSize: 17, lineHeight: 1.4, paddingTop: 1 }}>{children}</p>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
      <p style={{ margin: 0, maxWidth: "80%", padding: "6px 11px", borderRadius: 8, background: bubbleBg ?? t.topicLogsBg, fontSize: 17, lineHeight: 1.4 }}>{children}</p>
      <span style={{ width: 24, height: 24, borderRadius: 999, background: "linear-gradient(135deg,#c9b8a8,#8e7a6b)", marginTop: 3, flexShrink: 0 }} />
    </div>
  );
}

export function ElaChips({ options, selected }: { options: string[]; selected?: string }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map((o) => {
        const on = o === selected;
        return (
          <span
            key={o}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 10px",
              borderRadius: 32,
              background: on ? t.bgBrandSecondary : t.bgPrimary,
              border: `1px solid ${on ? t.strokeBrand : t.shine}`,
              boxShadow: t.shadow1,
              fontSize: 14,
              color: on ? t.textBrand : t.textPrimary,
            }}
          >
            {on ? <Icon name="check" size={12} color={t.textBrand} /> : null}
            {o}
          </span>
        );
      })}
    </div>
  );
}

export function ElaSlider({ value, label }: { value: number; label: string }) {
  return (
    <div style={{ padding: 12, borderRadius: 16, background: t.bgActive, border: `1px solid ${t.shine}`, boxShadow: t.shadow2 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: t.textSecondary }}>
        <span>Amount</span>
        <span style={{ color: t.textPrimary, fontWeight: 600 }}>{label}</span>
      </div>
      <div style={{ position: "relative", height: 6, borderRadius: 999, background: t.bgTertiary, marginTop: 14 }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${value}%`, borderRadius: 999, background: t.bgBrandPrimary }} />
        <span style={{ position: "absolute", left: `calc(${value}% - 12px)`, top: -9, width: 24, height: 24, borderRadius: 999, background: "#fff", boxShadow: t.shadow3 }} />
      </div>
    </div>
  );
}

export function ElaComposer({ placeholder = "Ask anything to Ela…" }: { placeholder?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 52, padding: "4px 4px 4px 16px", borderRadius: 9999, background: t.bgPrimary, border: `1px solid ${t.shine}`, boxShadow: t.shadow3 }}>
      <span style={{ fontSize: 17, color: t.textTertiary }}>{placeholder}</span>
      <span style={{ display: "inline-flex", gap: 6 }}>
        <span style={{ width: 44, height: 44, borderRadius: 999, background: t.bgSecondary, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="plus" size={14} />
        </span>
        <span style={{ width: 44, height: 44, borderRadius: 999, background: t.bgBrandPrimary, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="arrow-up" size={14} color={t.textPrimary} />
        </span>
      </span>
    </div>
  );
}

export function ElaProgressHeader({ title, pct, tag }: { title: string; pct: number; tag?: string }) {
  return (
    <div style={{ borderRadius: 20, overflow: "hidden", background: t.bgActive, border: `1px solid ${t.shine}`, boxShadow: t.shadow2 }}>
      <div style={{ height: 96, background: `linear-gradient(135deg, ${t.topicHealthBg}, ${t.bgBrandPrimary})`, position: "relative" }}>
        {tag ? (
          <span style={{ position: "absolute", left: 12, top: 12, display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999, background: t.bgContrast, color: t.textContrast, fontSize: 12 }}>
            <Icon name="check" size={10} color={t.textContrast} />
            {tag}
          </span>
        ) : null}
      </div>
      <div style={{ padding: "12px 14px 14px" }}>
        <p style={{ margin: 0, fontFamily: t.ffDisplay, fontWeight: 700, fontSize: 17 }}>{title}</p>
        <div style={{ height: 6, borderRadius: 999, background: t.bgTertiary, marginTop: 10 }}>
          <div style={{ height: 6, width: `${pct}%`, borderRadius: 999, background: t.bgBrandPrimary }} />
        </div>
      </div>
    </div>
  );
}

export function ElaLogCard({ title, reward, time, days, done }: { title: string; reward: string; time: string; days: string; done?: boolean }) {
  return (
    <div style={{ display: "flex", gap: 16, padding: 8, height: 120, borderRadius: 16, background: t.bgPrimary, border: `1px solid ${t.shine}`, boxShadow: t.shadow2 }}>
      <div style={{ width: 104, borderRadius: 12, background: `linear-gradient(135deg, ${t.topicBusinessBg}, ${t.bgBrandSecondary})` }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 12 }}>
        <p style={{ margin: 0, fontFamily: t.ffDisplay, fontWeight: 700, fontSize: 17, lineHeight: 1.2 }}>{title}</p>
        <div style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 12, color: t.textSecondary }}>
          <span style={{ padding: "3px 8px", borderRadius: 999, background: done ? t.bgBrandSecondary : "#fffceb", color: done ? t.textBrand : "#93370d", fontWeight: 600 }}>{done ? "Done" : reward}</span>
          <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}><Icon name="stopwatch" size={11} color={t.textTertiary} />{time}</span>
          <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}><Icon name="calendar" size={11} color={t.textTertiary} />{days}</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Web (Ela quiz funnel) ─────────────────────────────────────────────── */

const WEB_W = 1180;

function WebNav({ cta = "Sign up for free", ctaColor = t.topicBudgetingFg }: { cta?: string; ctaColor?: string }) {
  return (
    <header style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", padding: "18px 40px" }}>
      <img src="/work/design/ela-logo.svg" alt="Ela" style={{ height: 36 }} />
      <span style={{ padding: "6px 14px", borderRadius: 999, background: t.bgActive, border: `1px solid ${t.shine}`, boxShadow: t.shadow1, fontSize: 13, color: t.textSecondary }}>Free · No sign-up</span>
      <span style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <span style={{ padding: "9px 14px", borderRadius: 12, background: t.bgBrandPrimary, fontSize: 14, fontWeight: 600, color: t.textPrimary }}>All quizzes</span>
        <span style={{ padding: "9px 14px", borderRadius: 12, background: ctaColor, fontSize: 14, fontWeight: 600, color: "#fff" }}>{cta}</span>
      </span>
    </header>
  );
}

export function ElaWebQuizHiFi() {
  const opts = ["Cut back quietly", "Look for a cheaper way to do the same", "Borrow and sort it later", "Ignore it until payday"];
  return (
    <ScaledFrame width={WEB_W} height={700} label="Money quiz · question and read" meta="Ela design system · web">
      <div style={{ width: WEB_W, height: 700, background: t.bgPrimary, fontFamily: t.ffText, color: t.textPrimary }}>
        <WebNav />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, padding: "12px 40px 0" }}>
          <section style={{ padding: 32, borderRadius: 32, background: t.bgActive, border: `1px solid ${t.shine}`, boxShadow: t.shadow2 }}>
            <p style={{ margin: 0, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: t.textTertiary }}>Question 4 of 8</p>
            <div style={{ height: 6, borderRadius: 999, background: t.bgTertiary, margin: "12px 0 28px" }}>
              <div style={{ height: 6, width: "50%", borderRadius: 999, background: t.topicBudgetingFg }} />
            </div>
            <h2 style={{ margin: 0, fontFamily: t.ffDisplay, fontWeight: 700, fontSize: 32, lineHeight: 1.2, letterSpacing: "-0.01em" }}>When money is tight, you…</h2>
            <div style={{ display: "grid", gap: 10, marginTop: 24 }}>
              {opts.map((o, i) => {
                const on = i === 1;
                return (
                  <div key={o} style={{ padding: "16px 18px", borderRadius: 16, background: on ? t.topicBudgetingBg : t.bgPrimary, border: `1px solid ${on ? t.topicBudgetingFg : t.strokeSecondary}`, fontSize: 17, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {o}
                    {on ? <Icon name="check" size={14} color={t.topicBudgetingFg} /> : null}
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 24, padding: "14px 18px", borderRadius: 16, background: t.bgContrast, color: t.textContrast, fontSize: 17, fontWeight: 600, textAlign: "center" }}>Next</div>
          </section>
          <section style={{ padding: 32, borderRadius: 32, background: `linear-gradient(160deg, ${t.topicBudgetingBg} 0%, ${t.bgActive} 55%)`, border: `1px solid ${t.shine}`, boxShadow: t.shadow2, display: "flex", flexDirection: "column" }}>
            <p style={{ margin: 0, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: t.topicBudgetingFg, fontWeight: 600 }}>Your money read</p>
            <h2 style={{ margin: "12px 0 0", fontFamily: t.ffDisplay, fontWeight: 700, fontSize: 40, lineHeight: 1.1, letterSpacing: "-0.01em" }}>The quiet optimiser</h2>
            <p style={{ margin: "18px 0 0", fontSize: 17, lineHeight: 1.5, color: t.textSecondary }}>
              You don&apos;t panic when money gets tight, you get resourceful. You&apos;d rather find a cheaper way to keep the same life than give something up. That instinct is a strength, and it&apos;s also where the leaks hide.
            </p>
            <p style={{ margin: "12px 0 0", fontSize: 17, lineHeight: 1.5, color: t.textSecondary }}>
              People with your read tend to spend most on small, repeated things. Ela can show you exactly which ones.
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: "auto" }}>
              <span style={{ flex: 1, padding: "14px 18px", borderRadius: 16, background: t.bgActive, border: `1px solid ${t.strokePrimary}`, fontSize: 17, fontWeight: 600, textAlign: "center" }}>Share your read</span>
              <span style={{ flex: 1, padding: "14px 18px", borderRadius: 16, background: t.bgBrandPrimary, fontSize: 17, fontWeight: 600, textAlign: "center" }}>Get the app</span>
            </div>
          </section>
        </div>
      </div>
    </ScaledFrame>
  );
}

export function ElaWebHubHiFi() {
  const quizzes = [
    ["Health", "Continue · 3 of 8", t.topicHealthBg, t.topicHealthFg, false],
    ["Business", "Start · 8 questions", t.topicBusinessBg, t.topicBusinessFg, false],
    ["Love", "View your read", t.topicLoveBg, t.topicLoveFg, true],
    ["Money", "View your read", t.topicBudgetingBg, t.topicBudgetingFg, true],
  ] as const;
  return (
    <ScaledFrame width={WEB_W} height={700} label="Hub · signed in" meta="Continue where you left off">
      <div style={{ width: WEB_W, height: 700, background: t.bgPrimary, fontFamily: t.ffText, color: t.textPrimary }}>
        <WebNav cta="Get the app" ctaColor={t.bgContrast} />
        <div style={{ padding: "8px 40px 0" }}>
          <h1 style={{ margin: 0, fontFamily: t.ffDisplay, fontWeight: 700, fontSize: 36, letterSpacing: "-0.01em" }}>Welcome back, Maya.</h1>
          <section style={{ marginTop: 20, padding: 28, borderRadius: 32, background: `linear-gradient(120deg, ${t.topicHealthBg}, ${t.bgBrandPrimary})`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
            <div>
              <p style={{ margin: 0, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: t.textBrand, fontWeight: 600 }}>Continue where you left off</p>
              <p style={{ margin: "8px 0 0", fontFamily: t.ffDisplay, fontWeight: 700, fontSize: 28, letterSpacing: "-0.01em" }}>Health quiz · 3 questions in</p>
              <p style={{ margin: "6px 0 0", fontSize: 17, color: t.textBrand }}>About two minutes to your health read.</p>
            </div>
            <span style={{ padding: "14px 22px", borderRadius: 16, background: t.bgContrast, color: t.textContrast, fontSize: 17, fontWeight: 600, whiteSpace: "nowrap" }}>Continue</span>
          </section>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 20 }}>
            <div style={{ flex: 1, height: 8, borderRadius: 999, background: t.bgTertiary }}>
              <div style={{ width: "50%", height: 8, borderRadius: 999, background: t.bgBrandPrimary }} />
            </div>
            <span style={{ fontSize: 14, color: t.textSecondary }}>2 of 4 complete</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 20 }}>
            {quizzes.map(([name, sub, bg, fg, done]) => (
              <div key={name} style={{ padding: 20, minHeight: 190, borderRadius: 24, background: t.bgActive, border: `1px solid ${t.shine}`, boxShadow: t.shadow2, display: "flex", flexDirection: "column" }}>
                <span style={{ width: 44, height: 44, borderRadius: 999, background: bg, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={done ? "check" : "sparkles"} size={16} color={fg} />
                </span>
                <p style={{ margin: "auto 0 0", fontFamily: t.ffDisplay, fontWeight: 700, fontSize: 22 }}>{name}</p>
                <p style={{ margin: "4px 0 0", fontSize: 14, color: done ? t.textBrand : t.textSecondary }}>{done ? "✓ " : ""}{sub}</p>
              </div>
            ))}
          </div>
          <section style={{ marginTop: 20, padding: "18px 24px", borderRadius: 24, background: t.bgActive, border: `1px solid ${t.shine}`, boxShadow: t.shadow1, display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontFamily: t.ffDisplay, fontWeight: 700, fontSize: 20 }}>Get Ela on your phone</p>
              <p style={{ margin: "4px 0 0", fontSize: 14, color: t.textSecondary }}>Your reads carry over. Scan and the QR sends you to the right store.</p>
            </div>
            <span style={{ padding: "10px 14px", borderRadius: 12, background: t.bgContrast, color: t.textContrast, fontSize: 14, fontWeight: 600 }}>App Store</span>
            <span style={{ padding: "10px 14px", borderRadius: 12, background: t.bgContrast, color: t.textContrast, fontSize: 14, fontWeight: 600 }}>Google Play</span>
            <span style={{ width: 64, height: 64, borderRadius: 12, background: `repeating-linear-gradient(90deg, ${t.textPrimary} 0 6px, transparent 6px 12px), repeating-linear-gradient(0deg, ${t.textPrimary} 0 6px, ${t.bgActive} 6px 12px)`, backgroundBlendMode: "multiply", border: `6px solid ${t.bgActive}`, outline: `1px solid ${t.strokePrimary}` }} />
          </section>
        </div>
      </div>
    </ScaledFrame>
  );
}
