"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ScrollColorController() {
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const sections = gsap.utils.toArray<HTMLElement>("[data-section-bg]");
    if (!sections.length || reduceMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      sections.forEach((section) => {
        const color = section.dataset.sectionBg;
        if (!color) return;

        gsap.to(document.documentElement, {
          "--page-bg": color,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top center",
            end: "bottom center",
            scrub: true,
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return null;
}
