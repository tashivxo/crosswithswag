import Link from "next/link";
import type { PolicyPageCopy } from "@/lib/copy";

export function PolicyChapter({ copy }: { copy: PolicyPageCopy }) {
  return (
    <section id={copy.id} className="chapter fp policy">
      <header className="fp-head" id={copy.headId} tabIndex={-1}>
        <div className="fp-in">
          <div className="mf-head policy-head__labels">
            <span className="lbl">{copy.kicker}</span>
            <span className="lbl">{copy.meta}</span>
          </div>
          <h1 className="fp-display">{copy.display}</h1>
          <p className="fp-lead">{copy.intro}</p>
          <p className="lbl policy-updated">
            last updated {copy.lastUpdated}
          </p>
        </div>
      </header>

      <div className="fp-section policy-body">
        <div className="fp-in">
          <ol className="policy-rows">
            {copy.rows.map((row) => (
              <li key={row.numeral} className="policy-row">
                <span className="lbl policy-row__kicker">{row.numeral}</span>
                <h2 className="policy-row__title">{row.title}</h2>
                <div className="policy-row__body">
                  {row.paragraphs.map((paragraph) => {
                    const emailMatch = paragraph.endsWith(" →")
                      ? paragraph.slice(0, -2).trim()
                      : null;
                    const isEmailLink =
                      emailMatch &&
                      emailMatch.toLowerCase() ===
                        "support@crosswithswag.co.za";

                    if (isEmailLink) {
                      return (
                        <p key={paragraph}>
                          <Link className="fp-link" href={`mailto:${emailMatch}`}>
                            {emailMatch} →
                          </Link>
                        </p>
                      );
                    }

                    return <p key={paragraph}>{paragraph}</p>;
                  })}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}