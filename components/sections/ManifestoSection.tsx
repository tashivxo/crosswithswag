import { SectionConfig } from "@/lib/sections.config";
import { manifestoLines, manifestoV2 as manifesto } from "@/lib/copy.v2";
import { SectionShell } from "@/components/sections/SectionShell";
import { Reveal } from "@/components/motion/Reveal";

export function ManifestoSection({ section }: { section: SectionConfig }) {
  return (
    <SectionShell
      id={section.id}
      background={section.background}
      foreground={section.foreground}
      className="manifesto-section"
    >
      <div className="manifesto-layout">
        <Reveal className="label">{manifesto.heading}</Reveal>
        <div className="manifesto-copy">
          {manifestoLines.map((line, index) => (
            <Reveal key={line} delay={index * 0.04}>
              <p>{line}</p>
            </Reveal>
          ))}
          <Reveal delay={0.32}>
            <p className="manifesto-signoff">{manifesto.signOff}</p>
          </Reveal>
        </div>
      </div>
    </SectionShell>
  );
}
