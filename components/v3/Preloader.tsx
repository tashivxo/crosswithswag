"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

const PRELOADER_KEY = "swag:preloader-seen";

function preloaderSeen() {
  try {
    return sessionStorage.getItem(PRELOADER_KEY) === "1";
  } catch {
    return false;
  }
}

export function Preloader({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const [gone, setGone] = useState(false);
  const finishedRef = useRef(false);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    try {
      sessionStorage.setItem(PRELOADER_KEY, "1");
    } catch {
      // sessionStorage unavailable
    }
    setProgress(100);
    setGone(true);
    onComplete();
  }, [onComplete]);

  useLayoutEffect(() => {
    if (preloaderSeen()) {
      finish();
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      const timeout = window.setTimeout(finish, 0);
      return () => window.clearTimeout(timeout);
    }

    let value = 0;
    const tick = window.setInterval(() => {
      if (finishedRef.current) {
        window.clearInterval(tick);
        return;
      }
      value += Math.random() * 13 + 5;
      if (value >= 100) {
        value = 100;
        window.clearInterval(tick);
        window.setTimeout(finish, 340);
      }
      setProgress(Math.floor(value));
    }, 90);

    const fallback = window.setTimeout(() => {
      window.clearInterval(tick);
      finish();
    }, 4200);

    return () => {
      window.clearInterval(tick);
      window.clearTimeout(fallback);
    };
  }, [finish]);

  useEffect(() => {
    if (gone) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        finish();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [finish, gone]);

  if (gone) {
    return <div id="preloader" className="gone" aria-hidden="true" />;
  }

  return (
    <div
      id="preloader"
      aria-busy={!gone}
      aria-hidden={gone}
      onClick={finish}
    >
      <div className="pre-row">
        <span className="lbl">[ wearable editions ]</span>
        <button
          type="button"
          className="lbl preloader-skip"
          tabIndex={0}
          onClick={(event) => {
            event.stopPropagation();
            finish();
          }}
        >
          skip
        </button>
      </div>
      <div>
        <div className="pre-mark">SWAG</div>
        <div className="pre-bar">
          <i style={{ width: `${progress}%` }} />
        </div>
        <div className="pre-row" style={{ marginTop: 14 }}>
          <span className="lbl">cape town</span>
          <span className="lbl">edition 001 — kloofstreetnights</span>
        </div>
      </div>
    </div>
  );
}
