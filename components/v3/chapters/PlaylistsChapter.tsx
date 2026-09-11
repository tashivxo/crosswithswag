import { Reveal } from "@/components/v3/Reveal";
import { PlaylistBlock } from "@/components/v3/PlaylistBlock";
import { PlaylistCurators } from "@/components/v3/PlaylistCurators";
import { playlistsPage } from "@/lib/copy";
import { playlists } from "@/lib/playlists";

export function PlaylistsChapter() {
  return (
    <section id="playlists" className="chapter">
      <section className="wrap page-head">
        <span className="lbl">{playlistsPage.label}</span>
        <h1 className="display" style={{ marginTop: 18 }}>
          {playlistsPage.display.map((line) => (
            <span key={line}>
              {line}
              <br />
            </span>
          ))}
        </h1>
        <p className="body-copy voice" style={{ marginTop: 30 }}>
          {playlistsPage.intro}
        </p>
      </section>

      <section className="wrap pad-sm">
        <Reveal className="playlists">
          {playlists.map((playlist) => (
            <PlaylistBlock key={playlist.slug} playlist={playlist} />
          ))}
        </Reveal>
      </section>

      <PlaylistCurators />
    </section>
  );
}
