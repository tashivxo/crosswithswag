import { comingSoonEnabled } from "@/lib/coming-soon";
import { shortScreenInitScript } from "@/lib/short-screen";

/**
 * Settles the short-screen decision before first paint (see
 * lib/coming-soon-dock.ts). Renders nothing with the flag off.
 */
export function ShortScreenScript() {
  if (!comingSoonEnabled()) return null;
  return <script dangerouslySetInnerHTML={{ __html: shortScreenInitScript() }} />;
}
