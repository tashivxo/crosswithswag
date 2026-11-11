import type { Viewport } from "next";
import { HomeChapter } from "@/components/v3/chapters/HomeChapter";

export function generateViewport(): Viewport {
  return { themeColor: "#F5F3E7" };
}

export default function HomePage() {
  return <HomeChapter variant="shop" />;
}
