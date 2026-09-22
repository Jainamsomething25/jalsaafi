import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jalsaafi.vercel.app"),
  title: "JalSaafi Command Center — Autonomous AI Oil-Spill Response",
  description:
    "JalSaafi is an AI-powered autonomous oil-spill detection, prediction, and cleanup platform for coastal water and biodiversity protection — built for the HKU AI+ Challenge.",
  keywords: [
    "JalSaafi",
    "oil spill cleanup",
    "AI water quality",
    "autonomous boat",
    "HKU AI+ Challenge",
    "biodiversity",
    "smart city",
  ],
  openGraph: {
    title: "JalSaafi Command Center",
    description:
      "AI-powered autonomous oil-spill detection, prediction, and cleanup for coastal water and biodiversity protection.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JalSaafi Command Center",
    description:
      "AI-powered autonomous oil-spill detection, prediction, and cleanup for coastal water and biodiversity protection.",
  },
};

export const viewport: Viewport = {
  themeColor: "#05263b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-abyss text-foam">
        <SmoothScrollProvider>
          <ScrollProgress />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
