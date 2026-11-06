import type { Metadata } from "next";
import { HomeChapter } from "@/components/v3/chapters/HomeChapter";

export const metadata: Metadata = {
  title: "Space",
};

export default function SpacePage() {
  return <HomeChapter variant="space" />;
}
