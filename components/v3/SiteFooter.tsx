import Link from "next/link";
import { footer } from "@/lib/copy";

export function SiteFooter() {
  return (
    <footer className="wrap site-footer">
      <div className="foot">
        <div>
          <div className="foot-mark">
            <div className="foot-lockup" role="img" aria-label="swag. cross with swag" />
          </div>
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
