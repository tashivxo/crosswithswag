"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import { spacePage } from "@/lib/copy";
import { getLenis } from "@/lib/lenis";
import { playlists, type PlaylistSlug } from "@/lib/playlists";

const copy = spacePage.playlistPopup;

type PlaylistPopupProps = {
  open: boolean;
  onDismiss: () => void;
};

const slugOrder: PlaylistSlug[] = ["stepwithswag", "dalawithswag", "freefallwithswag"];

export function PlaylistPopup({ open, onDismiss }: PlaylistPopupProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = "space-playlist-popup-title";

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onDismiss();
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
    [onDismiss],
  );

  useEffect(() => {
    if (!open) return undefined;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    getLenis()?.stop();
    document.body.classList.add("locked");
    closeRef.current?.focus();
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      getLenis()?.start();
      document.body.classList.remove("locked");
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onKeyDown]);

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

  return (
    <div
      ref={panelRef}
      className="pl-popup t-panel-slide"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-hidden={!open}
      data-open={open ? "true" : "false"}
      data-lenis-prevent
      inert={!open ? true : undefined}
    >
      <header className="pre-row pl-popup__head pl-popup__chunk">
        <span className="lbl">{copy.label}</span>
        <button
          ref={closeRef}
          type="button"
          className="pl-popup__close menu-close"
          onClick={onDismiss}
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
                  width={56}
                  height={56}
                  sizes="56px"
                />
              ) : null}
            </div>
            <span className="pl-popup__name">{name}</span>
            <Link
              className="pl-popup__listen"
              href={`/playlists#${playlist.slug}`}
              onClick={onDismiss}
            >
              {copy.listen}
            </Link>
          </li>
        ))}
      </ul>

      <div className="pl-popup__actions pl-popup__chunk">
        <Link className="pl-popup__listen" href="/playlists" onClick={onDismiss}>
          {copy.seeAll}
        </Link>
        <button
          type="button"
          className="pl-popup__dismiss"
          onClick={onDismiss}
        >
          {copy.notNow}
        </button>
      </div>
    </div>
  );
}
