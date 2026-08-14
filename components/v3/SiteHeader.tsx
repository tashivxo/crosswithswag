"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Wordmark } from "@/components/ui/Wordmark";
import { navChapters, type ChapterId } from "@/lib/sections.config";

const DOCK_SCROLL = 260;

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusables(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => !el.closest("[inert]"),
  );
}

export function SiteHeader({ activeChapter }: { activeChapter: ChapterId }) {
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const wasMenuOpenRef = useRef(false);
  const closeMenu = () => setMenuOpen(false);
  const openMenu = () => setMenuOpen(true);

  useEffect(() => {
    let last = 0;
    const onScroll = () => {
      const y = window.scrollY;

      if (y < DOCK_SCROLL) {
        setHidden(false);
      } else {
        setHidden(y > last && y > 200);
      }

      last = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
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
      ".site-header, .wordmark-drift-layer, .chapter, .site-footer, #preloader",
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
      <header
        className={["site-header", hidden ? "hidden" : ""]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="wrap hdr-in">
          <div className="hdr-mark-slot">
            <Link href="#home" aria-label="SWAG home">
              <Wordmark className="hdr-mark-static" />
            </Link>
          </div>
          <nav className="desk" aria-label="Primary">
            {navChapters.map((chapter) => (
              <Link
                key={chapter.id}
                href={`#${chapter.id}`}
                className={activeChapter === chapter.id ? "on" : undefined}
              >
                {chapter.navLabel}
              </Link>
            ))}
          </nav>
          <button
            ref={burgerRef}
            type="button"
            className="burger"
            aria-expanded={menuOpen}
            aria-controls="menu"
            onClick={openMenu}
          >
            menu
          </button>
        </div>
      </header>

      <div
        ref={menuRef}
        id="menu"
        role="dialog"
        aria-modal="true"
        aria-labelledby="menu-label"
        className={menuOpen ? "open" : undefined}
        hidden={!menuOpen}
      >
        <div className="pre-row">
          <span id="menu-label" className="lbl">
            [ navigation ]
          </span>
          <button
            type="button"
            className="lbl lbl--sand"
            onClick={closeMenu}
          >
            close
          </button>
        </div>
        <div>
          {navChapters.map((chapter) => (
            <Link
              key={chapter.id}
              className="mi"
              href={`#${chapter.id}`}
              onClick={closeMenu}
            >
              {chapter.navLabel}
            </Link>
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
