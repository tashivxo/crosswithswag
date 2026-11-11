"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { PlaylistPopup } from "@/components/v4/PlaylistPopup";

export const SPACE_PLAYLIST_POPUP_SEEN_KEY = "swag:space-playlist-popup-seen";

function readSeenInSession(): boolean {
  try {
    return sessionStorage.getItem(SPACE_PLAYLIST_POPUP_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function subscribeSessionSeen(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

function subscribeNoop() {
  return () => {};
}

export function SpacePlaylistGate() {
  const isClient = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const [dismissed, setDismissed] = useState(false);
  const seenInSession = useSyncExternalStore(
    subscribeSessionSeen,
    readSeenInSession,
    () => true,
  );

  const dismiss = useCallback(() => {
    try {
      sessionStorage.setItem(SPACE_PLAYLIST_POPUP_SEEN_KEY, "1");
    } catch {
      /* sessionStorage unavailable */
    }
    setDismissed(true);
  }, []);

  const open = isClient && !seenInSession && !dismissed;

  return <PlaylistPopup open={open} onDismiss={dismiss} />;
}
