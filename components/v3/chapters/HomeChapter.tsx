import type { CSSProperties } from "react";
import Link from "next/link";
import { GhostWatermark } from "@/components/ui/GhostWatermark";
import { home } from "@/lib/copy";
import { chapters } from "@/lib/sections.config";

const homeChapter = chapters.find((chapter) => chapter.id === "home")!;

export function HomeChapter() {
  const ghostText = home.heroDisplay.join("\n");

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
      <GhostWatermark text={ghostText} />
      <div className="section-inner">
        <div className="hero-content">
          <div className="hero-top">
            <span className="lbl lbl--sand">{home.editionLabel}</span>
            <span className="lbl">{home.est}</span>
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
