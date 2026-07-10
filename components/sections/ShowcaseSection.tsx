import Image from "next/image";
import { SectionConfig } from "@/lib/sections.config";
import { community, showcase } from "@/lib/copy";
import { SectionShell } from "@/components/sections/SectionShell";
import { CtaLink } from "@/components/ui/CtaLink";
import { Reveal } from "@/components/motion/Reveal";

export function ShowcaseSection({ section }: { section: SectionConfig }) {
  return (
    <SectionShell
      id={section.id}
      background={section.background}
      foreground={section.foreground}
      className="showcase-section"
    >
      <div className="showcase-layout">
        <header className="showcase-header">
          <Reveal className="label">{showcase.label}</Reveal>
          <Reveal delay={0.06}>
            <h2 className="headline showcase-title">{showcase.title}</h2>
          </Reveal>
          <Reveal delay={0.1} className="body-copy showcase-edition-ref">
            {showcase.editionLink}
          </Reveal>
        </header>

        <div className="showcase-gallery">
          {showcase.assets.map((src, index) => (
            <Reveal key={src} delay={0.04 + (index % 6) * 0.03} className="showcase-frame">
              <Image
                src={src}
                alt={`${showcase.editionLink} campaign photography ${index + 1}`}
                width={900}
                height={1125}
                sizes="(max-width: 767px) 50vw, 25vw"
              />
            </Reveal>
          ))}
        </div>

        <div className="showcase-community">
          <Reveal className="label">{community.label}</Reveal>
          <div className="showcase-community-copy">
            {community.body.map((line, index) => (
              <Reveal key={line} delay={0.08 + index * 0.05} className="body-copy">
                <p>{line}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.24}>
            <CtaLink href={community.ctaHref}>{community.cta}</CtaLink>
          </Reveal>
        </div>
      </div>
    </SectionShell>
  );
}
