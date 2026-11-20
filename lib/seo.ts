import type { Metadata } from "next";
import { legalEntity, meta, site } from "@/lib/copy";

export const SITE_URL = "https://crosswithswag.co.za";

export const INDEXABLE_PATHS = [
  "/",
  "/space",
  "/current",
  "/archive",
  "/manifesto",
  "/playlists",
  "/contact",
  "/terms",
  "/shipping",
  "/refunds",
  "/privacy",
] as const;

const PRIVATE_PATH_PREFIXES = ["/cart", "/checkout", "/order"] as const;

type EnvLike = {
  VERCEL_ENV?: string | undefined;
};

/** Index only the Vercel production deployment, never previews or local builds. */
export function isIndexable(
  env: EnvLike = process.env as EnvLike,
): boolean {
  return env.VERCEL_ENV === "production";
}

export function robotsDirective(index: boolean): NonNullable<Metadata["robots"]> {
  if (!index) {
    return { index: false, follow: false };
  }
  return { index: true, follow: true };
}

export function homeMetadata(): Metadata {
  return {
    title: { absolute: meta.title },
    description: meta.description,
    alternates: { canonical: "/" },
    openGraph: {
      title: meta.ogTitle,
      description: meta.description,
      url: "/",
    },
  };
}

export function chapterMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} — ${meta.brand}`,
      description,
      url: path,
    },
  };
}

export function privatePageMetadata(title: string): Metadata {
  return {
    title,
    robots: robotsDirective(false),
  };
}

export function jsonLdGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: meta.brand,
        legalName: legalEntity.name,
        alternateName: ["swag.", "crosswithswag", "@crosswithswag"],
        url: SITE_URL,
        logo: `${SITE_URL}/assets/SWAG_mark_fill.png`,
        email: legalEntity.email,
        sameAs: [site.instagramUrl],
        address: {
          "@type": "PostalAddress",
          addressLocality: "Cape Town",
          addressRegion: "Western Cape",
          addressCountry: "ZA",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: meta.brand,
        alternateName: ["swag.", "crosswithswag"],
        url: SITE_URL,
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en-ZA",
      },
    ],
  };
}

export { PRIVATE_PATH_PREFIXES };
