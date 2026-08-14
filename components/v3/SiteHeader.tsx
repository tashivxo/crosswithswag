"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Wordmark } from "@/components/ui/Wordmark";
import { navChapters, type ChapterId } from "@/lib/sections.config";

export function SiteHeader({
  docked,
  activeChapter,
}: {
  docked: boolean;
  activeChapter: ChapterId;
}) {
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let last = 0;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > last && y > 200);
      last = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("locked", menuOpen);
    return () => document.body.classList.remove("locked");
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        className={["site-header", hidden ? "hidden" : ""]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="wrap hdr-in">
          <div className={`hdr-mark-slot${docked ? " docked" : ""}`}>
            <Link href="#home" aria-label="SWAG home">
              {docked ? <Wordmark /> : <span className="mark-text">SWAG</span>}
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
            type="button"
            className="burger"
            onClick={() => setMenuOpen(true)}
          >
            menu
          </button>
        </div>
      </header>

      <div id="menu" className={menuOpen ? "open" : undefined}>
        <div className="pre-row">
          <span className="lbl">[ navigation ]</span>
          <button
            type="button"
            className="lbl lbl--sand"
            onClick={() => setMenuOpen(false)}
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
              onClick={() => setMenuOpen(false)}
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
