import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "NiclNTime — Nicotine Impact Visualizer",
    template: "%s · NiclNTime",
  },
  description:
    "A private, browser-based tool that turns vaping and cigarette use into clear estimates of nicotine exposure, financial cost and time lost. Educational only — not medical advice.",
  applicationName: "NiclNTime",
  keywords: [
    "nicotine",
    "vaping",
    "cigarettes",
    "health",
    "financial impact",
    "quit smoking",
    "quit vaping",
    "nicotine calculator",
  ],
  authors: [{ name: "NiclNTime contributors" }],
  creator: "NiclNTime contributors",
  openGraph: {
    title: "NiclNTime — Nicotine Impact Visualizer",
    description:
      "See what nicotine is really costing you. Estimate exposure, spending and time lost, then compare what changes if you cut down or quit.",
    type: "website",
    siteName: "NiclNTime",
  },
  twitter: {
    card: "summary_large_image",
    title: "NiclNTime — Nicotine Impact Visualizer",
    description:
      "A private, educational nicotine impact visualizer. Estimate exposure, spending and time lost.",
  },
  robots: {
    index: true,
    follow: true,
  },
  category: "health",
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-cyan-400 selection:text-zinc-950">
        {children}
      </body>
    </html>
  );
}
