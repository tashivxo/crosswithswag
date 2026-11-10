"use client";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Preloader } from "@/components/v3/Preloader";
import { SiteHeader } from "@/components/v3/SiteHeader";
import { SiteFooter } from "@/components/v3/SiteFooter";
import {
  isHomeIntroSeen,
  markHomeIntroSeen,
  queueRouteScroll,
  restoreRouteScroll,
} from "@/lib/home-scroll";
import { comingSoonEnabled } from "@/lib/coming-soon";
import {
  hashRoutes,
  normalizePath,
  surfaceTone,
  type SurfaceTone,
} from "@/lib/sections.config";

gsap.registerPlugin(ScrollTrigger);

export function SiteChrome({
  children,
  tone,
}: {
  children: React.ReactNode;
  /** Forces the surface (the 404 renders outside the gallery routes). */
  tone?: SurfaceTone;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  const onPreloaderComplete = useCallback(() => {
    setReady(true);
    document.body.classList.remove("locked");
  }, []);

  useEffect(() => {
    if (ready) {
      document.body.classList.remove("locked");
      return;
    }
    document.body.classList.add("locked");
  }, [ready]);

  useEffect(() => {
    if (!("scrollRestoration" in history)) return;
    const previous = history.scrollRestoration;
    history.scrollRestoration = "manual";
    return () => {
      history.scrollRestoration = previous;
    };
  }, []);

  useLayoutEffect(() => {
    restoreRouteScroll(pathname);
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }, [pathname]);

  useEffect(() => {
    return queueRouteScroll(pathname);
  }, [pathname]);

  useEffect(() => {
    const normalized = normalizePath(pathname);
    if (normalized !== "/") return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion || isHomeIntroSeen()) {
      markHomeIntroSeen();
    }
  }, [pathname]);

  useEffect(() => {
    if (normalizePath(pathname) !== "/") return;

    const hash = window.location.hash;
    if (!hash) return;

    const target = hashRoutes[hash];
    if (!target) return;

    router.replace(target, { scroll: false });
  }, [pathname, router]);

  // Figma 21:277 landing: header mark is docked from first paint (the big mark is page content).
  // Only the coming-soon poster still needs the hero flight.
  const mode =
    normalizePath(pathname) === "/" && comingSoonEnabled() ? "hero" : "docked";

  // The coming-soon poster on / is its own dark composition.
  const surface = mode === "hero" ? "dark" : (tone ?? surfaceTone(pathname));

  return (
    <main className="page-shell" data-surface={surface}>
      <a href="#content" className="skip-link">
        skip to content
      </a>
      <Preloader onComplete={onPreloaderComplete} />
      <SiteHeader ready={ready} mode={mode} />
      <div id="content">{children}</div>
      <SiteFooter />
    </main>
  );
}
