import Image from "next/image";
import {
  getPlaylistEmbedUrl,
  getPlaylistPageUrl,
  isPlaylistLive,
  type Playlist,
} from "@/lib/playlists";

function PlaylistCover({ title, src }: { title: string; src: string | null }) {
  if (src) {
    return (
      <div className="playlist-cover">
        <Image
          src={src}
          alt={`${title} playlist cover`}
          fill
          quality={90}
          sizes="(max-width: 768px) 100vw, 1200px"
        />
      </div>
    );
  }

  return (
    <div className="playlist-cover playlist-cover--type" aria-hidden="true">
      <span>{title}</span>
    </div>
  );
}

export function PlaylistBlock({ playlist }: { playlist: Playlist }) {
  const pageUrl = getPlaylistPageUrl(playlist);
  const live = isPlaylistLive(playlist);

  return (
    <article className="playlist-block">
      <h2>{playlist.title}</h2>
      <p className="body-copy voice playlist-desc">{playlist.description}</p>

      <div className="playlist-media">
        <PlaylistCover title={playlist.title} src={playlist.cover} />

        {live ? (
          <div className="playlist-embed" data-lenis-prevent>
            <iframe
              title={`${playlist.title} on Spotify`}
              src={getPlaylistEmbedUrl(playlist.spotifyId)}
              width="100%"
              height={352}
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              data-lenis-prevent
            />
          </div>
        ) : (
          <div className="playlist-soon">
            <span className="lbl">[ coming soon ]</span>
            <p className="voice">this list is not live on spotify yet.</p>
          </div>
        )}
      </div>

      {pageUrl ? (
        <a
          className="playlist-open"
          href={pageUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          open in spotify
        </a>
      ) : null}
    </article>
  );
}
