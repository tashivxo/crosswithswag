"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Wordmark } from "@/components/ui/Wordmark";
import { comingSoonEnabled } from "@/lib/coming-soon";
import {
  isHomeIntroSeen,
  markHomeIntroSeen,
  scrollToHomeLanding,
} from "@/lib/home-scroll";

gsap.registerPlugin(ScrollTrigger);

export const WORDMARK_DOCK_SCROLL = {
  start: "top top",
  end: "bottom top",
} as const;

export function getWordmarkDockTrigger() {
  return (
    document.getElementById("home-intro") ?? document.getElementById("home")
  );
}

function viewportSize() {
  const vv = window.visualViewport;
  return {
    width: vv?.width ?? window.innerWidth,
    height: vv?.height ?? window.innerHeight,
    offsetLeft: vv?.offsetLeft ?? 0,
    offsetTop: vv?.offsetTop ?? 0,
  };
}

function dockScale(slot: HTMLElement, layer: HTMLElement) {
  const hero = layer.offsetWidth;
  return hero > 0 ? slot.offsetWidth / hero : 1;
}

function heroOffset(slot: Element) {
  const rect = slot.getBoundingClientRect();
  const vv = viewportSize();
  return {
    x: vv.offsetLeft + vv.width / 2 - (rect.left + rect.width / 2),
    y: vv.offsetTop + vv.height / 2 - (rect.top + rect.height / 2),
  };
}

export function getDockScrub() {
  return window.matchMedia("(pointer: coarse)").matches ? 0.25 : true;
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

    if (!slot) return;

    if (mode === "docked" || reduceMotion) {
      gsap.set(layer, {
        x: 0,
        y: 0,
        scale: dockScale(slot, layer),
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
        scale: dockScale(slot, layer),
        opacity: 1,
      });
      return () => {
        gsap.set(layer, { clearProps: "transform" });
      };
    }

    if (comingSoonEnabled()) {
      // The poster carries its own wordmark: the dock mark simply fades in
      // alongside MENU as the poster scrolls away (no centred flight).
      let dockedScale = dockScale(slot, layer);
      const posterCtx = gsap.context(() => {
        gsap.set(layer, { x: 0, y: 0, scale: dockedScale, opacity: 0 });
        gsap.to(layer, {
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: intro,
            start: WORDMARK_DOCK_SCROLL.start,
            end: WORDMARK_DOCK_SCROLL.end,
            scrub: getDockScrub(),
            invalidateOnRefresh: true,
            onRefresh: () => {
              dockedScale = dockScale(slot, layer);
              gsap.set(layer, { scale: dockedScale });
            },
          },
        });
        requestAnimationFrame(() => ScrollTrigger.refresh());
      }, layer);
      return () => posterCtx.revert();
    }

    let startX = 0;
    let startY = 0;
    let endScale = 1;
    const introSeen = isHomeIntroSeen();

    if (introSeen) {
      scrollToHomeLanding({ immediate: true });
    }

    const measure = () => {
      const from = heroOffset(slot);
      startX = from.x;
      startY = from.y;
      endScale = dockScale(slot, layer);
    };

    const ctx = gsap.context(() => {
      measure();

      gsap.set(layer, {
        x: introSeen ? 0 : startX,
        y: introSeen ? 0 : startY,
        scale: introSeen ? endScale : 1,
        opacity: 1,
        force3D: true,
      });

      gsap.fromTo(
        layer,
        {
          x: () => startX,
          y: () => startY,
          scale: 1,
          opacity: 1,
          force3D: true,
        },
        {
          x: 0,
          y: 0,
          scale: () => endScale,
          opacity: 1,
          force3D: true,
          ease: "none",
          immediateRender: !introSeen,
          scrollTrigger: {
            trigger: intro,
            start: WORDMARK_DOCK_SCROLL.start,
            end: WORDMARK_DOCK_SCROLL.end,
            scrub: getDockScrub(),
            invalidateOnRefresh: true,
            onRefresh: measure,
            onLeave: () => markHomeIntroSeen(),
            onUpdate: (self) => {
              if (self.progress >= 1) {
                markHomeIntroSeen();
              }
            },
          },
        },
      );

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }, layer);

    return () => {
      ctx.revert();
    };
  }, [ready, mode]);

  return (
    <div ref={layerRef} className="wordmark-drift-layer" aria-hidden="true">
      <Wordmark />
    </div>
  );
}
