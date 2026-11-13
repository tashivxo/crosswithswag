import { PlaylistRow } from "@/components/fallback/PlaylistRow";
import { SmoothScrollLink } from "@/components/fallback/SmoothScrollLink";
import { WhatsAppButton } from "@/components/fallback/WhatsAppButton";
import { copy, fallbackPlaylists } from "@/lib/fallback";

export function FallbackPage() {
  return (
    <main className="fb">
      <section className="fb-screen fb-notice" aria-labelledby="fb-h1">
        <header className="fb-top">
          <span className="fb-wordmark">swag.</span>
          <span className="fb-label fb-clay">{copy.notice}</span>
        </header>
        <h1 id="fb-h1" className="fb-h1">
          {copy.headline[0]}
          <br />
          {copy.headline[1]}
        </h1>
        <div className="fb-notice-grid">
          <div>
            <p className="fb-body">{copy.body}</p>
            <SmoothScrollLink targetId="playlists">{copy.waitLink}</SmoothScrollLink>
          </div>
          <div className="fb-store">
            <h2 className="fb-label">{copy.storeLabel}</h2>
            <ol className="fb-steps">
              {copy.steps.map((step, i) => (
                <li key={step}>
                  <span className="fb-label">0{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
            <WhatsAppButton />
            <p className="fb-note">{copy.storeNote}</p>
          </div>
        </div>
        <footer className="fb-foot fb-label">
          <span>{copy.footerLeft}</span>
          <span>{copy.footerRight}</span>
        </footer>
      </section>

      <section
        id="playlists"
        tabIndex={-1}
        className="fb-screen fb-playlists"
        aria-labelledby="fb-h2"
      >
        <p className="fb-label">{copy.playlistsLabel}</p>
        <div className="fb-pl-head">
          <h2 id="fb-h2" className="fb-h2">
            {copy.playlistsHeadline}
          </h2>
          <p className="fb-body">{copy.playlistsIntro}</p>
        </div>
        <ul className="fb-rows">
          {fallbackPlaylists.map((p) => (
            <PlaylistRow key={p.name} playlist={p} />
          ))}
        </ul>
        <div className="fb-closer">
          <p className="fb-closer-text">{copy.closer}</p>
          <WhatsAppButton />
        </div>
        <footer className="fb-foot fb-label">
          <span>{copy.footerLeft}</span>
          <span>{copy.footerRight}</span>
        </footer>
      </section>
    </main>
  );
}
