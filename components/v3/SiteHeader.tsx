"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { WordmarkDriftDock } from "@/components/v3/WordmarkDriftDock";
import { acquireLandingDock } from "@/lib/landing-dock";
import { useShortScreen } from "@/lib/use-short-screen";
import {
  queueRouteScroll,
  scrollToHomeLanding,
  scrollToShop,
} from "@/lib/home-scroll";
import {
  DESKTOP_NAV_QUERY,
  getDesktopNavItems,
  isDesktopNavCurrent,
  navItems,
  normalizePath,
} from "@/lib/sections.config";
import { useCart } from "@/lib/v4/cart/CartProvider";

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

export function SiteHeader({
  ready,
  mode,
}: {
  ready: boolean;
  mode: "hero" | "docked";
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [chromeLive, setChromeLive] = useState(mode === "docked");
  const shortScreen = useShortScreen();
  const navTab = ready && chromeLive ? 0 : -1;
  const { count, openDrawer } = useCart();
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
    const media = window.matchMedia(DESKTOP_NAV_QUERY);
    const sync = () => {
      if (media.matches) setMenuOpen(false);
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

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
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const armChrome = (live: boolean) => {
      if (live) chrome.setAttribute("data-interactive", "");
      else chrome.removeAttribute("data-interactive");
      chrome.style.pointerEvents = live ? "auto" : "none";
      setChromeLive(live);
    };

    const showChrome = () => {
      gsap.set(chrome, {
        autoAlpha: 1,
        y: 0,
      });
      armChrome(true);
      if (header) {
        gsap.set(header, { "--header-line": 1 });
      }
    };

    if (mode === "docked" || reduceMotion) {
      showChrome();
      return;
    }

    const dock = acquireLandingDock();
    if (!dock) {
      showChrome();
      return;
    }

    armChrome(false);
    const stopProgress = dock.onProgress((progress) => {
      armChrome(progress >= 0.85);
    });

    const ctx = gsap.context(() => {
      dock.timeline.fromTo(
        chrome,
        {
          autoAlpha: 0,
          y: -8,
        },
        {
          autoAlpha: 1,
          y: 0,
          ease: "none",
          duration: 1,
        },
        0,
      );

      if (header) {
        dock.timeline.fromTo(
          header,
          { "--header-line": 0 },
          { "--header-line": 1, ease: "none", duration: 1 },
          0,
        );
      }
    }, chrome);

    return () => {
      stopProgress();
      armChrome(false);
      ctx.revert();
      dock.release();
    };
  }, [ready, mode, shortScreen]);

  return (
    <>
      <header
        ref={headerRef}
        className="site-header"
        data-ready={ready ? "true" : "false"}
        data-route={mode}
      >
        <div className="wrap hdr-in">
          <Link
            href="/"
            className="hdr-mark-slot"
            aria-label="SWAG home"
            onClick={(event) => {
              if (currentPath === "/") {
                event.preventDefault();
                closeMenu();
                scrollToHomeLanding();
              }
            }}
          >
            <WordmarkDriftDock ready={ready} mode={mode} />
          </Link>
          <div
            ref={chromeRef}
            className="site-header__chrome"
            aria-hidden={!ready || !chromeLive}
          >
            <nav className="site-nav" aria-label="Primary">
              {getDesktopNavItems().map((item) => {
                const current = isDesktopNavCurrent(item, currentPath);
                const className = "site-nav__link";
                const label =
                  item.action === "cart"
                    ? `${item.navLabel} (${count})`
                    : item.navLabel;

                if (item.action === "cart") {
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={className}
                      tabIndex={navTab}
                      aria-current={current ? "page" : undefined}
                      onClick={openDrawer}
                    >
                      <span className="nav-label">{label}</span>
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.id}
                    className={className}
                    href={item.href}
                    tabIndex={navTab}
                    aria-current={current ? "page" : undefined}
                    onAuxClick={() => {
                      /* native <a href> handles middle-click */
                    }}
                    onClick={(event) => {
                      if (
                        event.metaKey ||
                        event.ctrlKey ||
                        event.shiftKey ||
                        event.altKey ||
                        event.button === 1
                      ) {
                        return;
                      }
                      event.preventDefault();
                      const chapterPath = normalizePath(item.href);
                      if (item.id === "home" && currentPath === "/") {
                        scrollToShop();
                        return;
                      }
                      if (chapterPath !== currentPath) {
                        router.push(item.href, { scroll: true });
                      }
                      queueRouteScroll(chapterPath);
                    }}
                  >
                    <span className="nav-label">{label}</span>
                  </Link>
                );
              })}
            </nav>
            <button
              type="button"
              className="burger site-header__cart"
              tabIndex={navTab}
              onClick={openDrawer}
              aria-label={`Cart (${count})`}
            >
              <span className="nav-label">cart ({count})</span>
            </button>
            <button
              ref={burgerRef}
              type="button"
              className="burger site-header__menu-btn"
              tabIndex={navTab}
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
          data-lenis-prevent
          onMouseLeave={() => setMenuShifts(groupRef.current, null, "out")}
        >
          {navItems.map((item, index) => {
            const isCurrent =
              !item.external && isDesktopNavCurrent(item, currentPath);

            return (
              <div
                key={item.id}
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
                  {item.action === "cart" ? (
                    <button
                      type="button"
                      className={isCurrent ? "mi mi--current" : "mi"}
                      aria-current={isCurrent ? "page" : undefined}
                      tabIndex={menuOpen ? 0 : -1}
                      onClick={() => {
                        document.body.classList.remove("locked");
                        closeMenu();
                        openDrawer();
                      }}
                    >
                      {item.navLabel} ({count})
                    </button>
                  ) : item.external ? (
                    <a
                      className="mi"
                      href={item.href}
                      tabIndex={menuOpen ? 0 : -1}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        document.body.classList.remove("locked");
                        closeMenu();
                      }}
                    >
                      {item.navLabel}
                    </a>
                  ) : (
                    <Link
                      className={isCurrent ? "mi mi--current" : "mi"}
                      href={item.href}
                      tabIndex={menuOpen ? 0 : -1}
                      aria-current={isCurrent ? "page" : undefined}
                      onClick={(event) => {
                        event.preventDefault();
                        const chapterPath = normalizePath(item.href);
                        document.body.classList.remove("locked");
                        closeMenu();
                        if (chapterPath !== currentPath) {
                          router.push(item.href, { scroll: true });
                        }
                        queueRouteScroll(chapterPath);
                      }}
                    >
                      {item.navLabel}
                    </Link>
                  )}
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
