import { SectionConfig } from "@/lib/sections.config";
import { BleedDisplay } from "@/components/ui/BleedDisplay";
import { SectionShell } from "@/components/sections/SectionShell";
import { Reveal } from "@/components/motion/Reveal";

export function SwagPosterSection({ section }: { section: SectionConfig }) {
  return (
    <SectionShell
      id={section.id}
      background={section.background}
      foreground={section.foreground}
      ghost={section.ghost}
      className="swag-poster-section"
    >
      {section.bleedWord ? <BleedDisplay>{section.bleedWord}</BleedDisplay> : null}
      <div className="poster-layout">
        <Reveal className="label poster-label">{section.label}</Reveal>
        <div className="poster-statements">
          {section.statements?.map((statement, index) => (
            <Reveal
              key={statement}
              delay={index * 0.06}
              className={index === 0 ? "statement poster-primary" : "body-copy poster-support"}
            >
              {statement}
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2} className="poster-circle">
          <span>Simply is.</span>
        </Reveal>
      </div>
    </SectionShell>
  );
}
