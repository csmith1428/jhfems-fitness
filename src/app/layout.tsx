
import type { Metadata } from "next";
import {
  Barlow_Condensed,
  Geist,
  IBM_Plex_Mono,
} from "next/font/google";

import "./globals.css";
import "./brand.css";

import BottomNav from "@/components/BottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Big bold headings and numbers.
const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["700", "800"],
});

// Small typewriter-style labels.
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["500"],
});

export const metadata: Metadata = {
  title: "JHFEMS | Fitness & Wellness",
  description:
    "Jackson Hole Fire/EMS Fitness & Wellness Training Program",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // Some phone browsers add attributes to <html> and <body> before the
      // app loads. This tells React not to warn about that outer shell only.
      suppressHydrationWarning
      className={`${geistSans.variable} ${barlow.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
