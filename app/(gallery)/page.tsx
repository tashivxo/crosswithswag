import type { Viewport } from "next";
import { HomeChapter } from "@/components/v3/chapters/HomeChapter";
import { comingSoonEnabled } from "@/lib/coming-soon";

export function generateViewport(): Viewport {
  return { themeColor: comingSoonEnabled() ? "#0A0A0A" : "#F5F3E7" };
}

export default function HomePage() {
  return <HomeChapter variant="shop" />;
}
