import Link from "next/link";
import { footer } from "@/lib/copy";

export function SiteFooter() {
  return (
    <footer className="wrap site-footer">
      <div className="foot">
        <div>
          <div
            className="mark-text"
            style={{
              fontSize: "clamp(34px, 7vw, 72px)",
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
            }}
          >
            {footer.wordmark}
          </div>
          <p className="lbl" style={{ marginTop: 16 }}>{footer.tagline}</p>
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
            <Link
              key={item.href}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="foot-base">
        {footer.meta.map((item) => <span key={item}>{item}</span>)}
      </div>
    </footer>
  );
}
