import { ClosingSection } from "@/components/sections/ClosingSection";
import { EditionSection } from "@/components/sections/EditionSection";
import { FooterSection } from "@/components/sections/FooterSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ManifestoSection } from "@/components/sections/ManifestoSection";
import { ShowcaseSection } from "@/components/sections/ShowcaseSection";
import { SwagPosterSection } from "@/components/sections/SwagPosterSection";
import { ScrollColorController } from "@/components/motion/ScrollColorController";
import { WordmarkController } from "@/components/motion/WordmarkController";
import { sections } from "@/lib/sections.config";

export default function Home() {
  const [
    hero,
    manifesto,
    authenticExpression,
    internalAuthority,
    edition,
    showcase,
    closing,
    footer,
  ] = sections;

  return (
    <main className="page-shell">
      <ScrollColorController />
      <WordmarkController sections={sections} />
      <HeroSection section={hero} />
      <ManifestoSection section={manifesto} />
      <SwagPosterSection section={authenticExpression} />
      <SwagPosterSection section={internalAuthority} />
      <EditionSection section={edition} />
      <ShowcaseSection section={showcase} />
      <ClosingSection section={closing} />
      <FooterSection section={footer} />
    </main>
  );
}
