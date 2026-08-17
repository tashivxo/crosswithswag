"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Wordmark } from "@/components/ui/Wordmark";
import { getLenis } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger);

export const WORDMARK_DOCK_SCROLL = {
  start: "top top",
  end: "bottom top",
  scrub: 0.6,
} as const;

export function getWordmarkDockTrigger() {
  return (
    document.getElementById("home-intro") ?? document.getElementById("home")
  );
}

function tokenPx(name: string) {
  const probe = document.createElement("div");
  probe.style.cssText = `position:absolute;visibility:hidden;pointer-events:none;width:var(${name})`;
  document.body.appendChild(probe);
  const width = probe.getBoundingClientRect().width;
  probe.remove();
  return width;
}

function dockScale() {
  const dock = tokenPx("--wordmark-dock-width");
  const hero = tokenPx("--wordmark-hero-width");
  return hero > 0 ? dock / hero : 1;
}

function heroOffset(slot: Element) {
  const rect = slot.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  return {
    x: window.innerWidth / 2 - cx,
    y: window.innerHeight / 2 - cy,
  };
}

export function WordmarkDriftDock({
  ready,
  mode,
}: {
  ready: boolean;
  mode: "hero" | "docked";
}) {
  const layerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!ready || !layerRef.current) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const layer = layerRef.current;
    const slot = layer.parentElement;
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }

    if (!slot) return;

    if (mode === "docked" || reduceMotion) {
      gsap.set(layer, {
        x: 0,
        y: 0,
        scale: dockScale(),
        opacity: 1,
      });
      return () => {
        gsap.set(layer, { clearProps: "transform" });
      };
    }

    const intro = getWordmarkDockTrigger();
    if (!intro) {
      gsap.set(layer, {
        x: 0,
        y: 0,
        scale: dockScale(),
        opacity: 1,
      });
      return () => {
        gsap.set(layer, { clearProps: "transform" });
      };
    }

    let onResize: (() => void) | undefined;

    const ctx = gsap.context(() => {
      const from = () => ({
        ...heroOffset(slot),
        scale: 1,
      });

      gsap.set(layer, {
        x: from().x,
        y: from().y,
        scale: 1,
        opacity: 1,
        force3D: true,
      });

      gsap.fromTo(
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
          scale: () => dockScale(),
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: intro,
            start: WORDMARK_DOCK_SCROLL.start,
            end: WORDMARK_DOCK_SCROLL.end,
            scrub: WORDMARK_DOCK_SCROLL.scrub,
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
  }, [ready, mode]);

  return (
    <div ref={layerRef} className="wordmark-drift-layer" aria-hidden="true">
      <Wordmark />
    </div>
  );
}
