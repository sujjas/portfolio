/**
 * Cassia Lodge — hotel on Buziga Hill, Kampala. A Framer design rebuilt in
 * Next.js, with booking requests checked against live room availability
 * (Upstash Redis), Resend emails, and a password-protected back office
 * with a practice-mode staff guide.
 */
import {
  Block,
  HairLine,
  SitemapFigure,
  SitemapNode,
  Wireframe,
} from "./primitives";

export function CassiaLodgeSitemap() {
  const rootCx = 300;
  const topLevel = ["/rooms", "/service", "/gallery", "/contact", "/facilities"].map(
    (label, i) => ({ label, x: 20 + i * 116 }),
  );

  return (
    <SitemapFigure
      title="Sitemap · cassialodge.com"
      meta="07 public routes · 03 staff surfaces"
      viewBox="0 0 880 470"
      notes={[
        "Four room types and 28 rooms make up the availability model. Fully booked nights grey out in the calendar, and 'Only N left' appears once a room type falls below a threshold staff set.",
        "Every public page is prerendered. Only the booking, contact and availability endpoints run on the server, and the booking endpoint checks availability again, so a stale page can't overbook.",
        "Guest-facing availability is cached for 30 seconds and never exposes who booked.",
      ]}
    >
      <SitemapNode x={rootCx - 60} y={20} w={120} h={44} label="Home /" tone="dark" />

      {topLevel.map((n) => (
        <SitemapNode key={n.label} x={n.x} y={130} w={104} h={40} label={n.label} parentX={rootCx} parentY={64} />
      ))}

      {["restaurant", "events", "weddings"].map((label, i) => (
        <SitemapNode
          key={label}
          x={20 + i * 116}
          y={235}
          w={104}
          h={36}
          label={label}
          tone="accent"
          parentX={188}
          parentY={170}
        />
      ))}
      <text x={20} y={296} fontSize="11" fontFamily="inherit" fill="#7c3aed">
        /SERVICE-DETAILS/[SLUG] · MENUS AS PDF
      </text>

      {/* Back office */}
      <rect x={620} y={20} width={240} height={250} rx={10} fill="#fafafa" stroke="#d4d4d4" strokeDasharray="4 4" />
      <text x={640} y={48} fontSize="11" fontFamily="inherit" fill="#a3a3a3">
        STAFF · NOINDEX
      </text>
      <text x={640} y={74} fontSize="12" fontFamily="inherit" fill="#0a0a0a">/admin/bookings</text>
      <text x={640} y={92} fontSize="11" fontFamily="inherit" fill="#737373">Pending · Confirmed · Past · Declined</text>
      <text x={640} y={120} fontSize="12" fontFamily="inherit" fill="#0a0a0a">/admin</text>
      <text x={640} y={138} fontSize="11" fontFamily="inherit" fill="#737373">Close rooms · set thresholds</text>
      <text x={640} y={166} fontSize="12" fontFamily="inherit" fill="#0a0a0a">/staff-guide</text>
      <text x={640} y={184} fontSize="11" fontFamily="inherit" fill="#737373">Practice copies on made-up data</text>
      <text x={640} y={218} fontSize="11" fontFamily="inherit" fill="#a3a3a3">API</text>
      <text x={640} y={240} fontSize="11" fontFamily="inherit" fill="#737373">booking · availability · contact</text>

      <rect x={20} y={330} width={840} height={90} rx={10} fill="#fafafa" stroke="#d4d4d4" />
      <text x={40} y={358} fontSize="11" fontFamily="inherit" fill="#a3a3a3">
        BOOKING LIFECYCLE
      </text>
      <text x={40} y={384} fontSize="12" fontFamily="inherit" fill="#0a0a0a">
        Guest request → staff confirm or decline → guest emailed → deleted a year after check-out
      </text>
      <text x={40} y={404} fontSize="11" fontFamily="inherit" fill="#737373">
        Phone, email, walk-in and Booking.com stays are entered by hand into the same calendar.
      </text>
    </SitemapFigure>
  );
}

export function CassiaLodgeWireframe() {
  return (
    <Wireframe
      title="Booking request wireframe"
      meta="Mid-fi · closes every page"
      annotations={[
        { x: 400, y: 150, label: "Room type first, so the calendar can show that type's availability" },
        { x: 768, y: 150, label: "'Only N left' appears once a type falls below the threshold staff set" },
        { x: 340, y: 200, label: "Fully booked nights are greyed out, never hidden" },
        { x: 768, y: 410, label: "Estimated total (rate × nights), framed as an estimate, not a price" },
        { x: 768, y: 500, label: "A request, not a payment: staff confirm and the guest is emailed" },
      ]}
    >
      <Block x="20" y="20" w="760" h="70" label="Photograph · Book your stay" />

      <HairLine y="115" label="Room type" />
      <Block x="20" y="130" w="180" h="44" label="Single" />
      <Block x="210" y="130" w="180" h="44" label="Double" tone="accent" />
      <Block x="400" y="130" w="180" h="44" label="Twin" />
      <Block x="590" y="130" w="160" h="44" label="Triple · 1 left" />

      <HairLine y="200" label="Dates" />
      {Array.from({ length: 21 }).map((_, i) => {
        const col = i % 7;
        const row = Math.floor(i / 7);
        const booked = [4, 5, 11].includes(i);
        const picked = [8, 9, 10].includes(i);
        return (
          <Block
            key={i}
            x={20 + col * 64}
            y={215 + row * 46}
            w="56"
            h="38"
            label={booked ? "full" : String(i + 1)}
            tone={picked ? "dark" : booked ? "neutral" : "neutral"}
          />
        );
      })}

      <Block x="480" y="215" w="300" h="40" label="Guest details" />
      <Block x="480" y="263" w="300" h="40" label="Message" />

      <HairLine y="370" label="Summary" />
      <Block x="20" y="385" w="440" h="50" label="Double · 3 nights" />
      <Block x="480" y="385" w="300" h="50" label="Estimated total" tone="accent" />

      <Block x="20" y="500" w="760" h="44" label="Request booking" tone="dark" />
      <Block x="20" y="555" w="760" h="14" />
    </Wireframe>
  );
}
