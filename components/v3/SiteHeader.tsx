"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  WORDMARK_DOCK_SCROLL,
  WordmarkDriftDock,
  getWordmarkDockTrigger,
} from "@/components/v3/WordmarkDriftDock";
import { navChapters } from "@/lib/sections.config";

gsap.registerPlugin(ScrollTrigger);

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusables(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => !el.closest("[inert]"),
  );
}

function setMenuShifts(
  root: HTMLElement | null,
  activeIdx: number | null,
  phase: "in" | "out",
) {
  if (!root) return;

  const cs = getComputedStyle(document.documentElement);
  const num = (name: string, fallback: number) => {
    const value = parseFloat(cs.getPropertyValue(name));
    return Number.isFinite(value) ? value : fallback;
  };
  const ease = (name: string, fallback: string) =>
    cs.getPropertyValue(name).trim() || fallback;

  const lift = num("--avatar-lift", -4);
  const falloff = num("--avatar-falloff", 0.45);
  const scale = num("--avatar-scale", 1.12);
  const timing =
    phase === "out"
      ? ease("--avatar-ease-out", "cubic-bezier(0.34, 3.85, 0.64, 1)")
      : ease("--avatar-ease-in", "cubic-bezier(0.22, 1, 0.36, 1)");

  root.querySelectorAll<HTMLElement>(".t-avatar").forEach((el, i) => {
    el.style.transitionTimingFunction = timing;
    if (activeIdx == null) {
      el.style.setProperty("--shift", "0px");
      el.style.setProperty("--scale-active", "1");
      return;
    }
    const distance = Math.abs(i - activeIdx);
    el.style.setProperty(
      "--shift",
      `${(lift * Math.pow(falloff, distance)).toFixed(3)}px`,
    );
    el.style.setProperty(
      "--scale-active",
      i === activeIdx ? String(scale) : "1",
    );
  });
}

function normalizePath(path: string) {
  if (path === "/") return "/";
  return path.replace(/\/$/, "");
}

export function SiteHeader({
  ready,
  mode,
}: {
  ready: boolean;
  mode: "hero" | "docked";
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const chromeRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const wasMenuOpenRef = useRef(false);
  const closeMenu = () => setMenuOpen(false);
  const openMenu = () => setMenuOpen(true);

  const currentPath = normalizePath(pathname);

  useEffect(() => {
    document.body.classList.toggle("locked", menuOpen);
    return () => document.body.classList.remove("locked");
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    const background = document.querySelectorAll(
      ".site-header, #content, .site-footer, #preloader",
    );

    if (menuOpen) {
      background.forEach((el) => el.setAttribute("inert", ""));
    } else {
      background.forEach((el) => el.removeAttribute("inert"));
    }

    return () => background.forEach((el) => el.removeAttribute("inert"));
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) {
      if (wasMenuOpenRef.current) {
        burgerRef.current?.focus();
      }
      wasMenuOpenRef.current = false;
      setMenuShifts(groupRef.current, null, "out");
      return;
    }

    wasMenuOpenRef.current = true;

    const menu = menuRef.current;
    if (!menu) return;

    const focusables = getFocusables(menu);
    focusables[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      const items = getFocusables(menu);
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    menu.addEventListener("keydown", onKeyDown);
    return () => menu.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  useLayoutEffect(() => {
    if (!ready || !chromeRef.current) return;

    const chrome = chromeRef.current;
    const header = headerRef.current;
    const intro = getWordmarkDockTrigger();
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (mode === "docked" || !intro || reduceMotion) {
      gsap.set(chrome, {
        autoAlpha: 1,
        y: 0,
        pointerEvents: "auto",
      });
      if (header) {
        gsap.set(header, { borderBottomColor: "rgba(214, 209, 196, 0.14)" });
      }
      return;
    }

    const ctx = gsap.context(() => {
      const dockScroll = () => ({
        trigger: intro,
        start: WORDMARK_DOCK_SCROLL.start,
        end: WORDMARK_DOCK_SCROLL.end,
        scrub: WORDMARK_DOCK_SCROLL.scrub,
        invalidateOnRefresh: true,
      });

      gsap.fromTo(
        chrome,
        {
          autoAlpha: 0,
          y: -8,
          pointerEvents: "none",
        },
        {
          autoAlpha: 1,
          y: 0,
          pointerEvents: "auto",
          ease: "none",
          scrollTrigger: dockScroll(),
        },
      );

      if (header) {
        gsap.fromTo(
          header,
          { borderBottomColor: "rgba(214, 209, 196, 0)" },
          {
            borderBottomColor: "rgba(214, 209, 196, 0.14)",
            ease: "none",
            scrollTrigger: dockScroll(),
          },
        );
      }
    }, chrome);

    return () => ctx.revert();
  }, [ready, mode]);

  return (
    <>
      <header
        ref={headerRef}
        className="site-header"
        data-ready={ready ? "true" : "false"}
        data-route={mode}
      >
        <div className="wrap hdr-in">
          <Link href="/" className="hdr-mark-slot" aria-label="SWAG home">
            <WordmarkDriftDock ready={ready} mode={mode} />
          </Link>
          <div
            ref={chromeRef}
            className="site-header__chrome"
            aria-hidden={!ready}
          >
            <button
              ref={burgerRef}
              type="button"
              className="burger"
              tabIndex={ready ? 0 : -1}
              aria-expanded={menuOpen}
              aria-controls="menu"
              onClick={openMenu}
            >
              <span className="nav-label">menu</span>
            </button>
          </div>
        </div>
      </header>

      <div
        ref={menuRef}
        id="menu"
        role="dialog"
        aria-modal="true"
        aria-labelledby="menu-label"
        aria-hidden={!menuOpen}
        data-open={menuOpen ? "true" : "false"}
        className="t-panel-slide"
        inert={!menuOpen}
      >
        <div className="pre-row">
          <span id="menu-label" className="lbl">
            [ navigation ]
          </span>
          <button
            type="button"
            className="lbl lbl--sand menu-close"
            onClick={closeMenu}
          >
            <span className="nav-label">close</span>
          </button>
        </div>
        <div
          ref={groupRef}
          className="t-avatar-group"
          onMouseLeave={() => setMenuShifts(groupRef.current, null, "out")}
        >
          {navChapters.map((chapter, index) => {
            const isCurrent = chapter.path === currentPath;
            return (
              <div
                key={chapter.id}
                className="menu-item-hit"
                onMouseEnter={() => {
                  if (
                    window.matchMedia("(hover: hover) and (pointer: fine)")
                      .matches
                  ) {
                    setMenuShifts(groupRef.current, index, "in");
                  }
                }}
              >
                <div className="t-avatar menu-grow">
                  <Link
                    className={isCurrent ? "mi mi--current" : "mi"}
                    href={chapter.path}
                    tabIndex={menuOpen ? 0 : -1}
                    aria-current={isCurrent ? "page" : undefined}
                    onClick={closeMenu}
                  >
                    {chapter.navLabel}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        <div className="pre-row">
          <span className="lbl">@crosswithswag</span>
          <span className="lbl">nothing owing</span>
        </div>
      </div>
    </>
  );
}
