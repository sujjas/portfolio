"use client";

/**
 * Kabojja International School — the details under the scroll reel.
 *
 *   Tile         Span   Kind       The one thing                              Moves
 *   Admissions   2 × 1  Hero UI    the six admissions steps                   step 3 completes, the line runs on to the tour
 *   Graduates    1 × 1  Stat       850+ annual graduates                      counts up
 *   Facilities   1 × 1  Component  four facility cards                        they stack, as the site's sticky cards do on scroll
 *   Routes       1 × 1  Diagram    three audiences, three ways in             the lines draw in
 *   Curricula    1 × 1  Statement  "One school, two curricula."               still
 *
 * Strings and figures are the live site's (kabojjainternational.com).
 */
import { Poppins } from "next/font/google";
import { Bar, Check, Connector, Text } from "@/components/stageshow/kit";
import { PictureTile, StatTile, StatementTile, left, right } from "./shared";
import "./kabojja.css";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--kb-sans" });

/* ---------------- Admissions (hero) ---------------- */

const STEPS = [
  "Start Your Application",
  "Submit Documents",
  "Schedule an Interview",
  "Attend the School Tour",
  "Review and Decision",
  "Enrollment & Confirmation",
];

function Admissions() {
  return (
    <PictureTile
      area="hero"
      index={0}
      height={(w) => (w < 560 ? 330 : 300)}
      title="Admissions, one step at a time."
      copy="Six steps from first application to confirmation, open all year round."
    >
      {(s, _rect, width) => {
        const compact = width < 560;
        const done = s.on ? 3 : 2; // steps completed
        const steps = compact ? STEPS.slice(0, 4) : STEPS;
        return (
          <div className="kb-adm ud-card" data-compact={compact || undefined}>
            <div className="kb-adm-head">
              <span className="kb-adm-title">Admissions</span>
              <span className="ud-btn ud-btn--primary kb-adm-cta">Enroll Today</span>
            </div>
            <ol className="kb-steps" style={{ "--done": done, "--n": steps.length } as React.CSSProperties}>
              <span className="kb-steps-line" aria-hidden>
                <span className="kb-steps-fill" />
              </span>
              {steps.map((label, i) => (
                <li key={label} className="kb-step" data-done={i < done || undefined} data-current={i === done || undefined}>
                  <span className="kb-step-mark">
                    {i < done ? <Check on size={22} /> : <span className="kb-step-n">{i + 1}</span>}
                  </span>
                  <span className="kb-step-label">{label}</span>
                </li>
              ))}
            </ol>
            <div className="kb-reg">
              <span className="kb-reg-title">Registration</span>
              <span className="kb-reg-fields">
                {[
                  ["Student First Name", 74],
                  ["Choose a School", 58],
                  ["Choose a Year", 46],
                ].map(([label, w]) => (
                  <span key={label as string} className="kb-field">
                    <span className="kb-field-label">{label}</span>
                    <span className="kb-field-box">
                      <Bar w={w as number} h={6} tone={2} />
                    </span>
                  </span>
                ))}
              </span>
            </div>
          </div>
        );
      }}
    </PictureTile>
  );
}

/* ---------------- Facilities (component) ---------------- */

const FACILITIES = ["Boarding Life", "Learning Support", "Sick Bay", "Auditorium"];

function Facilities() {
  return (
    <PictureTile area="facilities" index={2} height={210} title="Facilities that stack." copy="The cards pin and pile up as the page scrolls.">
      {(s) => (
        <div className="kb-stack" data-on={s.on || undefined}>
          {FACILITIES.map((f, i) => (
            <span key={f} className="kb-fac" style={{ "--i": i } as React.CSSProperties}>
              <span className="kb-fac-title">{f}</span>
            </span>
          ))}
        </div>
      )}
    </PictureTile>
  );
}

/* ---------------- Routes (diagram) ---------------- */

const ROUTES = [
  ["Prospective families", "Enroll Today"],
  ["Parents", "Parent portal"],
  ["Students", "Student Life"],
];

function Routes() {
  return (
    <PictureTile area="routes" index={3} height={190} title="A way in for each audience." copy="Each group lands somewhere of its own.">
      {(s, rect) => (
        <>
          <div className="kb-routes">
            {ROUTES.map(([who, to]) => (
              <span key={who} className="kb-route">
                <span className="ud-chip" data-target={`who-${who}`}>
                  <Text>{who}</Text>
                </span>
                <span className="ud-chip kb-dest" data-target={`to-${who}`} data-on={s.on || undefined}>
                  <Text>{to}</Text>
                </span>
              </span>
            ))}
          </div>
          {ROUTES.map(([who], i) => {
            const a = rect(`who-${who}`);
            const b = rect(`to-${who}`);
            return a && b ? <Connector key={who} from={right(a)} to={left(b)} show={s.on} className={`ud-line ud-line--${i}`} /> : null;
          })}
        </>
      )}
    </PictureTile>
  );
}

export function KabojjaDetails() {
  return (
    <div className={`ud-bento kb-details ${poppins.variable}`}>
      <div className="ud-grid kb-grid">
        <Admissions />
        <StatTile area="stat" index={1} lead="Annual graduates" value={850} unit="+" label="with a 98.3% average pass rate at Cambridge A Level." />
        <Facilities />
        <Routes />
        <StatementTile
          area="curricula"
          big="One school, two curricula."
          small="IB from Early Years to the Diploma Programme, Cambridge from Early Years to High School, each with its own route through the site."
        />
      </div>
    </div>
  );
}
