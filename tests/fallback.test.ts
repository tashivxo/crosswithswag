import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import nextConfig from "../next.config";
import { FallbackPage } from "../components/fallback/FallbackPage";
import {
  FALLBACK_STATUS,
  REDIRECT_SOURCE,
  WHATSAPP_CATALOGUE_URL,
  fallbackPlaylists,
} from "../lib/fallback";

const html = renderToStaticMarkup(createElement(FallbackPage));

function matchesRedirect(path: string): boolean {
  const re = new RegExp(
    "^" + REDIRECT_SOURCE.replace("/:path(", "/(").replace(/\)\.\+\)$/, ").+)") + "$",
  );
  return re.test(path);
}

describe("redirects", () => {
  it("sends every other route to /", async () => {
    const rules = await nextConfig.redirects!();
    expect(rules).toHaveLength(1);
    expect(rules[0].destination).toBe("/");
    for (const p of ["/archive", "/current", "/contact", "/manifesto", "/playlists", "/a/b/c"]) {
      expect(matchesRedirect(p), p).toBe(true);
    }
  });
  it("leaves /, api, assets and files alone", () => {
    for (const p of ["/", "/api/waitlist", "/_next/static/x.js", "/assets/a.svg", "/favicon.ico"]) {
      expect(matchesRedirect(p), p).toBe(false);
    }
  });
  it("keeps status 200 for now", () => {
    expect(FALLBACK_STATUS).toBe(200);
  });
});

describe("playlists", () => {
  it("renders the three rows from data", () => {
    expect(fallbackPlaylists.map((p) => p.name)).toEqual(["step.", "dala.", "freefall."]);
    expect((html.match(/class="fb-row"/g) ?? []).length).toBe(3);
    for (const p of fallbackPlaylists) {
      expect(html).toContain(`playlist: ${p.playlistName} · by crosswithswag`);
      expect(html).toContain(p.mood);
    }
    expect(html).not.toMatch(/listen for free/i);
  });
  it("uses the existing Spotify playlist urls", () => {
    for (const p of fallbackPlaylists) {
      expect(p.spotifyUrl).toMatch(/^https:\/\/open\.spotify\.com\/playlist\/[A-Za-z0-9]+$/);
    }
  });
  it("has one h1 and an h2 per screen", () => {
    expect((html.match(/<h1/g) ?? []).length).toBe(1);
    expect((html.match(/<h2/g) ?? []).length).toBe(2);
    expect(html).toContain('id="playlists"');
  });
});

describe("external links", () => {
  const anchors = html.match(/<a [^>]*>/g) ?? [];
  const external = anchors.filter((a) => /href="https?:/.test(a));
  it("opens whatsapp and spotify in a new tab with noopener", () => {
    expect(external.length).toBe(5);
    for (const a of external) {
      expect(a).toContain('target="_blank"');
      expect(a).toContain('rel="noopener noreferrer"');
    }
    expect(external.filter((a) => a.includes(WHATSAPP_CATALOGUE_URL))).toHaveLength(2);
  });
});
