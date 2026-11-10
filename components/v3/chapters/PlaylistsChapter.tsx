import { WaitlistForm } from "@/components/v3/WaitlistForm";
import { playlistsPage } from "@/lib/copy";
import {
  getPlaylistEmbedUrl,
  getPlaylistPageUrl,
  isPlaylistLive,
  playlists,
} from "@/lib/playlists";

const copy = playlistsPage;

export function PlaylistsChapter() {
  return (
    <section id="playlists" className="chapter fp">
      <header className="fp-head">
        <div className="fp-in">
          <span className="lbl">{copy.label}</span>
          <h1 className="fp-display">
            {copy.display.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          <p className="fp-lead">{copy.intro}</p>
        </div>
      </header>

      <section className="fp-section fp-channels" aria-label="playlists">
        <div className="fp-in">
          <ul className="fp-cards">
            {copy.channels.map((channel) => (
              <li key={channel.slug} className="fp-card">
                <span className="lbl lbl--clay">{channel.numeral}</span>
                <h2 className="fp-card__title">
                  {channel.title.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </h2>
                <p className="fp-card__body">{channel.body}</p>
                <a className="fp-link" href={`#${channel.slug}`}>
                  {channel.jump}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {copy.channels.map((channel) => {
        const playlist = playlists.find((entry) => entry.slug === channel.slug);
        if (!playlist) return null;
        const row = copy.rows[playlist.slug];
        const pageUrl = getPlaylistPageUrl(playlist);
        return (
          <section
            key={playlist.slug}
            id={playlist.slug}
            className="fp-section fp-playlist"
            aria-labelledby={`${playlist.slug}-title`}
          >
            <div className="fp-in fp-playlist__grid">
              <div className="fp-cover" aria-hidden="true">
                <div className="fp-cover__mark">
                  <span>{row.cover[0]}</span>
                  <span className="fp-cover__with">{row.cover[1]}</span>
                  <span>{row.cover[2]}</span>
                </div>
              </div>
              <div className="fp-playlist__right">
                <span className="lbl">{row.label}</span>
                <h2 id={`${playlist.slug}-title`} className="fp-h2">
                  {row.display}
                </h2>
                <p className="fp-lead">{row.body}</p>
                <ul className="fp-tags" aria-label={`${playlist.title} genres`}>
                  {row.tags.map((tag) => (
                    <li key={tag} className="fp-tag">
                      {tag}
                    </li>
                  ))}
                </ul>
                {isPlaylistLive(playlist) ? (
                  <div className="fp-embed" data-lenis-prevent>
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
                ) : null}
                {pageUrl ? (
                  <a
                    className="fp-link"
                    href={pageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {row.open}
                  </a>
                ) : null}
              </div>
            </div>
          </section>
        );
      })}

      <section className="fp-section fp-list" aria-labelledby="fp-list-title">
        <div className="fp-in fp-split">
          <div>
            <span className="lbl">{copy.list.label}</span>
            <h2 id="fp-list-title" className="fp-h2">
              {copy.list.title.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>
          </div>
          <div>
            <p className="fp-lead">{copy.list.body}</p>
            <WaitlistForm note={copy.list.note} />
          </div>
        </div>
      </section>
    </section>
  );
}
