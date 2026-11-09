import type { CSSProperties } from "react";
import Link from "next/link";
import { Reveal } from "@/components/v3/Reveal";
import { Ticker } from "@/components/v3/Ticker";
import { WaitlistForm } from "@/components/v3/WaitlistForm";
import { CampaignFrame, ImageGrid } from "@/components/v3/ImageGrid";
import { EditionRow } from "@/components/v3/EditionRow";
import { ComingSoonChapter } from "@/components/v3/chapters/ComingSoonChapter";
import { comingSoonEnabled } from "@/lib/coming-soon";
import { home } from "@/lib/copy";
import { clothesArtboards, editions } from "@/lib/editions";
import { chapterById } from "@/lib/sections.config";
import { ShopChapter } from "@/components/v3/chapters/ShopChapter";
import { ShopAnchor } from "@/components/v3/ShopAnchor";
import { Wordmark } from "@/components/ui/Wordmark";

const homeChapter = chapterById("home");
const currentPath = "/#shop";
const archivePath = chapterById("archive").path;
const manifestoPath = chapterById("manifesto").path;
const [crossLine, withLine, swagLine] = home.heroMark;

export function HomeChapter({
  variant = "shop",
}: {
  variant?: "shop" | "space";
}) {
  const isShop = variant === "shop";
  const comingSoon = isShop && comingSoonEnabled();
  return (
    <>
      {!isShop && (
        <section
          id="space-head"
          className="wrap page-head space-head"
          tabIndex={-1}
        >
          <div className="hero-top">
            <span className="lbl lbl--sand">[ the space ]</span>
            <span className="lbl">{home.est}</span>
          </div>
          <h1 className="hero-mark">
            <span>
              {crossLine.text}
              <br />
            </span>
            <span className="hero-mark__lockup">
              <span className={withLine.clay ? "hero-mark__clay" : undefined}>
                {withLine.text}
              </span>{" "}
              {swagLine.text}
            </span>
          </h1>
          <div className="hero-bottom">
            <div>
              <span className="lbl lbl--clay">{home.wearableLabel}</span>
              <p className="body-copy voice" style={{ marginTop: 16 }}>
                {home.intro}
              </p>
            </div>
            <div className="cta-row">
              <Link className="btn btn--clay" href="/#shop">
                the standard edition
              </Link>
              <Link className="btn" href={archivePath}>
                the archive
              </Link>
            </div>
          </div>
        </section>
      )}
      {isShop && (
      <section
        id="home"
        className="chapter section-shell hero-section"
        style={
          {
            "--section-bg": homeChapter.background,
            "--section-fg": homeChapter.foreground,
          } as CSSProperties
        }
      >
        {comingSoon ? (
          <ComingSoonChapter id="home-intro" />
        ) : (
          /* Figma 21:277: the mark sits in the first viewport; the header mark is already docked, so there is no #home-intro scroll spacer. */
          <div className="landing-hero">
            <div id="home-hero" className="landing-hero__body" tabIndex={-1}>
              <h1 className="sr-only">swag.</h1>
              <div className="landing-hero__stage">
                <div className="landing-mark" aria-hidden="true">
                  <Wordmark />
                </div>
                <div className="landing-hero__below">
                  <span className="lbl lbl--clay">
                    standard edition — drops 13.11
                  </span>
                  <div className="landing-cta">
                    <ShopAnchor className="tlink tlink--clay">
                      shop the standard edition ↓
                    </ShopAnchor>
                    <Link className="tlink" href="/space">
                      enter the site →
                    </Link>
                  </div>
                </div>
              </div>
              <div className="landing-hero__meta">
                <span className="lbl">{home.est}</span>
                <span className="lbl">wearable editions + a space</span>
              </div>
            </div>
          </div>
        )}
      </section>
      )}

      {!isShop && <Ticker />}

      {isShop ? (
        <ShopChapter />
      ) : (
      <>
      <section className="wrap pad">
        <Reveal className="sect-head">
          <span className="lbl">[ 01 — current edition ]</span>
          <Link className="lbl lbl--clay" href={currentPath}>
            view the edition →
          </Link>
        </Reveal>
        <Reveal className="feature">
          <CampaignFrame
            artboard={1}
            editionName={home.currentEdition.title}
            tag="edition 001 — after hours"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
          <div>
            <h2 className="sect" style={{ textTransform: "lowercase" }}>
              {home.currentEdition.title}
            </h2>
            <div className="body-copy voice" style={{ marginTop: 24 }}>
              {home.currentEdition.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <div className="cta-row" style={{ marginTop: "clamp(40px, 6vw, 80px)" }}>
              <Link className="btn btn--clay" href={currentPath}>
                enter the edition
              </Link>
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
          <h2 className="owe-mark">
            {home.manifestoTeaser.display.map((line) => (
              <span key={line}>
                {line}
                <br />
              </span>
            ))}
          </h2>
        </Reveal>
        {home.manifestoTeaser.lines.map((line, index) => (
          <Reveal key={line}>
            <p
              className="owe-body"
              style={{ marginTop: index === 0 ? undefined : "1.1em" }}
            >
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
              <b>swag.</b> {home.manifestoTeaser.orb.replace(/^swag\.\s*/i, "")}
            </p>
          </Reveal>
        </div>
        <Reveal className="cta-row" style={{ marginTop: "clamp(40px, 6vw, 80px)" }}>
          <Link className="btn btn--clay" href={manifestoPath}>
            read the manifesto
          </Link>
        </Reveal>
      </section>

      <section className="wrap pad">
        <Reveal className="feature" style={{ alignItems: "start" }}>
          <div>
            <span className="lbl">[ 04 — authority ]</span>
            <h2 className="sect">
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
          <Link className="lbl lbl--clay" href={currentPath}>
            kloofstreetnights →
          </Link>
        </Reveal>
        <Reveal>
          <ImageGrid artboards={clothesArtboards} />
        </Reveal>
      </section>

      <section className="wrap pad">
        <Reveal className="sect-head">
          <span className="lbl">[ 06 — the archive ]</span>
          <Link className="lbl lbl--clay" href={archivePath}>
            all editions →
          </Link>
        </Reveal>
        <Reveal style={{ maxWidth: "66ch" }}>
          <h2 className="sect">
            {home.archiveTeaser.display.map((line) => (
              <span key={line}>
                {line}
                <br />
              </span>
            ))}
          </h2>
          <div className="body-copy voice" style={{ marginTop: 24 }}>
            {home.archiveTeaser.body.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </Reveal>
        <Reveal className="arch" style={{ marginTop: 52 }}>
          {editions.map((edition) => (
            <EditionRow
              key={edition.no}
              edition={edition}
              href={edition.no === "001" ? currentPath : undefined}
            />
          ))}
        </Reveal>
      </section>

      <section className="wrap pad" style={{ borderTop: "1px solid var(--line)" }}>
        <Reveal className="join">
          <div>
            <span className="lbl">[ 07 — the list ]</span>
            <h2 className="sect">
              {home.waitlist.title.map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
            </h2>
          </div>
          <div>
            <p className="body-copy voice">
              {home.waitlist.body}
            </p>
            <WaitlistForm note={home.waitlist.note} />
          </div>
        </Reveal>
      </section>

      <section className="closer">
        <div className="wrap">
          <span className="lbl">{home.closer.label}</span>
          <Reveal className="big">
            {home.closer.display.map((line) => (
              <span key={line}>
                {line}
                <br />
              </span>
            ))}
          </Reveal>
        </div>
      </section>
      </>
      )}
    </>
  );
}
