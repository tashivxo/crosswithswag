import Image from "next/image";
import Link from "next/link";
import { ImageSet } from "@/components/v4/ImageSet";
import { archive } from "@/lib/copy";
import { archiveExtraPhotos, archiveGalleryFrames } from "@/lib/v4/assets";
import type { AssetSlot } from "@/lib/v4/assets";

function Frame({ slot, priority }: { slot: AssetSlot; priority?: boolean }) {
  return (
    <figure className={`ar-frame ar-frame--${slot.frame}`}>
      <Image
        src={slot.path}
        alt={slot.alt ?? ""}
        fill
        sizes={
          slot.frame === "wide" || slot.frame === "hero"
            ? "100vw"
            : "(max-width: 899px) 100vw, 50vw"
        }
        style={{ objectPosition: slot.focus }}
        priority={priority}
      />
    </figure>
  );
}

function Head({ left, right }: { left: string; right: string }) {
  return (
    <div className="mf-head">
      <span className="lbl">{left}</span>
      <span className="lbl">{right}</span>
    </div>
  );
}

const rowsOf = (kind: string[], from: number) =>
  kind.map((_, i) => archiveGalleryFrames[from + i]);

export function ArchiveChapter() {
  const g = archiveGalleryFrames;
  return (
    <section id="archive" className="chapter fp ar">
      <header className="fp-head" id="archive-head" tabIndex={-1}>
        <div className="fp-in">
          <div className="mf-head ar-label">
            <span className="lbl ar-label__now">{archive.label}</span>
            <span className="lbl">{archive.labelRight}</span>
          </div>
          <h1 className="ar-display">{archive.display}</h1>
        </div>
      </header>

      <section className="ar-index" aria-labelledby="ar-index-title">
        <div className="fp-in">
          <Head left={archive.index.head.left} right={archive.index.head.right} />
          <h2 id="ar-index-title" className="sr-only">
            the editions
          </h2>
          <ol className="ar-rows">
            {archive.index.rows.map((row) => {
              const inner = (
                <>
                  <span className="ar-row__num">{row.number}</span>
                  <span className="ar-row__name">{row.name}</span>
                  <span className="ar-row__desc">{row.desc}</span>
                  <span className="ar-row__line" aria-hidden="true" />
                  <span className="ar-row__state">{row.state}</span>
                </>
              );
              return (
                <li
                  key={row.number}
                  className="ar-row"
                  data-current={row.current ? "" : undefined}
                >
                  {row.href ? (
                    <Link className="ar-row__link" href={row.href}>
                      {inner}
                    </Link>
                  ) : (
                    <div className="ar-row__link">{inner}</div>
                  )}
                </li>
              );
            })}
          </ol>
          <p className="ar-note">{archive.index.note}</p>
        </div>
      </section>

      <section
        id="edition-001"
        className="ar-record"
        aria-labelledby="ar-record-title"
      >
        <div className="fp-in">
          <Head left={archive.record.head.left} right={archive.record.head.right} />
          <h2 id="ar-record-title" className="ar-title">
            {archive.record.title}
          </h2>
          <div className="fp-split ar-record__split">
            <p className="fp-lead">{archive.record.thesis}</p>
            <dl className="ar-table">
              {archive.record.table.map((entry) => (
                <div key={entry.label} className="ar-table__row">
                  <dt>{entry.label}</dt>
                  <dd>{entry.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="ar-gallery" aria-label="edition 001 gallery">
        <div className="fp-in ar-gallery__head">
          <Head left={archive.gallery.head.left} right={archive.gallery.head.right} />
        </div>
        <div className="ar-rows-gallery">
          <div className="ar-row-g ar-row-g--full">
            <Frame slot={g[0]} priority />
          </div>
          <div className="ar-row-g ar-row-g--pair">
            {rowsOf(["a", "b"], 1).map((slot) => (
              <Frame key={slot.id} slot={slot} />
            ))}
          </div>
          <div className="ar-row-g ar-row-g--trio fp-in">
            {rowsOf(["a", "b", "c"], 3).map((slot) => (
              <Frame key={slot.id} slot={slot} />
            ))}
          </div>
          <div className="ar-row-g ar-row-g--wide-tall fp-in">
            {rowsOf(["a", "b"], 6).map((slot) => (
              <Frame key={slot.id} slot={slot} />
            ))}
          </div>
          <div className="ar-row-g ar-row-g--full">
            <Frame slot={g[8]} />
          </div>
          <div className="ar-row-g ar-row-g--pair">
            {rowsOf(["a", "b"], 9).map((slot) => (
              <Frame key={slot.id} slot={slot} />
            ))}
          </div>
          <div className="ar-row-g ar-row-g--full">
            <Frame slot={g[11]} />
          </div>
        </div>
        <div className="fp-in ar-gallery__set">
          <ImageSet
            items={archiveExtraPhotos}
            label={archive.gallery.setLabel}
            ratio="2 / 3"
          />
        </div>
      </section>

      <section className="ar-director" aria-label="director note">
        <div className="fp-in">
          <div className="mf-sign fp-sign ar-sign">
            <span className="lbl">{archive.director.label}</span>
            <p className="fp-lead">{archive.director.body}</p>
            <div className="fp-signoff">
              <span>{archive.director.signOff}</span>
              <span>{archive.director.edition}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="fp-section ar-cta" aria-label="shop">
        <div className="fp-in ar-cta__row">
          <p className="fp-lead">{archive.cta.body}</p>
          <Link className="tlink" href={archive.cta.href}>
            {archive.cta.link}
          </Link>
        </div>
      </section>
    </section>
  );
}
