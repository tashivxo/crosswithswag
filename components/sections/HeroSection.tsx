import { SectionConfig } from "@/lib/sections.config";
import { hero } from "@/lib/copy";
import { Wordmark } from "@/components/ui/Wordmark";
import { SectionShell } from "@/components/sections/SectionShell";
import { Reveal } from "@/components/motion/Reveal";

export function HeroSection({ section }: { section: SectionConfig }) {
  return (
    <SectionShell
      id={section.id}
      background={section.background}
      foreground={section.foreground}
      ghost={section.ghost}
    >
      <div className="hero-layout">
        <Reveal>
          <Wordmark />
        </Reveal>
        <Reveal delay={0.12} className="label hero-label">
          {hero.edition}
        </Reveal>
      </div>
    </SectionShell>
  );
}
