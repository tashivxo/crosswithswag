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

    getLenis()?.stop();
    closeRef.current?.focus();
    document.addEventListener("keydown", onKeyDown);

    return () => {
      getLenis()?.start();
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
      className="pl-popup"
      role="presentation"
      data-open={open ? "true" : "false"}
      aria-hidden={!open}
      inert={!open ? true : undefined}
    >
      <button
        type="button"
        className="pl-popup__scrim"
        aria-label={copy.close}
        tabIndex={open ? 0 : -1}
        onClick={onDismiss}
      />
      <div
        ref={panelRef}
        className="pl-popup__panel"
        data-open={open ? "true" : "false"}
        role="dialog"
        aria-modal={open}
        aria-labelledby={titleId}
      >
        <header className="pl-popup__head">
          <span className="lbl">{copy.label}</span>
          <button
            ref={closeRef}
            type="button"
            className="pl-popup__close"
            onClick={onDismiss}
          >
            <span className="nav-label">{copy.close}</span>
          </button>
        </header>

        <h2 id={titleId} className="pl-popup__display">
          {copy.display}
        </h2>
        <p className="pl-popup__lede">{copy.lede}</p>

        <ul className="pl-popup__rows">
          {rows.map(({ playlist, name }) => (
            <li key={playlist.slug} className="pl-popup__row">
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

        <div className="pl-popup__actions">
          <Link
            className="pl-popup__btn pl-popup__btn--fill"
            href="/playlists"
            onClick={onDismiss}
          >
            {copy.seeAll}
          </Link>
          <button
            type="button"
            className="pl-popup__btn pl-popup__btn--outline"
            onClick={onDismiss}
          >
            {copy.notNow}
          </button>
        </div>
      </div>
    </div>
  );
}
