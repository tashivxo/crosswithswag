import Image from "next/image";
import { Reveal } from "@/components/v3/Reveal";
import { manifesto } from "@/lib/copy";

export function ManifestoChapter() {
  return (
    <section id="manifesto" className="chapter">
      <section className="wrap page-head">
        <span className="lbl">[ the manifesto ]</span>
        <h1 className="display" style={{ marginTop: 18 }}>
          {manifesto.display.map((line) => (
            <span key={line}>
              {line}
              <br />
            </span>
          ))}
        </h1>
      </section>

      <section className="wrap owe" style={{ borderTop: 0 }}>
        {manifesto.lines.map((line, index) => (
          <Reveal key={line}>
            <p className="owe-body" style={{ marginTop: index === 0 ? 0 : undefined }}>
              {line.split(/(owe nothing|stop explaining|stop convincing|start being)/i).map((part, i) =>
                /owe nothing|stop explaining|stop convincing|start being/i.test(part)
                  ? <b key={i}>{part}</b>
                  : part,
              )}
            </p>
          </Reveal>
        ))}
        <div className="owe-split">
          <Reveal className="orb">
            <p>
              <b>swag.</b> is not a performance; it is the radical act of refusing to fragment yourself.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="wrap pad-sm" style={{ borderTop: "1px solid var(--line)" }}>
        <Reveal className="sect-head">
          <span className="lbl">[ a home for individuals ]</span>
          <span className="lbl">{manifesto.homeForIndividuals.label}</span>
        </Reveal>
        <Reveal>
          <ul className="dense" style={{ maxWidth: "22ch" }}>
            {manifesto.homeForIndividuals.dense.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Reveal>
        <Reveal>
          <p className="body-copy" style={{ marginTop: 34 }}>
            {manifesto.homeForIndividuals.closing}
          </p>
        </Reveal>
      </section>

      <section className="wrap pad">
        <Reveal className="feature" style={{ alignItems: "start" }}>
          <div className="sig">
            <div className="body-copy voice">
              {manifesto.wound.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <div className="sig-name voice">{manifesto.wound.signOff}</div>
            <div className="sig-ed voice">{manifesto.wound.edition}</div>
          </div>
          <div className="frame frame--sq">
            <Image
              src="/assets/winter-drop/Artboard3.jpg"
              alt="kloofstreetnights campaign photography"
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
            />
            <span className="tag">{manifesto.wound.imageTag}</span>
          </div>
        </Reveal>
      </section>

      <section className="wrap pad-sm">
        <Reveal className="sect-head">
          <span className="lbl">[ authentic expression ]</span>
          <span className="lbl">what is swag?</span>
        </Reveal>
        <Reveal className="feature" style={{ alignItems: "start" }}>
          <h2 className="sect">
            {manifesto.authenticExpression.display.map((line) => (
              <span key={line}>
                {line}
                <br />
              </span>
            ))}
          </h2>
          <div className="body-copy voice">
            {manifesto.authenticExpression.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="wrap pad-sm">
        <Reveal className="sect-head">
          <span className="lbl">[ authority ]</span>
          <span className="lbl">the daily practice</span>
        </Reveal>
        <Reveal>
          <ul className="dense">
            {manifesto.authority.dense.map((item, index) => (
              <li key={item} data-n={String(index + 1).padStart(2, "0")}>
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal>
          <p className="body-copy" style={{ marginTop: 34 }}>
            {manifesto.authority.closing}
          </p>
        </Reveal>
      </section>

      <section className="closer">
        <div className="wrap">
          <span className="lbl">{manifesto.closer.label}</span>
          <Reveal className="big" style={{ marginTop: 26 }}>
            {manifesto.closer.display.map((line) => (
              <span key={line}>
                {line}
                <br />
              </span>
            ))}
          </Reveal>
        </div>
      </section>
    </section>
  );
}
