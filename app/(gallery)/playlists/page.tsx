import type { Metadata } from "next";
import { PlaylistsChapter } from "@/components/v3/chapters/PlaylistsChapter";

export const metadata: Metadata = {
  title: "Playlists",
};

export default function PlaylistsPage() {
  return <PlaylistsChapter />;
}
