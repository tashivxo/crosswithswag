import type { MetadataRoute } from "next";
import { isIndexable, PRIVATE_PATH_PREFIXES, SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  if (!isIndexable()) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [...PRIVATE_PATH_PREFIXES],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
