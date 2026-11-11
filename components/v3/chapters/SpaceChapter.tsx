import Link from "next/link";
import { EditionRow } from "@/components/v3/EditionRow";
import { ImageGrid } from "@/components/v3/ImageGrid";
import { Reveal } from "@/components/v3/Reveal";
import { Ticker } from "@/components/v3/Ticker";
import { WaitlistForm } from "@/components/v3/WaitlistForm";
import { spacePage } from "@/lib/copy";
import { clothesArtboards } from "@/lib/editions";
import type { Edition } from "@/lib/editions";
import { manifestoPhotos } from "@/lib/v4/assets";
import { SpacePlaylistGate } from "@/components/v4/SpacePlaylistGate";

const emphasizedWords = /(\bowe nothing\b|\bstop explaining\b|\bstop convincing\b|\bstart being\b)/gi;
const emphasizedWordTest = /(\bowe nothing\b|\bstop explaining\b|\bstop convincing\b|\bstart being\b)/i;

function ManifestoLine({ line }: { line: string }) {
  return (
    <p>
      {line.split(emphasizedWords).map((part, index) =>
        emphasizedWordTest.test(part) ? (
          <span key={`${part}-${index}`} className="space-manifesto__emphasis">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </p>
  );
}

function toEdition(row: (typeof spacePage.archive.rows)[number]): Edition {
  return {
    no: row.number,
    slug: row.name.toLowerCase().replace(/\s+/g, "-"),
    name: row.name,
    description: row.desc,
    state: row.state === "CLOSED" ? "closed" : "in-development",
  };
}

export function SpaceChapter() {
  return (
    <section id="space" className="chapter fp space-gallery-home">
      <SpacePlaylistGate />
      <header className="fp-head" id="space-head" tabIndex={-1}>
        <div className="fp-in">
          <div className="space-hero__meta">
            <span className="lbl">{spacePage.hero.editionLabel}</span>
            <span className="lbl">{spacePage.hero.est}</span>
          </div>
          <h1 className="space-hero__display">
            {spacePage.hero.display.map((line) => (
              <span key={line} className={line === "WITH" ? "space-hero__clay" : undefined}>
                {line}
              </span>
            ))}
          </h1>
          <div className="space-hero__bottom">
            <div>
              <span className="lbl lbl--clay">{spacePage.hero.wearableLabel}</span>
              <p className="fp-lead">{spacePage.hero.intro}</p>
            </div>
            <div className="space-hero__links">
              {spacePage.hero.links.map((link) => (
                <Link key={link.href} className="tlink" href={link.href}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>

      <Ticker items={spacePage.ticker} />

      <section className="fp-section space-section space-standard" aria-labelledby="space-standard-title">
        <div className="fp-in">
          <div className="space-section__head">
            <span className="lbl">{spacePage.standard.label}</span>
            <Link className="lbl lbl--clay" href="/#shop">
              {spacePage.standard.shop}
            </Link>
          </div>
          <div className="space-standard__feature">
            <div className="space-logo-grid" aria-label="standard edition logo tiles">
              {/* Cavendish placeholder: replace these four logo tiles when the shoot hero arrives. */}
              {spacePage.standard.tiles.map((tile) => (
                <div className="space-logo-tile" key={tile.src}>
                  {/* SVG lockups — next/image does not optimize SVG. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={tile.src} alt={tile.alt} />
                </div>
              ))}
            </div>
            <div className="space-standard__copy">
              <h2 id="space-standard-title">{spacePage.standard.title}</h2>
              <p className="fp-lead">{spacePage.standard.body}</p>
              <Link className="tlink" href="/#shop">
                {spacePage.standard.range}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="fp-section space-section space-objects" aria-labelledby="space-objects-title">
        <div className="fp-in">
          <div className="space-section__head">
            <span id="space-objects-title" className="lbl">{spacePage.space.label}</span>
            <span className="lbl">{spacePage.space.right}</span>
          </div>
          <ul className="fp-cards">
            {spacePage.objects.map((object) => (
              <li key={object.numeral} className="fp-card fp-card--object">
                <span className="lbl lbl--clay">{object.numeral}</span>
                <h2 className="fp-card__title">{object.title}</h2>
                <p className="fp-card__body">{object.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="fp-section space-section space-editions" aria-labelledby="space-editions-title">
        <div className="fp-in">
          <div className="space-section__head">
            <span className="lbl">{spacePage.editions.label}</span>
            <span className="lbl">{spacePage.editions.right}</span>
          </div>
          <div className="space-editions__grid">
            {spacePage.editions.objects.map((object) => (
              <article key={object.numeral} className="space-edition-object">
                <span className="lbl lbl--clay">{object.numeral}</span>
                <h2 id={object.numeral === "[ i ]" ? "space-editions-title" : undefined}>{object.title}</h2>
                <p className="voice">{object.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="space-photo space-manifesto" aria-labelledby="space-manifesto-title">
        <div
          className="space-photo__backdrop"
          aria-hidden="true"
          style={{ backgroundImage: `url(${manifestoPhotos.backdrop.path})` }}
        />
        <div className="fp-in space-photo__content">
          <span className="lbl">{spacePage.manifesto.label}</span>
          <Reveal>
            <h2 id="space-manifesto-title" className="space-photo__display">
              {spacePage.manifesto.display.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>
          </Reveal>
          <div className="space-manifesto__body">
            {spacePage.manifesto.lines.map((line) => (
              <Reveal key={line}>
                <ManifestoLine line={line} />
              </Reveal>
            ))}
          </div>
          <Link className="tlink" href="/manifesto">
            {spacePage.manifesto.cta}
          </Link>
        </div>
      </section>

      <section className="fp-section space-section space-authority" aria-labelledby="space-authority-title">
        <div className="fp-in">
          <div className="space-section__head">
            <span className="lbl">{spacePage.authority.label}</span>
          </div>
          <div className="fp-split">
            <h2 id="space-authority-title" className="fp-h2">
              {spacePage.authority.display.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>
            <div>
              <p className="fp-lead">{spacePage.authority.intro}</p>
              <ul className="dense space-authority__dense">
                {spacePage.authority.dense.map((item, index) => (
                  <li key={item} data-n={String(index + 1).padStart(2, "0")}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="fp-section space-section space-archive-grid" aria-labelledby="space-archive-grid-title">
        <div className="fp-in">
          <div className="space-section__head">
            <span id="space-archive-grid-title" className="lbl">{spacePage.archive.label}</span>
            <Link className="lbl lbl--clay" href="/archive">
              {spacePage.archive.cta}
            </Link>
          </div>
          <Link className="space-archive-grid__link" href="/archive" aria-label="Enter the archive gallery">
            <span aria-hidden="true">
              <ImageGrid artboards={clothesArtboards} />
            </span>
          </Link>
        </div>
      </section>

      <section className="space-photo-group">
        <div
          className="space-photo-group__backdrop"
          aria-hidden="true"
          style={{ backgroundImage: `url(${manifestoPhotos.backdrop.path})` }}
        />
        <section className="space-section space-edition-index" aria-labelledby="space-edition-index-title">
          <div className="fp-in">
            <div className="space-section__head">
              <span className="lbl">{spacePage.archive.editionsLabel}</span>
              <Link className="lbl lbl--clay" href="/archive">
                {spacePage.archive.editionsCta}
              </Link>
            </div>
            <Reveal>
              <h2 id="space-edition-index-title" className="space-photo__display">
                {spacePage.archive.display.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h2>
            </Reveal>
            <p className="space-edition-index__body">{spacePage.archive.body}</p>
            <div className="arch">
              {spacePage.archive.rows.map((row) => (
                <EditionRow
                  key={row.number}
                  edition={toEdition(row)}
                  href={row.number === "001" ? "/archive#edition-001" : row.number === "002" ? "/current" : undefined}
                />
              ))}
            </div>
            <p className="note voice">{spacePage.archive.note}</p>
          </div>
        </section>

        <section className="space-section space-list" aria-labelledby="space-list-title">
          <div className="fp-in">
            <div className="space-section__head">
              <span className="lbl">{spacePage.list.label}</span>
            </div>
            <div className="fp-split">
              <h2 id="space-list-title" className="space-photo__display">
                {spacePage.list.title.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h2>
              <div>
                <p className="fp-lead">{spacePage.list.body}</p>
                <WaitlistForm note={spacePage.list.note} />
              </div>
            </div>
          </div>
        </section>

        <section className="space-closer" aria-label="closer">
          <div className="fp-in">
            <span className="lbl">{spacePage.closer.label}</span>
            <p className="space-closer__display" aria-label="cross with swag">
              {spacePage.closer.display.map((line) => (
                <span key={line} className={line === "WITH" ? "space-hero__clay" : undefined}>
                  {line}
                </span>
              ))}
            </p>
          </div>
        </section>
      </section>
    </section>
  );
}
