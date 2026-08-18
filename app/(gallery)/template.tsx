import { ChapterTransition } from "@/components/v3/ChapterTransition";

export default function GalleryTemplate({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ChapterTransition>{children}</ChapterTransition>;
}
