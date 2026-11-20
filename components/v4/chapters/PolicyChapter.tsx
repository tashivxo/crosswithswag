import Link from "next/link";
import type { PolicyPageCopy, PolicyParagraph } from "@/lib/copy";

const SUPPORT_EMAIL = "support@crosswithswag.co.za";

function isLabeled(
  paragraph: PolicyParagraph,
): paragraph is { label: string; text: string } {
  return typeof paragraph !== "string";
}

export function PolicyChapter({ copy }: { copy: PolicyPageCopy }) {
  return (
    <section id={copy.id} className="chapter fp policy">
      <header className="fp-head" id={copy.headId} tabIndex={-1}>
        <div className="fp-in">
          <div className="mf-head">
            <span className="lbl">{copy.kicker}</span>
            <span className="lbl">{copy.meta}</span>
          </div>
          <h1 className="fp-display">{copy.display}</h1>
          <p className="fp-lead">{copy.intro}</p>
          <p className="lbl policy-updated">last updated {copy.lastUpdated}</p>
        </div>
      </header>

      <div className="fp-section policy-body">
        <div className="fp-in">
          <ol className="policy-rows">
            {copy.rows.map((row) => (
              <li key={row.numeral} className="policy-row">
                <h2 className="lbl policy-row__kicker">{row.numeral}</h2>
                <div className="policy-row__body">
                  {row.paragraphs.map((paragraph) =>
                    isLabeled(paragraph) ? (
                      <p
                        key={`${paragraph.label}-${paragraph.text}`}
                        className="policy-pair"
                      >
                        <span className="lbl policy-pair__label">
                          {paragraph.label}
                        </span>
                        {paragraph.text}
                      </p>
                    ) : (
                      <PolicyParagraphText
                        key={paragraph}
                        paragraph={paragraph}
                      />
                    ),
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function PolicyParagraphText({ paragraph }: { paragraph: string }) {
  const emailMatch = paragraph.endsWith(" →")
    ? paragraph.slice(0, -2).trim()
    : null;
  if (emailMatch && emailMatch.toLowerCase() === SUPPORT_EMAIL) {
    return (
      <p>
        <Link className="fp-link" href={`mailto:${emailMatch}`}>
          {emailMatch} →
        </Link>
      </p>
    );
  }

  return <p>{paragraph}</p>;
}