import { Wordmark } from "@/components/ui/Wordmark";
import { ComingSoonForm } from "@/components/v3/ComingSoonForm";
import { comingSoon as copy } from "@/lib/copy";

export function ComingSoonChapter({ id }: { id?: string }) {
  return (
    <section id={id} className="cs" aria-labelledby="cs-statement">
      <p className="cs-label cs-label--top">{copy.label}</p>

      <div className="cs-left">
        <Wordmark className="cs-wordmark" />
        <p className="cs-identifier">{copy.identifier}</p>
        <h1 id="cs-statement" className="cs-statement">
          {copy.statement.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h1>
      </div>

      <div className="cs-right">
        <ComingSoonForm />
      </div>

      <p className="cs-label cs-footer cs-footer--left">{copy.footerLeft}</p>
      <p className="cs-label cs-footer cs-footer--right">{copy.footerRight}</p>
    </section>
  );
}
