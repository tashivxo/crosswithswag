import Link from "next/link";
import { Wordmark } from "@/components/ui/Wordmark";
import { footer } from "@/lib/copy";

export function SiteFooter() {
  return (
    <footer className="wrap site-footer">
      <div className="foot">
        <div>
          <Wordmark className="wordmark--footer" />
          <p className="lbl foot-tagline">{footer.tagline}</p>
          <a
            className="foot-handle"
            href={footer.handle.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {footer.handle.label}
          </a>
        </div>
        <div>
          <h5>editions</h5>
          {footer.editions.map((item) => (
            <Link key={item.href} href={item.href}>{item.label}</Link>
          ))}
        </div>
        <div>
          <h5>info</h5>
          {footer.info.map((item) => (
            <Link key={item.href} href={item.href}>{item.label}</Link>
          ))}
        </div>
      </div>
      <div className="foot-base">
        {footer.meta.map((item) => <span key={item}>{item}</span>)}
      </div>
    </footer>
  );
}
