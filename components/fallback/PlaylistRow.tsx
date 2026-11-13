import Image from "next/image";
import type { FallbackPlaylist } from "@/lib/fallback";

export function PlaylistRow({ playlist }: { playlist: FallbackPlaylist }) {
  return (
    <li className="fb-row">
      <p className="fb-label fb-row-index">
        {playlist.index} [ {playlist.lane} ]
      </p>
      <h3 className="fb-row-name">{playlist.name}</h3>
      <div className="fb-row-meta">
        <p className="fb-row-mood">{playlist.mood}</p>
        <p className="fb-label fb-row-genres">{playlist.genres}</p>
        <p className="fb-row-credit">
          playlist: {playlist.playlistName} · by crosswithswag
        </p>
        <a
          className="fb-textlink"
          href={playlist.spotifyUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          OPEN {playlist.playlistName.toUpperCase()} IN SPOTIFY ↗
          <span className="fb-sr"> (opens in a new tab)</span>
        </a>
      </div>
      <div className="fb-cover">
        <Image
          src={playlist.cover}
          width={1024}
          height={1024}
          sizes="(max-width: 767px) 160px, 240px"
          alt=""
        />
      </div>
    </li>
  );
}
