import { NextResponse } from "next/server";

const CSV = `city,outlet_type,availability,out_of_stock,share_of_shelf
Lagos,Supermarket,0.86,0.07,0.24
Lagos,Kiosk,0.74,0.19,0.21
Abuja,Supermarket,0.81,0.11,0.23
Abuja,Kiosk,0.69,0.22,0.19
Nairobi,Supermarket,0.88,0.06,0.27
Nairobi,Kiosk,0.77,0.15,0.22
`;

/** Canned CSV for the embedded Sena prototype. */
export async function GET() {
  return new NextResponse(CSV, { headers: { "Content-Type": "text/plain" } });
}
