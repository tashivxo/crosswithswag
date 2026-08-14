import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/v3/Reveal";
import { Ticker } from "@/components/v3/Ticker";
import { ImageGrid } from "@/components/v3/ImageGrid";
import { EditionRow } from "@/components/v3/EditionRow";
import { WaitlistForm } from "@/components/v3/WaitlistForm";
import { home } from "@/lib/copy";
import { campaignArtboards, editions } from "@/lib/editions";

export function HomeChapter() {
  const previewEditions = editions.slice(0, 4);

  return (
    <section id="home" className="chapter">
      <div className="wrap hero">
        <div>
          <div className="hero-top">
            <span className="lbl lbl--sand">{home.editionLabel}</span>
            <span className="lbl">{home.est}</span>
          </div>
          <h1 className="hero-mark">
            {home.heroDisplay.map((line) => (
              <span key={line}>
                {line}
                <br />
              </span>
            ))}
          </h1>
        </div>
        <div className="hero-bottom">
          <div>
            <span className="lbl lbl--clay">{home.wearableLabel}</span>
            <p className="body-copy voice" style={{ marginTop: 16 }}>
              {home.intro}
            </p>
          </div>
          <div>
            <div className="cta-row">
              <Link className="btn btn--clay" href="#current">
                the current edition
              </Link>
              <Link className="btn" href="#archive">the archive</Link>
            </div>
          </div>
        </div>
      </div>

      <Ticker />

      <section className="wrap pad">
        <Reveal className="sect-head">
          <span className="lbl">[ 01 — current edition ]</span>
          <Link className="lbl lbl--clay" href="#current">view the edition →</Link>
        </Reveal>
        <Reveal className="feature">
          <div className="frame">
            <Image
              src="/assets/winter-drop/Artboard1.jpg"
              alt="kloofstreetnights campaign photography"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <span className="tag">edition 001 — after hours</span>
          </div>
          <div>
            <h2 className="sect voice" style={{ textTransform: "lowercase" }}>
              {home.currentEdition.title}
            </h2>
            <div className="body-copy voice" style={{ marginTop: 24 }}>
              {home.currentEdition.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <div className="cta-row">
              <Link className="btn btn--clay" href="#current">enter the edition</Link>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="wrap pad-sm">
        <Reveal className="sect-head">
          <span className="lbl">[ 02 — the structure ]</span>
          <span className="lbl">three objects — one thought</span>
        </Reveal>
        <Reveal className="objs">
          {home.structure.map((item) => (
            <div key={item.numeral} className="obj">
              <span className="lbl lbl--clay">{item.numeral}</span>
              <div>
                <h3>{item.title}</h3>
                <p className="voice" style={{ marginTop: 12 }}>{item.body}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="wrap owe">
        <span className="lbl">[ 03 — the manifesto ]</span>
        <Reveal>
          <h2 className="owe-mark" style={{ marginTop: 20 }}>
            {home.manifestoTeaser.display.map((line) => (
              <span key={line}>
                {line}
                <br />
              </span>
            ))}
          </h2>
        </Reveal>
        {home.manifestoTeaser.lines.map((line) => (
          <Reveal key={line}>
            <p className="owe-body">
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
        <Reveal className="cta-row" style={{ marginTop: "clamp(40px, 6vw, 80px)" }}>
          <Link className="btn btn--clay" href="#manifesto">read the manifesto</Link>
        </Reveal>
      </section>

      <section className="wrap pad">
        <Reveal className="feature" style={{ alignItems: "start" }}>
          <div>
            <span className="lbl">[ 04 — authority ]</span>
            <h2 className="sect" style={{ marginTop: 18 }}>
              WHAT IS
              <br />
              SWAG?
            </h2>
            <p className="body-copy" style={{ marginTop: 24 }}>
              {home.whatIsSwag.intro}
            </p>
          </div>
          <ul className="dense">
            {home.whatIsSwag.dense.map((item, index) => (
              <li key={item} data-n={String(index + 1).padStart(2, "0")}>
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section className="wrap pad-sm">
        <Reveal className="sect-head">
          <span className="lbl">[ 05 — the clothes ]</span>
          <Link className="lbl lbl--clay" href="#current">kloofstreetnights →</Link>
        </Reveal>
        <Reveal>
          <ImageGrid artboards={campaignArtboards.slice(0, 8)} />
        </Reveal>
      </section>

      <section className="wrap pad">
        <Reveal className="sect-head">
          <span className="lbl">[ 06 — the archive ]</span>
          <Link className="lbl lbl--clay" href="#archive">all editions →</Link>
        </Reveal>
        <Reveal style={{ maxWidth: "66ch" }}>
          <h2 className="sect">
            EVERY EDITION
            <br />
            CLOSES.
          </h2>
          <div className="body-copy voice" style={{ marginTop: 24 }}>
            {home.archiveTeaser.body.map((line) => <p key={line}>{line}</p>)}
          </div>
        </Reveal>
        <Reveal className="arch" style={{ marginTop: 52 }}>
          {previewEditions.map((edition) => (
            <EditionRow
              key={edition.no}
              edition={edition}
              href={edition.no === "001" ? "#current" : "#archive"}
            />
          ))}
        </Reveal>
      </section>

      <section className="wrap pad" style={{ borderTop: "1px solid var(--line)" }}>
        <Reveal className="join">
          <div>
            <span className="lbl">[ 07 — the list ]</span>
            <h2 className="sect" style={{ marginTop: 18 }}>
              {home.waitlist.title.map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
            </h2>
          </div>
          <div>
            <p className="body-copy voice">{home.waitlist.body}</p>
            <WaitlistForm note={home.waitlist.note} />
          </div>
        </Reveal>
      </section>

      <section className="closer">
        <div className="wrap">
          <span className="lbl">{home.closer.label}</span>
          <Reveal className="big" style={{ marginTop: 26 }}>
            {home.closer.display.map((line) => (
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
