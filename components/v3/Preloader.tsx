"use client";

import { useEffect, useState } from "react";

export function Preloader({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const finish = () => {
      setProgress(100);
      setGone(true);
      onComplete();
    };

    if (reduceMotion) {
      const timeout = window.setTimeout(finish, 0);
      return () => window.clearTimeout(timeout);
    }

    let value = 0;
    const tick = window.setInterval(() => {
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
  }, [onComplete]);

  return (
    <div
      id="preloader"
      className={gone ? "gone" : undefined}
      aria-busy={!gone}
      aria-hidden={gone}
    >
      <div className="pre-row">
        <span className="lbl">[ wearable editions ]</span>
        <span className="lbl">{String(progress).padStart(3, "0")}</span>
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
