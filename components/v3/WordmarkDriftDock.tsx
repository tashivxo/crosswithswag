"use client";

import { useEffect, useRef } from "react";
import { Wordmark } from "@/components/ui/Wordmark";

export function WordmarkDriftDock({
  ready,
  docked,
  onDock,
}: {
  ready: boolean;
  docked: boolean;
  onDock: () => void;
}) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ready || !layerRef.current) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      onDock();
      return;
    }

    const layer = layerRef.current;
    window.setTimeout(() => {
      layer.classList.add("away");
    }, 400);
  }, [ready, onDock]);

  useEffect(() => {
    if (!ready) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      onDock();
      return;
    }

    const onScroll = () => {
      if (window.scrollY > 80) {
        onDock();
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [ready, onDock]);

  if (docked) return null;

  return (
    <div ref={layerRef} className="wordmark-drift-layer" aria-hidden="true">
      <Wordmark />
    </div>
  );
}
