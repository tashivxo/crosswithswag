import { Reveal } from "@/components/v3/Reveal";
import { ImageGrid } from "@/components/v3/ImageGrid";
import { current } from "@/lib/copy";
import {
  campaignArtboards,
  clothesArtboards,
  currentEdition,
} from "@/lib/editions";

export function CurrentChapter() {
  const colourways = currentEdition.colourways ?? [];

  return (
    <section id="current" className="chapter">
      <section className="wrap page-head current-head">
        <div className="hero-top">
          <span className="lbl lbl--sand">{current.editionLabel}</span>
          <span className="state state--live">live</span>
        </div>
        <h1 className="display current-title voice">{current.title}</h1>
        <div className="hero-bottom current-intro">
          <div className="body-copy voice">
            {current.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <div className="current-intake">
            <span className="lbl">[ intake ]</span>
            <p className="body-copy voice current-intake__copy">{current.intake}</p>
            <div className="cta-row">
              <a
                className="btn btn--clay"
                href={current.orderUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                order this edition
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap pad-sm">
        <Reveal className="sect-head">
          <span className="lbl">[ 01 — the campaign ]</span>
          <span className="lbl">three frames</span>
        </Reveal>
        <Reveal>
          <ImageGrid artboards={campaignArtboards} variant="campaign" />
        </Reveal>
      </section>

      <section className="wrap pad-sm">
        <Reveal className="sect-head">
          <span className="lbl">[ 02 — colourways ]</span>
          <span className="lbl">one continuous night</span>
        </Reveal>
        <Reveal className="cways">
          {colourways.map((colourway) => {
            const isVoid = colourway.hex === "#0A0A0A";

            return (
              <div
                key={colourway.name}
                className={["cw", isVoid ? "cw--void" : "cw--light"]
                  .filter(Boolean)
                  .join(" ")}
              >
                <div
                  className="cw__fill"
                  style={{ background: colourway.hex ?? undefined }}
                >
                  <div className="cw__meta">
                    <h4>{colourway.name}</h4>
                    <div className="hex">{colourway.hex ?? "hex tbc"}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </Reveal>
        <p className="note voice current-colourway-note">{current.colourwayNote}</p>
      </section>

      <section className="wrap pad-sm">
        <Reveal className="feature current-spec">
          <div>
            <span className="lbl">[ 03 — specification ]</span>
            <h2 className="sect current-spec__title">
              THE
              <br />
              MAKE.
            </h2>
          </div>
          <table className="spec">
            <tbody>
              {current.spec.map((row) => (
                <tr key={row.label}>
                  <td>{row.label}</td>
                  <td className="voice">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </section>

      <section className="wrap pad-sm">
        <Reveal className="sect-head">
          <span className="lbl">[ 04 — the clothes ]</span>
          <span className="lbl">{current.clothesRightLabel}</span>
        </Reveal>
        <Reveal>
          <ImageGrid artboards={clothesArtboards} />
        </Reveal>
      </section>

      <section className="wrap pad">
        <Reveal className="sig current-sig">
          <span className="lbl">[ a message from the director ]</span>
          <div className="body-copy voice current-sig__copy">
            {current.directorNote.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <div className="sig-name voice">{current.directorNote.signOff}</div>
          <div className="sig-ed voice">{current.directorNote.edition}</div>
        </Reveal>
      </section>
    </section>
  );
}
