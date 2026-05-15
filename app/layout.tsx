import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { AgentationFeedback } from "@/components/site/Agentation";
import { GlitchIntro } from "@/components/site/GlitchIntro";
import { ScrollRestoration } from "@/components/site/ScrollRestoration";
import { Haptics } from "@/components/site/Haptics";

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
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-dvh flex flex-col bg-white text-neutral-950 font-sans isolate overflow-x-clip">
        <SmoothScroll />
        <ScrollRestoration />
        <Haptics />
        <GlitchIntro>{children}</GlitchIntro>
        <AgentationFeedback />
        <Script src="https://ui.sh/ui-picker.js" />
      </body>
    </html>
  );
}
