"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import DarkVeil from "@/components/v3/DarkVeil";
import { comingSoonEnabled } from "@/lib/coming-soon";
import { watchVeilLayout } from "@/lib/coming-soon-veil-refresh";
import {
  COMING_SOON_VEIL_PROPS,
  resolveVeilQuality,
} from "@/lib/coming-soon-veil";

const COARSE_QUERY = "(pointer: coarse)";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToQueries(onChange: () => void) {
  const lists = [COARSE_QUERY, REDUCED_QUERY].map((query) =>
    window.matchMedia(query),
  );
  lists.forEach((list) => list.addEventListener("change", onChange));
  return () =>
    lists.forEach((list) => list.removeEventListener("change", onChange));
}

const getQuality = () =>
  resolveVeilQuality({
    coarsePointer: window.matchMedia(COARSE_QUERY).matches,
    maxTouchPoints: navigator.maxTouchPoints ?? 0,
  });

const getReducedMotion = () => window.matchMedia(REDUCED_QUERY).matches;

// DarkVeil only mounts on the client, once quality is known, so it never
// initialises WebGL at the wrong resolution.
const getServerQuality = () => null;
const getServerReducedMotion = () => false;

export function ComingSoonVeilLayer({
  quality,
  reducedMotion = false,
}: {
  quality: number | null;
  reducedMotion?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const ready = quality !== null;

  useEffect(() => {
    if (!ready || !ref.current) return;
    return watchVeilLayout(ref.current);
  }, [ready]);

  return (
    <div ref={ref} className="cs-veil" aria-hidden="true">
      {quality !== null && (
        <DarkVeil
          {...COMING_SOON_VEIL_PROPS}
          quality={quality}
          paused={reducedMotion}
          intro={!reducedMotion}
          mouseInteraction={!reducedMotion}
        />
      )}
    </div>
  );
}

export function ComingSoonVeil() {
  const enabled = comingSoonEnabled();
  const quality = useSyncExternalStore(
    subscribeToQueries,
    getQuality,
    getServerQuality,
  );
  const reducedMotion = useSyncExternalStore(
    subscribeToQueries,
    getReducedMotion,
    getServerReducedMotion,
  );

  if (!enabled) return null;
  return <ComingSoonVeilLayer quality={quality} reducedMotion={reducedMotion} />;
}
