import type { Metadata, Viewport } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { JsonLd } from "@/components/seo/JsonLd";
import { ShortScreenScript } from "@/components/ShortScreenScript";
import { comingSoonEnabled } from "@/lib/coming-soon";
import { meta, site } from "@/lib/copy";
import { isIndexable, robotsDirective, SITE_URL } from "@/lib/seo";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-instrument-sans",
});

const googleVerification = process.env.GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: meta.title,
    template: `%s — ${meta.brand}`,
  },
  description: meta.description,
  applicationName: meta.brand,
  authors: [{ name: "Marcus Sibiya" }],
  creator: "Marcus Sibiya",
  publisher: "GRISEUS REGIUS (PTY) LTD",
  keywords: [
    "CROSS WITH SWAG",
    "crosswithswag",
    "swag.",
    "Cape Town",
    "wearable editions",
    "kloofstreetnights",
  ],
  robots: robotsDirective(isIndexable()),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: meta.ogTitle,
    description: meta.description,
    type: "website",
    locale: "en_ZA",
    url: SITE_URL,
    siteName: meta.brand,
  },
  twitter: {
    card: "summary_large_image",
    title: meta.ogTitle,
    description: meta.description,
    creator: site.handle,
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  ...(googleVerification
    ? { verification: { google: googleVerification } }
    : {}),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0A0A0A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const comingSoon = comingSoonEnabled();

  return (
    // The head script sets data-cs-short on <html> before hydration (flag on only).
    <html
      lang="en-ZA"
      className={instrumentSans.variable}
      suppressHydrationWarning={comingSoon || undefined}
    >
      {comingSoon ? (
        <head>
          <ShortScreenScript />
        </head>
      ) : null}
      <body>
        <JsonLd />
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
