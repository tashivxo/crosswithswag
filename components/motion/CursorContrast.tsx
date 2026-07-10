"use client";

import { useEffect, useRef } from "react";

type CursorContrastProps = {
  children: React.ReactNode;
  className?: string;
};

export function CursorContrast({ children, className }: CursorContrastProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const lens = lensRef.current;
    if (!root || !lens) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

    if (reduceMotion || coarsePointer) {
      return;
    }

    const radius = 120;

    const moveLens = (event: PointerEvent) => {
      const bounds = root.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      lens.style.clipPath = `circle(${radius}px at ${x}px ${y}px)`;
      lens.style.opacity = "1";
    };

    const hideLens = () => {
      lens.style.opacity = "0";
    };

    root.addEventListener("pointermove", moveLens);
    root.addEventListener("pointerleave", hideLens);

    return () => {
      root.removeEventListener("pointermove", moveLens);
      root.removeEventListener("pointerleave", hideLens);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={["cursor-contrast-root", className].filter(Boolean).join(" ")}
    >
      <div className="cursor-contrast-base">{children}</div>
      <div ref={lensRef} className="cursor-contrast-lens" aria-hidden="true">
        <div className="cursor-contrast-lens-inner">{children}</div>
      </div>
    </div>
  );
}
