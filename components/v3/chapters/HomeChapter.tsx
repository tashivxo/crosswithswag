import type { CSSProperties } from "react";
import Link from "next/link";
import { home } from "@/lib/copy";
import { chapters } from "@/lib/sections.config";

const homeChapter = chapters.find((chapter) => chapter.id === "home")!;
const [crossLine, withLine, swagLine] = home.heroMark;

export function HomeChapter() {
  return (
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
      <div id="home-intro" className="home-intro" aria-hidden="true" />
      <div className="section-inner">
        <div id="home-hero" className="hero-content" tabIndex={-1}>
          <div>
            <div className="hero-top">
              <span className="lbl lbl--sand">{home.editionLabel}</span>
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
          </div>

          <div className="hero-bottom">
            <div>
              <span className="lbl lbl--clay">{home.wearableLabel}</span>
              <p className="body-copy voice" style={{ marginTop: 16 }}>
                {home.intro}
              </p>
            </div>
            <div className="cta-row">
              <Link className="btn btn--clay" href="#current">
                the current edition
              </Link>
              <Link className="btn" href="#archive">
                the archive
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
