import Image from "next/image";
import { SectionConfig } from "@/lib/sections.config";
import { edition } from "@/lib/copy";
import { SectionShell } from "@/components/sections/SectionShell";
import { CtaLink } from "@/components/ui/CtaLink";
import { Reveal } from "@/components/motion/Reveal";

export function EditionSection({ section }: { section: SectionConfig }) {
  return (
    <SectionShell
      id={section.id}
      background={section.background}
      foreground={section.foreground}
      className="edition-section"
    >
      <div className="edition-layout">
        <div className="edition-copy">
          <Reveal className="label">{edition.subtitle.toUpperCase()}</Reveal>
          <Reveal delay={0.08}>
            <h2 className="headline edition-title">{edition.name}</h2>
          </Reveal>
          {edition.copyLines.map((line, index) => (
            <Reveal key={line} delay={0.12 + index * 0.06} className="body-copy">
              {line}
            </Reveal>
          ))}
          <Reveal delay={0.24}>
            <p className="edition-signoff">{edition.signOff}</p>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="statement edition-closing">{edition.closingStatement}</p>
          </Reveal>
          <Reveal delay={0.36}>
            <CtaLink href={edition.ctaHref}>{edition.cta}</CtaLink>
          </Reveal>
        </div>
        <div className="edition-gallery">
          {edition.imagery.assets.map((src, index) => (
            <Reveal key={src} delay={0.12 + index * 0.08} className="edition-image">
              <Image
                src={src}
                alt={`${edition.name} void black colourway campaign photography ${index + 1}`}
                width={1200}
                height={1500}
                sizes="(max-width: 767px) 100vw, 40vw"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
