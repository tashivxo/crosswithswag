"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

type EditionMarqueeProps = {
  text: string;
};

export function EditionMarquee({ text }: EditionMarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) return;

    const tween = gsap.to(track, {
      xPercent: -50,
      duration: 28,
      ease: "none",
      repeat: -1,
    });

    return () => {
      tween.kill();
    };
  }, []);

  const repeated = `${text} `.repeat(6);

  return (
    <div className="edition-marquee" aria-hidden="true">
      <div ref={trackRef} className="edition-marquee-track">
        <span className="edition-marquee-text">{repeated}</span>
        <span className="edition-marquee-text">{repeated}</span>
      </div>
    </div>
  );
}
