import type { Metadata } from "next";
import { ArchiveChapter } from "@/components/v3/chapters/ArchiveChapter";

export const metadata: Metadata = {
  title: "Archive",
};

export default function ArchivePage() {
  return <ArchiveChapter />;
}
