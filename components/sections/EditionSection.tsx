import { SectionConfig } from "@/lib/sections.config";
import { cta } from "@/lib/copy";
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
          <Reveal className="label">WEARABLE EDITION</Reveal>
          <Reveal delay={0.08}>
            <h2 className="headline edition-title">kloofstreetnights</h2>
          </Reveal>
          <Reveal delay={0.16} className="body-copy">
            A wearable edition carrying a point of view.
          </Reveal>
          <Reveal delay={0.24}>
            <CtaLink href={cta.instagramUrl}>{cta.instagramHandle}</CtaLink>
          </Reveal>
        </div>
        <Reveal delay={0.12} className="edition-placeholder">
          <span className="label">Campaign imagery pending</span>
        </Reveal>
      </div>
    </SectionShell>
  );
}
