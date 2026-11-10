import Image from "next/image";
import { ImageSet } from "@/components/v4/ImageSet";
import { manifesto } from "@/lib/copy";
import { manifestoPhotos } from "@/lib/v4/assets";

function Lines({ lines }: { lines: string[] }) {
  return (
    <ul className="mf-dense">
      {lines.map((line) => (
        <li key={line}>{line}</li>
      ))}
    </ul>
  );
}

export function ManifestoChapter() {
  return (
    <section id="manifesto" className="chapter fp mf">
      <div
        className="mf-backdrop"
        aria-hidden="true"
        style={{ backgroundImage: `url(${manifestoPhotos.backdrop.path})` }}
      />
      <h1 className="sr-only">the manifesto</h1>

      <section className="mf-sec mf-sec--first" aria-labelledby="mf-home">
        <div className="fp-in">
          <div className="mf-head">
            <span id="mf-home" className="lbl">
              [ a home for individuals ]
            </span>
            <span className="lbl">{manifesto.homeForIndividuals.label}</span>
          </div>
          <Lines lines={manifesto.homeForIndividuals.dense} />
          <p className="mf-closing">{manifesto.homeForIndividuals.closing}</p>
        </div>
      </section>

      <section className="mf-sec mf-wound" aria-label="the wound">
        <div className="fp-in mf-wound__grid">
          <div className="mf-wound__left">
            <div className="mf-sign">
              <div className="mf-prose">
                {manifesto.wound.lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              <div className="mf-signoff">
                <span>{manifesto.wound.signOff}</span>
                <span>{manifesto.wound.edition}</span>
              </div>
            </div>
            <ImageSet
              items={[manifestoPhotos.alternate]}
              label="the other frame from the set"
              ratio="2 / 3"
              className="mf-set"
            />
          </div>
          <figure className="mf-frame">
            <Image
              src={manifestoPhotos.frame.path}
              alt={manifestoPhotos.frame.alt ?? ""}
              fill
              sizes="(max-width: 899px) 100vw, 560px"
              priority
            />
            <figcaption className="mf-frame__tag">
              [ {manifesto.wound.imageTag} ]
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="mf-sec" aria-labelledby="mf-auth-title">
        <div className="fp-in">
          <div className="mf-head">
            <span className="lbl">[ authentic expression ]</span>
            <span className="lbl">what is swag?</span>
          </div>
          <div className="fp-split mf-split">
            <h2 id="mf-auth-title" className="fp-h2">
              {manifesto.authenticExpression.display.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>
            <div className="mf-prose">
              {manifesto.authenticExpression.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mf-sec mf-sec--open" aria-label="authority">
        <div className="fp-in">
          <div className="mf-head">
            <span className="lbl">[ authority ]</span>
            <span className="lbl">the daily practice</span>
          </div>
          <Lines lines={manifesto.authority.dense} />
          <p className="mf-closing">{manifesto.authority.closing}</p>
        </div>
      </section>

      <section className="mf-sec mf-full" aria-label="the full manifesto">
        <div className="fp-in">
          <span className="lbl">{manifesto.full.label}</span>
          <div className="mf-prose mf-prose--full">
            {manifesto.full.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="mf-sec mf-closer" aria-label="the wearer">
        <div className="fp-in">
          <span className="lbl">{manifesto.closer.label}</span>
          <p className="mf-closer__display" aria-label="silent warrior">
            {manifesto.closer.display.map((line) => (
              <span key={line} aria-hidden="true">
                {line}
              </span>
            ))}
          </p>
        </div>
      </section>
    </section>
  );
}
