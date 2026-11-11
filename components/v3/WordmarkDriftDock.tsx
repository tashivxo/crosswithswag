"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Wordmark } from "@/components/ui/Wordmark";
import { acquireLandingDock } from "@/lib/landing-dock";
import { useShortScreen } from "@/lib/use-short-screen";
import { markHomeIntroSeen } from "@/lib/home-scroll";

gsap.registerPlugin(ScrollTrigger);

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

export function WordmarkDriftDock({
  ready,
  mode,
}: {
  ready: boolean;
  mode: "hero" | "docked";
}) {
  const layerRef = useRef<HTMLDivElement>(null);
  const shortScreen = useShortScreen();

  useLayoutEffect(() => {
    if (!ready || !layerRef.current) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const layer = layerRef.current;
    const slot = layer.parentElement;

    if (!slot) return;

    const dockNow = () => {
      const apply = () => {
        gsap.set(layer, {
          x: 0,
          y: 0,
          scale: dockScale(slot, layer),
          opacity: 1,
        });
      };
      apply();

      const observer =
        typeof ResizeObserver === "undefined" ? null : new ResizeObserver(apply);
      observer?.observe(slot);
      observer?.observe(layer);
      window.addEventListener("resize", apply);
      window.visualViewport?.addEventListener("resize", apply);

      return () => {
        observer?.disconnect();
        window.removeEventListener("resize", apply);
        window.visualViewport?.removeEventListener("resize", apply);
        gsap.set(layer, { clearProps: "transform" });
      };
    };

    if (mode === "docked" || reduceMotion) {
      return dockNow();
    }

    const dock = acquireLandingDock();
    if (!dock) {
      return dockNow();
    }

    let startX = 0;
    let startY = 0;
    let endScale = 1;

    const measure = () => {
      const from = heroOffset(slot);
      startX = from.x;
      startY = from.y;
      endScale = dockScale(slot, layer);
    };

    measure();
    const stopRefresh = dock.onRefresh(measure);
    const stopProgress = dock.onProgress((progress) => {
      if (progress >= 1) markHomeIntroSeen();
    });

    const ctx = gsap.context(() => {
      gsap.set(layer, {
        x: startX,
        y: startY,
        scale: 1,
        opacity: 1,
        force3D: true,
      });

      dock.timeline.fromTo(
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
          duration: 1,
        },
        0,
      );
    }, layer);

    return () => {
      stopRefresh();
      stopProgress();
      ctx.revert();
      dock.release();
    };
  }, [ready, mode, shortScreen]);

  return (
    <div ref={layerRef} className="wordmark-drift-layer" aria-hidden="true">
      <Wordmark />
    </div>
  );
}
