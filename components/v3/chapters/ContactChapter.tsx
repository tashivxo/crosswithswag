import Link from "next/link";
import { Reveal } from "@/components/v3/Reveal";
import { WaitlistForm } from "@/components/v3/WaitlistForm";
import { contact } from "@/lib/copy";

export function ContactChapter() {
  return (
    <section id="contact" className="chapter">
      <section className="wrap page-head">
        <span className="lbl">[ contact ]</span>
        <h1 className="display" style={{ marginTop: 18 }}>
          {contact.display.map((line) => (
            <span key={line}>
              {line}
              <br />
            </span>
          ))}
        </h1>
        <p className="body-copy voice" style={{ marginTop: 30 }}>
          {contact.intro}
        </p>
      </section>

      <section className="wrap pad-sm">
        <Reveal className="contact-grid">
          {contact.cards.map((card) => (
            <Link
              key={card.numeral}
              className="ccard"
              href={card.href}
              target={card.external ? "_blank" : undefined}
              rel={card.external ? "noopener noreferrer" : undefined}
            >
              <span className="lbl lbl--clay">{card.numeral}</span>
              <h3>
                {card.title.map((line) => (
                  <span key={line}>
                    {line}
                    <br />
                  </span>
                ))}
              </h3>
              <p className="voice">{card.body}</p>
              <span className="go">{card.go}</span>
            </Link>
          ))}
        </Reveal>
      </section>

      <section className="wrap pad-sm contact-list">
        <Reveal className="join">
          <div>
            <span className="lbl">[ the list ]</span>
            <h2 className="sect" style={{ marginTop: 18 }}>
              {contact.waitlist.title.map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
            </h2>
          </div>
          <div>
            <p className="body-copy voice">{contact.waitlist.body}</p>
            <WaitlistForm note={contact.waitlist.note} />
          </div>
        </Reveal>
        <Reveal className="sig contact-invite" style={{ maxWidth: "66ch" }}>
          <div className="body-copy voice">
            {contact.signOff.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <div className="sig-name voice">{contact.signOff.signOff}</div>
          <div className="sig-ed voice">{contact.signOff.edition}</div>
        </Reveal>
      </section>
    </section>
  );
}
