export type PlaylistSlug =
  | "dalawithswag"
  | "stepwithswag"
  | "freefallwithswag";

export type PlaylistCurator = {
  handle: string;
  href: string;
};

export type Playlist = {
  slug: PlaylistSlug;
  title: string;
  description: string;
  spotifyId: string | null;
  spotifyUrl: string | null;
  cover: string | null;
  curators: PlaylistCurator[];
};

const SPOTIFY_EMBED_BASE = "https://open.spotify.com/embed/playlist";
const SPOTIFY_PAGE_BASE = "https://open.spotify.com/playlist";
const COVER_REVALIDATE_SECONDS = 60 * 60 * 24;

function instagramCurator(handleWithoutAt: string): PlaylistCurator {
  return {
    handle: `@${handleWithoutAt}`,
    href: `https://www.instagram.com/${handleWithoutAt}/`,
  };
}

export const playlists: Playlist[] = [
  {
    slug: "dalawithswag",
    title: "dalawithswag.",
    description:
      "for the lock in sessions. Hip Hop, Indie, Lofi, 3 step, house, edm, afrotech",
    spotifyId: "76e1Mn0Lig2WiNqkAXeSWQ",
    spotifyUrl: "https://open.spotify.com/playlist/76e1Mn0Lig2WiNqkAXeSWQ",
    cover: "/assets/playlists/dalawithswag.jpg",
    curators: [
      instagramCurator("tashivxo"),
      instagramCurator("t8rsten"),
    ],
  },
  {
    slug: "stepwithswag",
    title: "stepwithswag.",
    description:
      "Confident, pregame energy, hip hop, hot club energy. Amapiano, afrobeats, hip-hop, gqom. Sounds of South Ah.",
    spotifyId: "4r8rIbGWFwOzAyRG2rUtUZ",
    spotifyUrl: "https://open.spotify.com/playlist/4r8rIbGWFwOzAyRG2rUtUZ",
    cover: null,
    curators: [
      instagramCurator("vustarrr"),
      instagramCurator("windows.ocean2001"),
    ],
  },
  {
    slug: "freefallwithswag",
    title: "freefallwithswag.",
    description:
      "the drop. no plan, just the fall. Chill. Decompression, warmth. Neo-soul, R&B, soft amapiano, downtempo.",
    spotifyId: "3ShE7C9FsLA8Rk2bW4hz8C",
    spotifyUrl: "https://open.spotify.com/playlist/3ShE7C9FsLA8Rk2bW4hz8C",
    cover: "/assets/playlists/freefallwithswag.jpg",
    curators: [
      instagramCurator("chinglaania"),
      instagramCurator("tarasabali"),
    ],
  },
];

export function getPlaylistEmbedUrl(spotifyId: string): string {
  return `${SPOTIFY_EMBED_BASE}/${spotifyId}?utm_source=generator&theme=0`;
}

export function getPlaylistPageUrl(playlist: Playlist): string | null {
  if (playlist.spotifyUrl) return playlist.spotifyUrl;
  if (playlist.spotifyId) return `${SPOTIFY_PAGE_BASE}/${playlist.spotifyId}`;
  return null;
}

export function isPlaylistLive(
  playlist: Playlist,
): playlist is Playlist & { spotifyId: string } {
  return playlist.spotifyId !== null && playlist.spotifyId.length > 0;
}

export function isAllowedCoverSrc(src: string): boolean {
  if (src.startsWith("/")) return true;

  try {
    const url = new URL(src);
    if (url.protocol !== "https:") return false;

    const host = url.hostname;
    if (host === "i.scdn.co" || host === "mosaic.scdn.co") return true;
    if (/^image-cdn.*\.spotifycdn\.com$/.test(host)) return true;
    return false;
  } catch {
    return false;
  }
}

type SpotifyOEmbed = {
  thumbnail_url?: unknown;
};

export async function getPlaylistCoverUrl(
  playlist: Playlist,
): Promise<string | null> {
  if (playlist.cover) return playlist.cover;

  const pageUrl = getPlaylistPageUrl(playlist);
  if (!pageUrl) return null;

  try {
    const response = await fetch(
      `https://open.spotify.com/oembed?url=${encodeURIComponent(pageUrl)}`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: COVER_REVALIDATE_SECONDS },
      },
    );

    if (!response.ok) return null;

    const data = (await response.json()) as SpotifyOEmbed;
    if (typeof data.thumbnail_url !== "string") return null;
    if (!isAllowedCoverSrc(data.thumbnail_url)) return null;

    return data.thumbnail_url;
  } catch {
    return null;
  }
}
