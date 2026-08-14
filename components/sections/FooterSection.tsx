import { SectionConfig } from "@/lib/sections.config";
import { cta, footerV2 as footer } from "@/lib/copy.v2";
import { SectionShell } from "@/components/sections/SectionShell";
import { CtaLink } from "@/components/ui/CtaLink";
import { Wordmark } from "@/components/ui/Wordmark";

export function FooterSection({ section }: { section: SectionConfig }) {
  return (
    <SectionShell
      id={section.id}
      background={section.background}
      foreground={section.foreground}
      className="footer-section"
    >
      <footer className="footer-layout">
        <Wordmark />
        <div className="footer-links">
          <CtaLink href={cta.instagramUrl}>{footer.handle}</CtaLink>
          <p>{footer.credit}</p>
          <p>2026</p>
        </div>
      </footer>
    </SectionShell>
  );
}
