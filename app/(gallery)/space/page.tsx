import { SpaceChapter } from "@/components/v3/chapters/SpaceChapter";
import { chapterMetadata } from "@/lib/seo";

export const metadata = chapterMetadata(
  "Space",
  "The space at CROSS WITH SWAG: standard edition, editions that close once, playlists, and the Cape Town gallery.",
  "/space",
);

export default function SpacePage() {
  return <SpaceChapter />;
}
