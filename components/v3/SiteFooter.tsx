import Link from "next/link";
import { footer } from "@/lib/copy";

export function SiteFooter() {
  return (
    <footer className="wrap site-footer">
      <div className="foot">
        <div className="foot-brand">
          <div className="foot-mark" role="img" aria-label="swag.">
            <div className="foot-glyph wordmark" />
          </div>
        </div>
        <div className="foot-nav">
          <nav className="foot-col" aria-labelledby="foot-editions">
            <h5 id="foot-editions">editions</h5>
            {footer.editions.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <nav className="foot-col" aria-labelledby="foot-info">
            <h5 id="foot-info">info</h5>
            {footer.info.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <nav className="foot-col" aria-labelledby="foot-support">
            <h5 id="foot-support">support</h5>
            {footer.support.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className="foot-base">
        <p className="foot-base__left">
          <span className="foot-base__lead">{footer.metaLeftLead}</span>
          <span className="foot-base__place">{footer.metaLeftPlace}</span>
        </p>
        <span className="foot-base__right">{footer.metaRight}</span>
      </div>
    </footer>
  );
}