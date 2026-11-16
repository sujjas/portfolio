/**
 * Nakasero Hospital — private, not-for-profit hospital in Kampala.
 * Redesign delivered as a 17-page coded prototype (static HTML/CSS/JS),
 * organised by audience and care centre. The structure carried into the
 * hospital's live WordPress site.
 */
import {
  Block,
  HairLine,
  SitemapFigure,
  SitemapNode,
  Wireframe,
} from "./primitives";

export function NakaseroSitemap() {
  const rootCx = 440;
  const audiences = ["Patients & visitors", "International", "Professionals"].map((label, i) => ({
    label,
    x: 20 + i * 150,
  }));
  const care = ["Conditions", "Specialists", "Care centres", "Specialties"].map((label, i) => ({
    label,
    x: 480 + i * 100,
  }));

  return (
    <SitemapFigure
      title="Sitemap · Nakasero Hospital"
      meta="17 pages · 06 care centres"
      viewBox="0 0 880 500"
      notes={[
        "The top row is organised by who is asking (patients and visitors, international patients, medical professionals). The row below is organised by care, with six care centres in a mega-menu next to a 24/7 emergency link.",
        "A 'How can we help you today?' helper on the home page asks who you are and what you need, then sends you to the right page.",
        "Conditions are browsable A–Z (14 in the prototype), and the specialist directory carries 19 filters, so most journeys end on a doctor's profile.",
      ]}
    >
      <SitemapNode x={rootCx - 60} y={20} w={120} h={44} label="Home /" tone="dark" />

      {audiences.map((n) => (
        <SitemapNode key={n.label} x={n.x} y={130} w={140} h={40} label={n.label} parentX={rootCx} parentY={64} />
      ))}
      {care.map((n) => (
        <SitemapNode key={n.label} x={n.x} y={130} w={92} h={40} label={n.label} parentX={rootCx} parentY={64} />
      ))}

      <SitemapNode x={20} y={235} w={140} h={36} label="Patient support" parentX={90} parentY={170} />
      <SitemapNode x={20} y={285} w={140} h={36} label="Patient experience" parentX={90} parentY={271} />
      <SitemapNode x={170} y={235} w={140} h={36} label="VIP concierge" parentX={240} parentY={170} />

      <SitemapNode x={470} y={235} w={112} h={36} label="Condition" tone="accent" parentX={526} parentY={170} />
      <SitemapNode x={590} y={235} w={112} h={36} label="Doctor profile" tone="accent" parentX={626} parentY={170} />
      <SitemapNode x={710} y={235} w={150} h={36} label="Care centre" tone="accent" parentX={726} parentY={170} />
      <SitemapNode x={710} y={285} w={150} h={36} label="Procedure" tone="accent" parentX={826} parentY={170} />

      <rect x={20} y={360} width={840} height={95} rx={10} fill="#fafafa" stroke="#d4d4d4" strokeDasharray="4 4" />
      <text x={40} y={388} fontSize="11" fontFamily="inherit" fill="#a3a3a3">
        CARE CENTRES
      </text>
      <text x={40} y={412} fontSize="12" fontFamily="inherit" fill="#0a0a0a">
        General Clinic · Heart & Vascular · Surgical Care · Women&apos;s · Children&apos;s · Mental Health
      </text>
      <text x={40} y={434} fontSize="11" fontFamily="inherit" fill="#737373">
        Each centre links down to its conditions, specialists and procedures.
      </text>
    </SitemapFigure>
  );
}

export function NakaseroWireframe() {
  return (
    <Wireframe
      title="Doctor profile wireframe"
      meta="Mid-fi · specialist page"
      annotations={[
        { x: 448, y: 110, label: "Breadcrumb keeps the care centre in view, so a patient can step back" },
        { x: 448, y: 300, label: "Biography first, longer details in accordions below it" },
        { x: 768, y: 120, label: "Booking card stays beside the profile: day picker first, then time slots" },
        { x: 588, y: 436, label: "Areas of operation link out to the conditions this doctor treats" },
        { x: 768, y: 510, label: "A closing 'Ready to book?' band for anyone who read to the end" },
      ]}
    >
      <Block x="20" y="10" w="760" h="16" label="Hospital alert" tone="accent" />
      <Block x="20" y="32" w="100" h="40" label="NH" />
      <Block x="140" y="32" w="640" h="18" label="Patients & visitors · International · Professionals" />
      <Block x="140" y="54" w="640" h="18" label="Care centres · 24/7 Emergency" />

      <Block x="20" y="95" w="420" h="18" label="Home / Heart & Vascular / Specialists" />
      <Block x="20" y="125" w="120" h="120" label="Photo" />
      <Block x="155" y="130" w="285" h="30" label="Dr Name, Specialty" />
      <Block x="155" y="168" w="200" h="14" />
      <Block x="155" y="190" w="120" h="24" label="Cardiology" tone="accent" />

      <HairLine y="270" label="Biography" />
      <Block x="20" y="280" w="420" h="12" />
      <Block x="20" y="298" w="420" h="12" />
      <Block x="20" y="316" w="300" h="12" />
      <Block x="20" y="340" w="420" h="30" label="Details  +" />
      <Block x="20" y="376" w="420" h="30" label="Details  +" />

      <rect x="470" y="95" width="310" height="290" rx="10" fill="#fff" stroke="#d4d4d4" />
      <text x="490" y="124" fontSize="11" fontFamily="inherit" fill="#a3a3a3">BOOK AN APPOINTMENT</text>
      {["Mon", "Tue", "Wed", "Thu", "Fri"].map((d, i) => (
        <Block key={d} x={490 + i * 56} y={140} w="48" h="44" label={d} tone={i === 1 ? "dark" : "neutral"} />
      ))}
      {[0, 1, 2].map((row) =>
        [0, 1, 2].map((col) => (
          <Block
            key={`${row}-${col}`}
            x={490 + col * 92}
            y={200 + row * 40}
            w="84"
            h="32"
            label={`${9 + row * 3 + col}:00`}
            tone={row === 1 && col === 1 ? "accent" : "neutral"}
          />
        )),
      )}
      <Block x="490" y="330" w="270" h="38" label="Continue" tone="dark" />

      <HairLine y="440" label="Areas of operation" />
      <Block x="20" y="450" w="180" h="36" label="Hypertension" />
      <Block x="210" y="450" w="180" h="36" label="Condition" />
      <Block x="400" y="450" w="180" h="36" label="Condition" />
      <Block x="590" y="450" w="190" h="36" label="All conditions" />

      <Block x="20" y="525" w="760" h="45" label="Ready to book?" tone="dark" />
    </Wireframe>
  );
}
