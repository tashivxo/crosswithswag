import { SectionConfig } from "@/lib/sections.config";
import { hero } from "@/lib/copy.v2";
import { SectionShell } from "@/components/sections/SectionShell";
import { Reveal } from "@/components/motion/Reveal";
import { HeroWordmarkScroll } from "@/components/motion/HeroWordmarkScroll";

export function HeroSection({ section }: { section: SectionConfig }) {
  return (
    <SectionShell
      id={section.id}
      background={section.background}
      foreground={section.foreground}
      ghost={section.ghost}
      className="hero-section"
    >
      <HeroWordmarkScroll />
      <div className="hero-layout">
        <Reveal delay={0.12} className="label hero-label">
          {hero.edition}
        </Reveal>
      </div>
    </SectionShell>
  );
}
