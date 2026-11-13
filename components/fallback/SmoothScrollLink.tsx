"use client";

import type { MouseEvent } from "react";

export function SmoothScrollLink({
  targetId,
  children,
}: {
  targetId: string;
  children: React.ReactNode;
}) {
  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    const target = document.getElementById(targetId);
    if (!target) return;
    event.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    target.focus({ preventScroll: true });
    history.replaceState(null, "", `#${targetId}`);
  }
  return (
    <a className="fb-textlink" href={`#${targetId}`} onClick={onClick}>
      {children}
    </a>
  );
}
