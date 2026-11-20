import { PlaylistsChapter } from "@/components/v3/chapters/PlaylistsChapter";
import { chapterMetadata } from "@/lib/seo";

export const metadata = chapterMetadata(
  "Playlists",
  "THE MIX. Dala, Step, and Freefall with Swag — editorial playlists from CROSS WITH SWAG.",
  "/playlists",
);

export default function PlaylistsPage() {
  return <PlaylistsChapter />;
}
