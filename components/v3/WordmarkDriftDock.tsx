"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Wordmark } from "@/components/ui/Wordmark";

gsap.registerPlugin(ScrollTrigger);

const DOCK_SCROLL = 260;
const DOCK_START = 40;

function getDockWidth(): number {
  const vw = window.innerWidth * 0.16;
  return Math.min(240, Math.max(120, vw));
}

function getTargets(slot: Element, wordmark: HTMLElement) {
  const rect = slot.getBoundingClientRect();
  const introW = wordmark.offsetWidth;
  const dockScale = introW > 0 ? getDockWidth() / introW : 1;

  return {
    centerX: window.innerWidth / 2,
    centerY: window.innerHeight * 0.42,
    awayY: window.innerHeight * 0.42 - 32,
    dockX: rect.left + rect.width / 2,
    dockY: rect.top + rect.height / 2,
    awayScale: 0.96,
    dockScale,
  };
}

function setAway(layer: HTMLElement, targets: ReturnType<typeof getTargets>) {
  gsap.set(layer, {
    x: targets.centerX,
    y: targets.awayY,
    xPercent: -50,
    yPercent: -50,
    scale: targets.awayScale,
    opacity: 0,
    force3D: true,
  });
}

function setDocked(layer: HTMLElement, targets: ReturnType<typeof getTargets>) {
  gsap.set(layer, {
    x: targets.dockX,
    y: targets.dockY,
    xPercent: -50,
    yPercent: -50,
    scale: targets.dockScale,
    opacity: 1,
    force3D: true,
  });
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
    const home = document.getElementById("home");
    const slot = document.querySelector(".hdr-mark-slot");

    if (!home || !slot) return;

    const wordmark = layer.querySelector(".wordmark") as HTMLElement | null;
    if (!wordmark) return;

    let introTl: gsap.core.Timeline | null = null;
    let dockTl: gsap.core.Timeline | null = null;
    let introComplete = false;
    let onScrollHandoff: (() => void) | null = null;
    let onResize: (() => void) | null = null;

    const ctx = gsap.context(() => {
      const targets = () => getTargets(slot, wordmark);

      const initial = targets();
      gsap.set(layer, {
        x: initial.centerX,
        y: initial.centerY,
        xPercent: -50,
        yPercent: -50,
        scale: 1,
        opacity: 1,
        force3D: true,
      });

      const buildDockTimeline = () => {
        if (dockTl) return dockTl;

        const t = targets();
        dockTl = gsap.timeline({
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
            x: t.centerX,
            y: t.awayY,
            xPercent: -50,
            yPercent: -50,
            scale: t.awayScale,
            opacity: 0,
          },
          {
            x: t.dockX,
            y: t.dockY,
            xPercent: -50,
            yPercent: -50,
            scale: t.dockScale,
            opacity: 1,
            ease: "none",
          },
        );

        return dockTl;
      };

      const handoffToScroll = () => {
        if (introTl) {
          introTl.kill();
          introTl = null;
        }
        if (!introComplete) {
          introComplete = true;
          const t = targets();
          setAway(layer, t);
        }
        buildDockTimeline();
        ScrollTrigger.refresh();
      };

      const skipIntro =
        window.scrollY > DOCK_START || window.location.hash.length > 1;

      if (skipIntro) {
        introComplete = true;
        const t = targets();

        if (window.scrollY >= DOCK_SCROLL) {
          setDocked(layer, t);
        } else {
          setAway(layer, t);
        }

        buildDockTimeline();
        requestAnimationFrame(() => ScrollTrigger.refresh());
        window.setTimeout(() => ScrollTrigger.refresh(), 150);
      } else {
        introTl = gsap.timeline({
          delay: 0.2,
          onComplete: () => {
            introComplete = true;
            setAway(layer, targets());
            buildDockTimeline();
          },
        });

        introTl.to(layer, {
          y: initial.centerY - 32,
          opacity: 0,
          scale: initial.awayScale,
          duration: 1,
          ease: "power2.inOut",
        });

        onScrollHandoff = () => {
          if (window.scrollY > 0) {
            handoffToScroll();
            window.removeEventListener("scroll", onScrollHandoff!);
            onScrollHandoff = null;
          }
        };

        window.addEventListener("scroll", onScrollHandoff, { passive: true });
      }

      onResize = () => {
        const t = targets();
        const st = dockTl?.scrollTrigger;

        if (window.scrollY >= DOCK_SCROLL) {
          setDocked(layer, t);
        } else if (st && st.progress >= 1) {
          setDocked(layer, t);
        } else if (st && st.progress > 0) {
          ScrollTrigger.refresh();
        } else if (introComplete) {
          setAway(layer, t);
        } else {
          gsap.set(layer, {
            x: t.centerX,
            y: t.centerY,
            xPercent: -50,
            yPercent: -50,
            scale: 1,
            opacity: 1,
          });
        }
      };

      window.addEventListener("resize", onResize);
    }, layer);

    return () => {
      if (onScrollHandoff) {
        window.removeEventListener("scroll", onScrollHandoff);
      }
      if (onResize) {
        window.removeEventListener("resize", onResize);
      }
      ctx.revert();
    };
  }, [ready]);

  return (
    <div ref={layerRef} className="wordmark-drift-layer" aria-hidden="true">
      <Wordmark />
    </div>
  );
}
