"use client";

/// <reference types="react/canary" />
import { ViewTransition } from "react";

export function ChapterTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="swag-chapter" exit="swag-chapter" default="none">
      <div className="chapter-transition">{children}</div>
    </ViewTransition>
  );
}
