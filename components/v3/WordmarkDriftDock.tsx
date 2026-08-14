"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Wordmark } from "@/components/ui/Wordmark";

gsap.registerPlugin(ScrollTrigger);

const DOCK_SCROLL = 260;
const DOCK_START = 40;

function heroOffset(slot: Element) {
  const rect = slot.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  return {
    x: window.innerWidth / 2 - cx,
    y: window.innerHeight * 0.42 - cy,
  };
}

export function WordmarkDriftDock({ ready }: { ready: boolean }) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ready || !layerRef.current) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) return;

    const layer = layerRef.current;
    const slot = layer.parentElement;
    const home = document.getElementById("home");
    const heroContent = home?.querySelector<HTMLElement>(".hero-content");

    if (!home || !slot) return;

    let onResize: (() => void) | undefined;

    const ctx = gsap.context(() => {
      const from = () => heroOffset(slot);

      gsap.set(layer, {
        x: from().x,
        y: from().y,
        scale: 1,
        opacity: 1,
        force3D: true,
      });

      if (heroContent) {
        gsap.set(heroContent, { opacity: 0, y: 14, force3D: true });
      }

      const dockTl = gsap.timeline({
        scrollTrigger: {
          trigger: home,
          start: `${DOCK_START} top`,
          end: `${DOCK_SCROLL} top`,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      dockTl.fromTo(
        layer,
        {
          x: () => from().x,
          y: () => from().y,
          scale: 1,
          opacity: 1,
        },
        {
          x: 0,
          y: 0,
          scale: 1,
          opacity: 1,
          ease: "none",
        },
      );

      if (heroContent) {
        dockTl.fromTo(
          heroContent,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, ease: "none" },
          0.28,
        );
      }

      onResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", onResize);
    }, layer);

    return () => {
      if (onResize) window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, [ready]);

  return (
    <div ref={layerRef} className="wordmark-drift-layer" aria-hidden="true">
      <Wordmark />
    </div>
  );
}
