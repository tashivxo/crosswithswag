"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { WordmarkDriftDock } from "@/components/v3/WordmarkDriftDock";
import { navChapters } from "@/lib/sections.config";

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

export function SiteHeader({ ready }: { ready: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuFaded, setMenuFaded] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const wasMenuOpenRef = useRef(false);
  const closeMenu = () => setMenuOpen(false);
  const openMenu = () => setMenuOpen(true);

  useEffect(() => {
    document.body.classList.toggle("locked", menuOpen);
    return () => document.body.classList.remove("locked");
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) return;

    const TOP = 80;
    let lastY = window.scrollY;

    const apply = (y: number, direction: number) => {
      if (y <= TOP) {
        setMenuFaded(false);
        return;
      }
      if (direction > 0) setMenuFaded(true);
      else if (direction < 0) setMenuFaded(false);
    };

    const onWindowScroll = () => {
      const y = window.scrollY;
      const direction = y > lastY ? 1 : y < lastY ? -1 : 0;
      lastY = y;
      apply(y, direction);
    };

    const onLenisScroll = (event: Event) => {
      const detail = (event as CustomEvent<{ scroll: number; direction: number }>)
        .detail;
      if (!detail) return;
      lastY = detail.scroll;
      apply(detail.scroll, detail.direction);
    };

    window.addEventListener("scroll", onWindowScroll, { passive: true });
    window.addEventListener("swag:scroll", onLenisScroll);
    return () => {
      window.removeEventListener("scroll", onWindowScroll);
      window.removeEventListener("swag:scroll", onLenisScroll);
    };
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
      ".site-header, .chapter, .site-footer, #preloader",
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

  return (
    <>
      <header className="site-header">
        <div className="wrap hdr-in">
          <Link href="#home" className="hdr-mark-slot" aria-label="SWAG home">
            <WordmarkDriftDock ready={ready} />
          </Link>
          <button
            ref={burgerRef}
            type="button"
            className="burger"
            aria-expanded={menuOpen}
            aria-controls="menu"
            aria-hidden={menuFaded}
            tabIndex={menuFaded ? -1 : 0}
            data-faded={menuFaded ? "true" : "false"}
            onClick={openMenu}
          >
            <span className={`t-text-swap${menuFaded ? " is-exit" : ""}`}>
              <span className="nav-label">menu</span>
            </span>
          </button>
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
          {navChapters.map((chapter, index) => (
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
                  className="mi"
                  href={`#${chapter.id}`}
                  tabIndex={menuOpen ? 0 : -1}
                  onClick={closeMenu}
                >
                  {chapter.navLabel}
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="pre-row">
          <span className="lbl">@crosswithswag</span>
          <span className="lbl">nothing owing</span>
        </div>
      </div>
    </>
  );
}
