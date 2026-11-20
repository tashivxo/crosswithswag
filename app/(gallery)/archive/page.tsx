import { ArchiveChapter } from "@/components/v3/chapters/ArchiveChapter";
import { chapterMetadata } from "@/lib/seo";

export const metadata = chapterMetadata(
  "Archive",
  "Every CROSS WITH SWAG edition closes. The archive holds kloofstreetnights and the editions that came before.",
  "/archive",
);

export default function ArchivePage() {
  return <ArchiveChapter />;
}
