import type { Metadata, Viewport } from "next";
import { Instrument_Sans } from "next/font/google";
import "@/lib/tokens.css";
import "./globals.css";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { meta } from "@/lib/copy";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-instrument-sans",
});

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  openGraph: {
    title: meta.ogTitle,
    description: meta.description,
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A0A0A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={instrumentSans.variable}>
      <body>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
