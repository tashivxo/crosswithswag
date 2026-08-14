import { Reveal } from "@/components/v3/Reveal";
import { ImageGrid } from "@/components/v3/ImageGrid";
import { current } from "@/lib/copy";
import { campaignArtboards, currentEdition } from "@/lib/editions";
import { site } from "@/lib/copy";

export function CurrentChapter() {
  const colourways = currentEdition.colourways ?? [];

  return (
    <section id="current" className="chapter">
      <section className="wrap page-head">
        <div className="hero-top" style={{ paddingBottom: 26 }}>
          <span className="lbl lbl--sand">{current.editionLabel}</span>
          <span className="state state--live">live</span>
        </div>
        <h2 className="display voice" style={{ textTransform: "lowercase" }}>
          {current.title}
        </h2>
        <div className="hero-bottom" style={{ borderTop: 0, paddingTop: 34 }}>
          <div className="body-copy voice">
            {current.lines.map((line) => <p key={line}>{line}</p>)}
          </div>
          <div>
            <span className="lbl">[ intake ]</span>
            <p className="body-copy voice" style={{ marginTop: 12 }}>
              {current.intake}
            </p>
            <div className="cta-row">
              <a
                className="btn btn--clay"
                href={`mailto:${site.email}?subject=${current.orderSubject}`}
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
          <ImageGrid artboards={[1, 2, 3]} columns={3} />
        </Reveal>
      </section>

      <section className="wrap pad-sm">
        <Reveal className="sect-head">
          <span className="lbl">[ 02 — colourways ]</span>
          <span className="lbl">one continuous night</span>
        </Reveal>
        <Reveal className="cways">
          {colourways.map((colourway) => (
            <div key={colourway.name} className="cw">
              <div
                className={[
                  "chip",
                  colourway.unnamed ? "chip--unnamed" : undefined,
                  colourway.hex === "#0A0A0A" ? "chip--void" : undefined,
                ]
                  .filter(Boolean)
                  .join(" ")}
                style={
                  colourway.hex && !colourway.unnamed
                    ? { background: colourway.hex }
                    : undefined
                }
              />
              <div className="meta">
                <h4>{colourway.name}</h4>
                <div className="hex">
                  {colourway.hex ?? "hex tbc"}
                </div>
              </div>
            </div>
          ))}
        </Reveal>
        <p className="note voice" style={{ marginTop: 16 }}>
          {current.colourwayNote}
        </p>
      </section>

      <section className="wrap pad-sm">
        <Reveal className="feature" style={{ alignItems: "start" }}>
          <div>
            <span className="lbl">[ 03 — specification ]</span>
            <h2 className="sect" style={{ marginTop: 18 }}>
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
          <span className="lbl">kloofstreetnights</span>
        </Reveal>
        <Reveal>
          <ImageGrid artboards={campaignArtboards} />
        </Reveal>
      </section>

      <section className="wrap pad">
        <Reveal className="sig" style={{ maxWidth: "70ch" }}>
          <span className="lbl">[ a message from the director ]</span>
          <div className="body-copy voice" style={{ marginTop: 20 }}>
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
