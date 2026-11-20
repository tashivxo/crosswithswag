import { describe, expect, it } from "vitest";
import { meta } from "@/lib/copy";
import {
  chapterMetadata,
  homeMetadata,
  INDEXABLE_PATHS,
  isIndexable,
  jsonLdGraph,
  privatePageMetadata,
  robotsDirective,
  SITE_URL,
} from "@/lib/seo";

describe("isIndexable", () => {
  it("is true only on Vercel production", () => {
    expect(isIndexable({ VERCEL_ENV: "production" })).toBe(true);
    expect(isIndexable({ VERCEL_ENV: "preview" })).toBe(false);
    expect(isIndexable({ VERCEL_ENV: "development" })).toBe(false);
    expect(isIndexable({})).toBe(false);
  });
});

describe("metadata helpers", () => {
  it("keeps the home title absolute so the template does not double the brand", () => {
    const home = homeMetadata();
    expect(home.title).toEqual({ absolute: meta.title });
    expect(meta.title).toContain("CROSS WITH SWAG");
    expect(meta.description.toLowerCase()).toContain("crosswithswag");
  });

  it("points chapter canonicals at the custom domain paths", () => {
    const space = chapterMetadata("Space", "gallery", "/space");
    expect(space.alternates?.canonical).toBe("/space");
    expect(INDEXABLE_PATHS).toContain("/space");
    expect(SITE_URL).toBe("https://crosswithswag.co.za");
  });

  it("keeps cart and checkout out of the index", () => {
    expect(privatePageMetadata("Cart").robots).toEqual(
      robotsDirective(false),
    );
  });

  it("names the brand in structured data", () => {
    const graph = jsonLdGraph();
    const serialized = JSON.stringify(graph);
    expect(serialized).toContain("CROSS WITH SWAG");
    expect(serialized).toContain("crosswithswag");
    expect(serialized).toContain(SITE_URL);
    expect(serialized).toContain("instagram.com/crosswithswag");
  });
});
