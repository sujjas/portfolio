import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { AgentationFeedback } from "@/components/site/Agentation";
import { ScrollRestoration } from "@/components/site/ScrollRestoration";
import { Haptics } from "@/components/site/Haptics";
import { LanyardPrefetch } from "@/components/site/LanyardPrefetch";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  axes: ["opsz"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Elijah Kasujja — Design Engineer, Kampala",
  description:
    "Design engineer based in Kampala. I design and build websites from information architecture through to launch and handover.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Review-only chrome — the Agentation feedback chip and the ui.sh
  // UI-picker script are useful while iterating with the agent, but
  // ship as dead weight (JS bandwidth + extra DNS lookup) for
  // public visitors. Gate behind NODE_ENV so production never loads
  // them. process.env.NODE_ENV is statically inlined by Next.js at
  // build time, so the production bundle simply doesn't reference
  // either component.
  const showReviewChrome = process.env.NODE_ENV === "development";

  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-dvh flex flex-col bg-white text-neutral-950 font-sans isolate overflow-x-clip">
        <SmoothScroll />
        <ScrollRestoration />
        <Haptics />
        <LanyardPrefetch />
        {children}
        {showReviewChrome ? <AgentationFeedback /> : null}
        <Analytics />
        {showReviewChrome ? (
          <Script src="https://ui.sh/ui-picker.js" />
        ) : null}
      </body>
    </html>
  );
}
