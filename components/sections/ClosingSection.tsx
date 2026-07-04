import { SectionConfig } from "@/lib/sections.config";
import { SectionShell } from "@/components/sections/SectionShell";
import { Reveal } from "@/components/motion/Reveal";

export function ClosingSection({ section }: { section: SectionConfig }) {
  return (
    <SectionShell
      id={section.id}
      background={section.background}
      foreground={section.foreground}
      ghost={section.ghost}
      className="closing-section"
    >
      <div className="closing-layout">
        <Reveal>
          <h2 className="display closing-statement">NOTHING OWING.</h2>
        </Reveal>
      </div>
    </SectionShell>
  );
}
