import { V4SiteChrome } from "@/components/v4/V4SiteChrome";

export default function GalleryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <V4SiteChrome>{children}</V4SiteChrome>;
}
