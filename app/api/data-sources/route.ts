import { NextResponse } from "next/server";

/** Canned data-source list for the embedded Sena prototype. */
export async function GET() {
  const now = Date.now();
  const files = [
    "Global_Brand_Health_Q4.xlsx",
    "Retail_Scanner_Data_Nov.csv",
    "Energy_Drink_Competitive_Analysis.pptx",
    "Gen_Z_Beverage_Study.csv",
    "Sustainability_Survey_Results.pdf",
  ];
  return NextResponse.json(
    files.map((name, i) => ({ name, size: 1_200_000 + i * 340_000, mtime: now - i * 86_400_000 })),
  );
}
