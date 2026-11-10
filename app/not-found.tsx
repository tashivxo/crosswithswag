import Link from "next/link";
import { GalleryShell } from "@/components/v4/GalleryShell";
import { notFoundPage } from "@/lib/copy";

export default function NotFound() {
  return (
    <GalleryShell tone="clay">
      <section className="chapter fp nf">
        <div className="fp-in">
          <div className="mf-head">
            <span className="lbl">{notFoundPage.label}</span>
            <span className="lbl">{notFoundPage.labelRight}</span>
          </div>
          <h1 className="nf-display">
            {notFoundPage.display.map((line) => (
              <span key={line} className="nf-display__line">
                {line}
              </span>
            ))}
          </h1>
          <div className="nf-copy">
            {notFoundPage.lines.map((line) => (
              <p key={line} className="fp-lead">
                {line}
              </p>
            ))}
          </div>
          <nav className="nf-links" aria-label="where to go">
            {notFoundPage.links.map((link) => (
              <Link key={link.href} className="tlink" href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="lbl nf-gap">{notFoundPage.gap}</p>
        </div>
      </section>
    </GalleryShell>
  );
}
