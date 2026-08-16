"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Wordmark } from "@/components/ui/Wordmark";

gsap.registerPlugin(ScrollTrigger);

export function HeroWordmarkScroll() {
  const wordmarkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wordmark = wordmarkRef.current;
    const heroSection = document.getElementById("hero");
    if (!wordmark || !heroSection) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      gsap.set(wordmark, { opacity: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(wordmark, {
        position: "absolute",
        left: "50%",
        top: "42%",
        xPercent: -50,
        yPercent: -50,
        scale: 1.4,
      });

      gsap.to(wordmark, {
        left: "var(--section-pad-x)",
        top: "clamp(36px, 6vh, 72px)",
        xPercent: 0,
        yPercent: 0,
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: heroSection,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      ScrollTrigger.create({
        trigger: heroSection,
        start: "bottom top+=80",
        onEnter: () => gsap.set(wordmark, { opacity: 0 }),
        onLeaveBack: () => gsap.set(wordmark, { opacity: 1 }),
      });
    }, heroSection);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wordmarkRef} className="hero-wordmark-layer">
      <Wordmark className="hero-wordmark" />
    </div>
  );
}
