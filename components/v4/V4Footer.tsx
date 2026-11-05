import Link from "next/link";
import { Wordmark } from "@/components/ui/Wordmark";
import {
  v4FooterTagline,
  v4NavItems,
  v4VersionLabel,
} from "@/lib/v4/sections.config";

export function V4Footer() {
  return (
    <footer className="v4-footer wrap">
      <div className="v4-footer__top">
        <div>
          <Wordmark className="wordmark--footer" />
          <p className="lbl v4-footer__tagline">{v4FooterTagline}</p>
        </div>
        <div className="v4-footer__links">
          {v4NavItems
            .filter((item) => item.id !== "cart")
            .map((item) => (
              <Link key={item.id} href={item.href}>
                {item.label.toLowerCase()}
              </Link>
            ))}
          <Link href="/playlists">playlists</Link>
        </div>
      </div>
      <div className="foot-base">
        <span>{v4VersionLabel}</span>
        <span>crosswithswag.co.za</span>
      </div>
    </footer>
  );
}
