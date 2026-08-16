import { CSSProperties, ReactNode } from "react";
import { GhostWatermark } from "@/components/ui/GhostWatermark";

type SectionShellProps = {
  id: string;
  background: string;
  foreground: string;
  ghost?: string;
  className?: string;
  children: ReactNode;
};

export function SectionShell({
  id,
  background,
  foreground,
  ghost,
  className,
  children,
}: SectionShellProps) {
  return (
    <section
      id={id}
      data-section-bg={background}
      className={["section-shell", className].filter(Boolean).join(" ")}
      style={
        {
          "--section-bg": background,
          "--section-fg": foreground,
        } as CSSProperties
      }
    >
      {ghost ? <GhostWatermark text={ghost} /> : null}
      <div className="section-inner">{children}</div>
    </section>
  );
}
