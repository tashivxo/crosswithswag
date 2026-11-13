import type { Metadata, Viewport } from "next";
import { Instrument_Sans } from "next/font/google";
import "./fallback.css";
import { ShortScreenScript } from "@/components/ShortScreenScript";
import { comingSoonEnabled } from "@/lib/coming-soon";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-instrument-sans",
});

export const metadata: Metadata = {
  title: "swag. — the site is down. the store isn't.",
  description:
    "the store is open on whatsapp. pick your pieces in the catalogue, confirm size, pay by eft.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F5F3E7",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const comingSoon = comingSoonEnabled();

  return (
    <html
      lang="en"
      className={instrumentSans.variable}
      suppressHydrationWarning={comingSoon || undefined}
    >
      {comingSoon ? (
        <head>
          <ShortScreenScript />
        </head>
      ) : null}
      <body>{children}</body>
    </html>
  );
}
