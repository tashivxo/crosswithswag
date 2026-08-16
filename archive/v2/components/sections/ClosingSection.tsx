import { SectionConfig } from "@/lib/sections.config";
import { close } from "@/archive/v2/lib/copy.v2";
import { SectionShell } from "@/archive/v2/components/sections/SectionShell";
import { Reveal } from "@/archive/v2/components/motion/Reveal";

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
          <h2 className="display closing-statement">
            {close.line1}
            <br />
            {close.line2}
          </h2>
        </Reveal>
      </div>
    </SectionShell>
  );
}
