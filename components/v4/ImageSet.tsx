"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { imageSetCopy } from "@/lib/copy";
import { imageSetOnKey } from "@/lib/v4/image-set";
import type { AssetSlot } from "@/lib/v4/assets";

type ImageSetProps = {
  items: AssetSlot[];
  /** Accessible name for the group of photographs. */
  label?: string;
  /** Card aspect ratio as "w / h" (photographs are cropped with object-fit: cover). */
  ratio?: string;
  className?: string;
};

export function ImageSet({
  items,
  label = imageSetCopy.region,
  ratio = "2 / 3",
  className,
}: ImageSetProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const regionId = useId();

  if (items.length === 0) return null;

  return (
    <div
      className={["image-set", className].filter(Boolean).join(" ")}
      data-open={open ? "" : undefined}
      onKeyDown={(event) => {
        const next = imageSetOnKey(open, event.key);
        if (next.open !== open) setOpen(next.open);
        if (next.refocusTrigger) triggerRef.current?.focus();
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        className="btn image-set__trigger"
        aria-expanded={open}
        aria-controls={regionId}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? imageSetCopy.close : imageSetCopy.open} ({items.length})
      </button>
      <ul
        id={regionId}
        className="image-set__grid"
        role="group"
        aria-label={label}
        hidden={!open}
      >
        {items.map((item) => (
          <li
            key={item.id}
            className="image-set__item"
            style={{ aspectRatio: ratio }}
          >
            <Image
              src={item.path}
              alt={item.alt ?? ""}
              fill
              sizes="(max-width: 899px) 100vw, 33vw"
              loading="lazy"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
