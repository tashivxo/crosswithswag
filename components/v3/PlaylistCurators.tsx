import { Reveal } from "@/components/v3/Reveal";
import { playlistsPage } from "@/lib/copy";
import { playlists } from "@/lib/playlists";

export function PlaylistCurators() {
  return (
    <section className="wrap pad-sm playlist-curators-section">
      <div className="playlist-curators-head">
        <span className="lbl">{playlistsPage.curators.label}</span>
      </div>

      <Reveal className="playlist-curators">
        {playlists.map((playlist) => (
          <div key={playlist.slug} className="playlist-curator-row">
            <span className="playlist-curator-name voice">{playlist.title}</span>
            <span className="playlist-curator-handles">
              {playlist.curators.map((curator, index) => (
                <span key={curator.handle} className="playlist-curator-pair">
                  {index > 0 ? (
                    <span className="playlist-curator-sep" aria-hidden="true">
                      /
                    </span>
                  ) : null}
                  <a
                    className="playlist-curator-link"
                    href={curator.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {curator.handle}
                  </a>
                </span>
              ))}
            </span>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
