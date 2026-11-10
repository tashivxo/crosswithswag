import { WaitlistForm } from "@/components/v3/WaitlistForm";
import { contact } from "@/lib/copy";

export function ContactChapter() {
  return (
    <section id="contact" className="chapter fp">
      <header className="fp-head">
        <div className="fp-in">
          <span className="lbl">[ contact ]</span>
          <h1 className="fp-display">
            {contact.display.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          <p className="fp-lead">{contact.intro}</p>
        </div>
      </header>

      <section className="fp-section fp-channels" aria-label="channels">
        <div className="fp-in">
          <ul className="fp-cards fp-cards--two">
            {contact.cards.map((card) => (
              <li key={card.numeral} className="fp-card">
                <span className="lbl lbl--clay">{card.numeral}</span>
                <h2 className="fp-card__title">
                  {card.title.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </h2>
                <p className="fp-card__body">{card.body}</p>
                <a
                  className="fp-link"
                  href={card.href}
                  target={card.external ? "_blank" : undefined}
                  rel={card.external ? "noopener noreferrer" : undefined}
                >
                  {card.go}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="fp-section fp-list" aria-labelledby="contact-list-title">
        <div className="fp-in fp-split">
          <div>
            <span className="lbl">[ the list ]</span>
            <h2 id="contact-list-title" className="fp-h2">
              {contact.waitlist.title.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>
          </div>
          <div>
            <p className="fp-lead">{contact.waitlist.body}</p>
            <WaitlistForm note={contact.waitlist.note} />
          </div>
        </div>
      </section>

      <section className="fp-invite" aria-label="the invitation">
        <div className="fp-in">
          <div className="mf-sign fp-sign">
            <div className="fp-lead fp-lead--lower">
              {contact.signOff.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <div className="fp-signoff">
              <span>{contact.signOff.signOff}</span>
              <span>{contact.signOff.edition}</span>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
