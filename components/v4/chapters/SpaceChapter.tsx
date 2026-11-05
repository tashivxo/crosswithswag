"use client";

import Link from "next/link";
import { V4FilledButton } from "@/components/v4/V4Shop";
import { Ticker } from "@/components/v3/Ticker";

export function SpaceChapter() {
  return (
    <div id="space" className="v4-space">
      <section className="v4-space-hero section-shell">
        <p className="lbl">[ STANDARD EDITION — 13.11 ]</p>
        <h1 className="v4-space-hero__title">
          <span>CROSS</span> <span className="text-clay">WITH</span> SWAG
        </h1>
        <hr className="v4-rule" />
        <div className="v4-space-hero__bottom">
          <div>
            <p className="lbl">[ MORE THAN CLOTHES ]</p>
            <p>
              swag is not just clothes. a standard edition, always open. parties.
              recorded sessions. artist spotlights. and editions that close once.
            </p>
          </div>
          <div className="v4-space-hero__ctas">
            <V4FilledButton href="/">THE STANDARD EDITION</V4FilledButton>
            <V4FilledButton href="/archive">THE ARCHIVE</V4FilledButton>
          </div>
        </div>
      </section>

      <Ticker />

      <section className="section-shell v4-space-block">
        <p className="lbl">[ 01 — THE STANDARD EDITION ]</p>
        <div className="v4-space-feature">
          <div className="v4-space-feature__media" aria-hidden />
          <div>
            <h2>standard edition</h2>
            <p>
              a homage to streetwear and the y2k era. always open. drops 13.11.
            </p>
            <V4FilledButton href="/">SEE THE RANGE</V4FilledButton>
          </div>
        </div>
      </section>

      <section className="section-shell v4-space-block">
        <p className="lbl">[ 02 — THE SPACE ]</p>
        <p className="v4-space-block__lead">
          swag.bash — parties. boiler room sessions. artist spotlights.
        </p>
      </section>

      <section className="section-shell v4-space-block">
        <p className="lbl">[ 04 — THE MANIFESTO ]</p>
        <h2 className="display">OWE NOTHING.</h2>
        <V4FilledButton href="/manifesto">READ THE MANIFESTO</V4FilledButton>
      </section>

      <section className="section-shell v4-space-block">
        <p className="lbl">[ 08 — THE LIST ]</p>
        <Link href="/contact" className="text-link">
          join the list →
        </Link>
      </section>
    </div>
  );
}
