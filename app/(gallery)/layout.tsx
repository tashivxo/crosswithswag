import { GalleryShell } from "@/components/v4/GalleryShell";

export default function GalleryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <GalleryShell>{children}</GalleryShell>;
}
