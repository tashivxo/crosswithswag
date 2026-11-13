import { getPlaylistPageUrl, playlists as sitePlaylists } from "./playlists";
import type { PlaylistSlug } from "./playlists";

/** Flip to 503 (with Retry-After) once search engines should treat the site as down. */
export const FALLBACK_STATUS: 200 | 503 = 200;
export const FALLBACK_RETRY_AFTER_SECONDS = 3600;

// TODO(confirm number): Figma says 2881, the catalogue link uses 2891.
export const WHATSAPP_PHONE = "27682812891";
export const WHATSAPP_DISPLAY = "+27 68 281 2891";
export const WHATSAPP_CATALOGUE_URL = `https://wa.me/c/${WHATSAPP_PHONE}`;

export const copy = {
  notice: "[ site notice ]",
  headline: ["the site is down.", "the store isn't."],
  body: "we're fixing it. until then the store is open on whatsapp. pick your colourway in the chat, we confirm size and payment, and send your paxi link.",
  storeLabel: "[ the store — whatsapp ]",
  steps: [
    "pick your pieces in the catalogue",
    "confirm size, pay by eft",
    "we send your paxi link",
  ],
  cta: "ORDER ON WHATSAPP →",
  waitLink: "WHILE YOU WAIT — THE PLAYLISTS ↓",
  storeNote: `${WHATSAPP_DISPLAY} · one person on the other end. no cart. no account.`,
  footerLeft: "CAPE TOWN — EST. 2026",
  footerRight: "GRISEUS REGIUS (PTY) LTD 2026",
  playlistsLabel: "[ the playlists — every set. through. ]",
  playlistsHeadline: "SOUND COMES FIRST.",
  playlistsIntro:
    "the playlists came before the clothes. three moments, three playlists, free to save, always open.",
  closer: "when you're ready, the store is on whatsapp.",
};

export type FallbackPlaylist = {
  index: string;
  lane: string;
  name: string;
  mood: string;
  genres: string;
  playlistName: string;
  spotifyUrl: string;
  cover: { src: string; width: number; height: number; placeholder: boolean };
};

function spotifyUrl(slug: PlaylistSlug): string {
  const found = sitePlaylists.find((p) => p.slug === slug);
  const url = found ? getPlaylistPageUrl(found) : null;
  // TODO(spotify url): missing id in lib/playlists.ts
  return url ?? "https://open.spotify.com/";
}

const placeholder = {
  src: "/assets/playlists/cover-placeholder.svg",
  width: 800,
  height: 1000,
  placeholder: true,
};

export const fallbackPlaylists: FallbackPlaylist[] = [
  {
    index: "01",
    lane: "GOING OUT",
    name: "step.",
    mood: "confident, pregame vibes, hot club energy.",
    genres: "AMAPIANO · AFROBEATS · HIP HOP · GQOM",
    playlistName: "stepwithswag.",
    spotifyUrl: spotifyUrl("stepwithswag"),
    cover: {
      src: "/assets/playlists/step-cover-4x5.jpg",
      width: 1028,
      height: 1284,
      placeholder: false,
    },
  },
  {
    index: "02",
    lane: "STUDY",
    name: "dala.",
    mood: "for the lock in sessions.",
    genres: "HIP HOP · INDIE · LOFI · 3 STEP · HOUSE · AFROTECH",
    playlistName: "dalawithswag.",
    spotifyUrl: spotifyUrl("dalawithswag"),
    // TODO(cover): swap for the 1600x2000 export
    cover: placeholder,
  },
  {
    index: "03",
    lane: "CHILL",
    name: "freefall.",
    mood: "the drop. no plan, just the fall.",
    genres: "NEO-SOUL · R&B · SOFT AMAPIANO · DOWNTEMPO",
    playlistName: "freefallwithswag.",
    spotifyUrl: spotifyUrl("freefallwithswag"),
    // TODO(cover): swap for the 1600x2000 export
    cover: placeholder,
  },
];

/** Every route except `/`, API routes, Next internals and files with an extension. */
export const REDIRECT_SOURCE = "/:path((?!api(?:/|$)|_next(?:/|$)|assets(?:/|$)|[^/]*\\.[^/]*$).+)";
