import { Reveal } from "@/components/v3/Reveal";
import { EditionRow } from "@/components/v3/EditionRow";
import { archive } from "@/lib/copy";
import { editions } from "@/lib/editions";

export function ArchiveChapter() {
  return (
    <section id="archive" className="chapter">
      <section className="wrap page-head">
        <span className="lbl">[ the archive ]</span>
        <h2 className="display" style={{ marginTop: 18 }}>
          {archive.display.map((line) => (
            <span key={line}>
              {line}
              <br />
            </span>
          ))}
        </h2>
        <p className="body-copy voice" style={{ marginTop: 30 }}>
          {archive.intro}
        </p>
      </section>

      <section className="wrap pad-sm">
        <Reveal className="arch">
          {editions.map((edition) => (
            <EditionRow
              key={edition.no}
              edition={edition}
              href={edition.no === "001" ? "#current" : undefined}
            />
          ))}
        </Reveal>
        <p className="note voice" style={{ marginTop: 22 }}>
          {archive.note}
        </p>
      </section>

      <section className="wrap pad-sm">
        <Reveal className="objs">
          {archive.rules.map((rule) => (
            <div key={rule.numeral} className="obj">
              <span className="lbl lbl--clay">{rule.numeral}</span>
              <div>
                <h3>{rule.title}</h3>
                <p className="voice" style={{ marginTop: 12 }}>{rule.body}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </section>
    </section>
  );
}
