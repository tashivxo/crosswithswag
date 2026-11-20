import type { Viewport } from "next";
import { HomeChapter } from "@/components/v3/chapters/HomeChapter";
import { homeMetadata } from "@/lib/seo";

export const metadata = homeMetadata();

export function generateViewport(): Viewport {
  return { themeColor: "#F5F3E7" };
}

export default function HomePage() {
  return <HomeChapter variant="shop" />;
}
