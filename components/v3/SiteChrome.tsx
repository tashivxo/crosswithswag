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

gsap.registerPlugin(ScrollTrigger);

const HASH_ROUTES: Record<string, string> = {
  "#current": "/current",
  "#archive": "/archive",
  "#manifesto": "/manifesto",
  "#contact": "/contact",
  "#home": "/",
};

function normalizePath(path: string) {
  if (path === "/") return "/";
  return path.replace(/\/$/, "");
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
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

    const target = HASH_ROUTES[hash];
    if (!target) return;

    if (target === "/") {
      router.replace("/", { scroll: false });
    } else {
      router.replace(target, { scroll: false });
    }
  }, [pathname, router]);

  const mode = normalizePath(pathname) === "/" ? "hero" : "docked";

  return (
    <main className="page-shell">
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
