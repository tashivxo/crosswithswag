import { ClosingSection } from "@/components/sections/ClosingSection";
import { EditionSection } from "@/components/sections/EditionSection";
import { FooterSection } from "@/components/sections/FooterSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ManifestoSection } from "@/components/sections/ManifestoSection";
import { SwagPosterSection } from "@/components/sections/SwagPosterSection";
import { ScrollColorController } from "@/components/motion/ScrollColorController";
import { sections } from "@/lib/sections.config";

export default function Home() {
  const [
    hero,
    manifesto,
    authenticExpression,
    internalAuthority,
    presence,
    edition,
    densityWeight,
    closing,
    footer,
  ] = sections;

  return (
    <main className="page-shell">
      <ScrollColorController />
      <HeroSection section={hero} />
      <ManifestoSection section={manifesto} />
      <SwagPosterSection section={authenticExpression} />
      <SwagPosterSection section={internalAuthority} />
      <SwagPosterSection section={presence} />
      <EditionSection section={edition} />
      <SwagPosterSection section={densityWeight} />
      <ClosingSection section={closing} />
      <FooterSection section={footer} />
    </main>
  );
}
