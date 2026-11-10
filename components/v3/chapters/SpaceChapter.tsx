import Image from "next/image";
import Link from "next/link";
import { ImageSet } from "@/components/v4/ImageSet";
import { spacePage } from "@/lib/copy";
import { spaceSet } from "@/lib/v4/assets";

const [heroA, heroB, heroC, ...extras] = spaceSet;
const heroes = [
  { photo: heroA, className: "sp-photo--a", ratio: "4 / 5", priority: true },
  { photo: heroB, className: "sp-photo--b", ratio: "2 / 3", priority: false },
  { photo: heroC, className: "sp-photo--c", ratio: "3 / 4", priority: false },
];

export function SpaceChapter() {
  return (
    <section id="space" className="chapter fp sp">
      <header className="fp-head" id="space-head" tabIndex={-1}>
        <div className="fp-in">
          <span className="lbl">{spacePage.label}</span>
          <h1 className="fp-display">
            {spacePage.display.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          <p className="fp-lead">{spacePage.intro}</p>
        </div>
      </header>

      <section className="fp-section fp-channels" aria-label="the space">
        <div className="fp-in">
          <div className="sp-head">
            <span className="lbl">{spacePage.head.left}</span>
            <span className="lbl">{spacePage.head.right}</span>
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

      <section className="fp-section sp-photos" aria-label={spacePage.photos.label}>
        <div className="fp-in">
          <div className="sp-grid">
            {heroes.map(({ photo, className, ratio, priority }) => (
              <figure
                key={photo.id}
                className={`sp-photo ${className}`}
                style={{ aspectRatio: ratio }}
              >
                <Image
                  src={photo.path}
                  alt={photo.alt ?? ""}
                  fill
                  sizes="(max-width: 899px) 100vw, 50vw"
                  priority={priority}
                />
              </figure>
            ))}
          </div>
          <ImageSet
            items={extras}
            label={spacePage.photos.setLabel}
            className="sp-set"
          />
        </div>
      </section>

      <section className="fp-section sp-links" aria-label="continue">
        <div className="fp-in sp-links__row">
          {spacePage.links.map((link) => (
            <Link key={link.href} className="tlink" href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
      </section>
    </section>
  );
}
