"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Wordmark } from "@/components/ui/Wordmark";
import type { SectionConfig } from "@/lib/sections.config";
import { colors } from "@/lib/design-tokens";

gsap.registerPlugin(ScrollTrigger);

type WordmarkControllerProps = {
  sections: readonly SectionConfig[];
};

export function WordmarkController({ sections }: WordmarkControllerProps) {
  const fixedWordmarkRef = useRef<HTMLDivElement>(null);
  const fixedShellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const heroSection = document.getElementById("hero");
    const fixedShell = fixedShellRef.current;
    const fixedWordmark = fixedWordmarkRef.current;

    if (!heroSection || !fixedShell || !fixedWordmark) {
      return;
    }

    const lightSections = sections
      .filter((section) => section.tone === "light")
      .map((section) => document.getElementById(section.id))
      .filter(Boolean) as HTMLElement[];

    const setWordmarkColor = (color: string) => {
      document.documentElement.style.setProperty("--wordmark-color", color);
    };

    setWordmarkColor(colors.mutedSand);

    if (reduceMotion) {
      gsap.set(fixedShell, { opacity: 1, pointerEvents: "auto" });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(fixedShell, { opacity: 0, pointerEvents: "none" });

      ScrollTrigger.create({
        trigger: heroSection,
        start: "bottom top+=80",
        onEnter: () => {
          gsap.set(fixedShell, { opacity: 1, pointerEvents: "auto" });
        },
        onLeaveBack: () => {
          gsap.set(fixedShell, { opacity: 0, pointerEvents: "none" });
        },
      });

      lightSections.forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top 15%",
          end: "bottom 15%",
          onEnter: () => setWordmarkColor(colors.voidBlack),
          onEnterBack: () => setWordmarkColor(colors.voidBlack),
          onLeave: () => setWordmarkColor(colors.mutedSand),
          onLeaveBack: () => setWordmarkColor(colors.mutedSand),
        });
      });

      fixedWordmark.addEventListener("pointermove", (event) => {
        const rect = fixedWordmark.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 6;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 6;
        gsap.to(fixedWordmark, {
          x,
          y,
          duration: 0.4,
          ease: "power2.out",
          overwrite: true,
        });
      });

      fixedWordmark.addEventListener("pointerleave", () => {
        gsap.to(fixedWordmark, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        });
      });
    });

    return () => ctx.revert();
  }, [sections]);

  return (
    <div ref={fixedShellRef} className="fixed-wordmark-shell">
      <div ref={fixedWordmarkRef} className="fixed-wordmark-interactive">
        <Wordmark className="fixed-wordmark" />
      </div>
    </div>
  );
}
