"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Wordmark } from "@/components/ui/Wordmark";

gsap.registerPlugin(ScrollTrigger);

const DOCK_SCROLL = 260;
const DOCK_START = 40;

function tokenPx(name: string) {
  const probe = document.createElement("div");
  probe.style.cssText = `position:absolute;visibility:hidden;pointer-events:none;width:var(${name})`;
  document.body.appendChild(probe);
  const width = probe.getBoundingClientRect().width;
  probe.remove();
  return width;
}

function heroScale() {
  const dock = tokenPx("--wordmark-dock-width");
  const hero = tokenPx("--wordmark-hero-width");
  return dock > 0 ? hero / dock : 1;
}

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

  useLayoutEffect(() => {
    if (!ready || !layerRef.current) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) return;

    const layer = layerRef.current;
    const slot = layer.parentElement;
    const home = document.getElementById("home");

    if (!home || !slot) return;

    let onResize: (() => void) | undefined;

    const ctx = gsap.context(() => {
      const from = () => ({
        ...heroOffset(slot),
        scale: heroScale(),
      });

      gsap.set(layer, {
        x: from().x,
        y: from().y,
        scale: from().scale,
        opacity: 1,
        force3D: true,
      });

      gsap.fromTo(
        layer,
        {
          x: () => from().x,
          y: () => from().y,
          scale: () => from().scale,
          opacity: 1,
        },
        {
          x: 0,
          y: 0,
          scale: 1,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: home,
            start: `${DOCK_START} top`,
            end: `${DOCK_SCROLL} top`,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        },
      );

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
