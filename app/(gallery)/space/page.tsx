import type { Metadata } from "next";
import { SpaceChapter } from "@/components/v3/chapters/SpaceChapter";

export const metadata: Metadata = {
  title: "Space",
};

export default function SpacePage() {
  return <SpaceChapter />;
}
