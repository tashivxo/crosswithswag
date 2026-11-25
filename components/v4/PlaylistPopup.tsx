"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { spacePage } from "@/lib/copy";
import { getLenis } from "@/lib/lenis";
import { playlists, type PlaylistSlug } from "@/lib/playlists";

const copy = spacePage.playlistPopup;

type PlaylistPopupProps = {
  open: boolean;
  onDismiss: () => void;
};

const slugOrder: PlaylistSlug[] = ["stepwithswag", "dalawithswag", "freefallwithswag"];

function readModalCloseMs(): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--modal-close-dur")
    .trim();
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : 150;
}

export function PlaylistPopup({ open, onDismiss }: PlaylistPopupProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<number | null>(null);
  const [closing, setClosing] = useState(false);
  const titleId = "space-playlist-popup-title";
  const visible = open || closing;

  const dismissWithMotion = useCallback(() => {
    if (closing) return;
    setClosing(true);
    const closeMs = readModalCloseMs();
    closeTimer.current = window.setTimeout(() => {
      closeTimer.current = null;
      onDismiss();
      setClosing(false);
    }, closeMs);
  }, [closing, onDismiss]);

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dismissWithMotion();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [dismissWithMotion],
  );

  useEffect(() => {
    return () => {
      if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!visible) return undefined;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    getLenis()?.stop();
    document.body.classList.add("locked");
    if (open) closeRef.current?.focus();
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      getLenis()?.start();
      document.body.classList.remove("locked");
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [visible, open, onKeyDown]);

  const rows = slugOrder
    .map((slug) => {
      const playlist = playlists.find((entry) => entry.slug === slug);
      const rowCopy = copy.rows.find((row) => row.slug === slug);
      if (!playlist || !rowCopy) return null;
      return { playlist, name: rowCopy.name };
    })
    .filter(Boolean) as {
    playlist: (typeof playlists)[number];
    name: string;
  }[];

  const panelClass = [
    "pl-popup__panel",
    "t-modal",
    closing ? "is-closing" : open ? "is-open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={closing ? "pl-popup is-closing" : "pl-popup"}
      role="presentation"
      data-open={visible ? "true" : "false"}
      aria-hidden={!visible}
      data-lenis-prevent
      inert={!visible ? true : undefined}
    >
      <button
        type="button"
        className="pl-popup__scrim"
        aria-label={copy.close}
        tabIndex={open ? 0 : -1}
        onClick={dismissWithMotion}
      />
      <div
        ref={panelRef}
        className={panelClass}
        role="dialog"
        aria-modal={visible}
        aria-labelledby={titleId}
      >
        <header className="pl-popup__head pl-popup__chunk">
          <span className="lbl">{copy.label}</span>
          <button
            ref={closeRef}
            type="button"
            className="pl-popup__close"
            onClick={dismissWithMotion}
          >
            <span className="nav-label">{copy.close}</span>
          </button>
        </header>

        <h2 id={titleId} className="pl-popup__display pl-popup__chunk">
          {copy.display}
        </h2>
        <p className="pl-popup__lede pl-popup__chunk">{copy.lede}</p>

        <ul className="pl-popup__rows">
          {rows.map(({ playlist, name }) => (
            <li key={playlist.slug} className="pl-popup__row pl-popup__chunk">
              <div className="pl-popup__cover">
                {playlist.cover ? (
                  <Image
                    src={playlist.cover}
                    alt=""
                    width={52}
                    height={52}
                    sizes="52px"
                  />
                ) : null}
              </div>
              <span className="pl-popup__name">{name}</span>
              <Link
                className="fp-link pl-popup__listen"
                href={`/playlists#${playlist.slug}`}
                onClick={onDismiss}
              >
                <span className="nav-label">{copy.listen}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="pl-popup__actions pl-popup__chunk">
          <Link
            className="btn pl-popup__btn pl-popup__btn--fill"
            href="/playlists"
            onClick={onDismiss}
          >
            {copy.seeAll}
          </Link>
          <button
            type="button"
            className="btn pl-popup__btn pl-popup__btn--outline"
            onClick={dismissWithMotion}
          >
            {copy.notNow}
          </button>
        </div>
      </div>
    </div>
  );
}
