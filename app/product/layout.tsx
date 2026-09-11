import { DM_Sans, DM_Serif_Display, Gabarito, Hanken_Grotesk } from "next/font/google";

/**
 * Product-track layout: loads the real product typefaces so the high-fidelity
 * renders use the same fonts the products ship with. Exposed as CSS variables
 * consumed by components/site/case-studies/product/hifi/*.
 */
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});
const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: "400",
});
const gabarito = Gabarito({
  variable: "--font-gabarito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${dmSans.variable} ${dmSerif.variable} ${gabarito.variable} ${hanken.variable} contents`}>
      {children}
    </div>
  );
}
