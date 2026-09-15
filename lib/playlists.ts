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
  cover: string | null;
  curators: PlaylistCurator[];
};

const SPOTIFY_EMBED_BASE = "https://open.spotify.com/embed/playlist";
const SPOTIFY_PAGE_BASE = "https://open.spotify.com/playlist";

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
    cover: "/assets/playlists/dalawithswag.jpg",
    curators: [instagramCurator("tashivxo"), instagramCurator("t8rsten")],
  },
  {
    slug: "stepwithswag",
    title: "stepwithswag.",
    description:
      "Confident, pregame vibes, hip hop, hot club energy. Amapiano, afrobeats, hip-hop, gqom. Sounds of South Ah.",
    spotifyId: "4r8rIbGWFwOzAyRG2rUtUZ",
    cover: "/assets/playlists/stepwithswag.jpg",
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
    cover: "/assets/playlists/freefallwithswag.jpg",
    curators: [
      instagramCurator("chinglaania"),
      instagramCurator("tarasabali"),
    ],
  },
];

export function isPlaylistLive(
  playlist: Playlist,
): playlist is Playlist & { spotifyId: string } {
  return Boolean(playlist.spotifyId);
}

export function getPlaylistEmbedUrl(spotifyId: string): string {
  return `${SPOTIFY_EMBED_BASE}/${spotifyId}?utm_source=generator&theme=0`;
}

export function getPlaylistPageUrl(playlist: Playlist): string | null {
  return isPlaylistLive(playlist)
    ? `${SPOTIFY_PAGE_BASE}/${playlist.spotifyId}`
    : null;
}
