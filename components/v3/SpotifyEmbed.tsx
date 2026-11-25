"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getLenis } from "@/lib/lenis";

type SpotifyEmbedProps = {
  title: string;
  src: string;
};

export function SpotifyEmbed({ title, src }: SpotifyEmbedProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  const activate = useCallback(() => {
    setActive(true);
  }, []);

  const deactivate = useCallback(() => {
    setActive(false);
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!active || !wrap) return;

    getLenis()?.stop();
    wrap.addEventListener("pointerleave", deactivate);

    return () => {
      wrap.removeEventListener("pointerleave", deactivate);
      getLenis()?.start();
    };
  }, [active, deactivate]);

  return (
    <div
      ref={wrapRef}
      className={active ? "fp-embed is-active" : "fp-embed"}
      {...(active ? { "data-lenis-prevent": "" } : {})}
    >
      <iframe
        title={title}
        src={src}
        width="100%"
        height={352}
        loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
        tabIndex={active ? 0 : -1}
      />
      {active ? null : (
        <div
          className="fp-embed__gate"
          role="button"
          tabIndex={0}
          aria-label={`Play or browse ${title}`}
          onClick={activate}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              activate();
            }
          }}
        />
      )}
    </div>
  );
}
