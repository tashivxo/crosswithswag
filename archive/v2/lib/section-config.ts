/** V2 section shell types — quarantined with archive/v2 components. */

export type SectionTone = "dark" | "light";

export type SectionConfig = {
  id: string;
  index: number;
  title: string;
  background: string;
  foreground: string;
  tone: SectionTone;
  label?: string;
  bleedWord?: string;
  displayHeadline?: string;
  ghost?: string;
  statements?: readonly string[];
  interactive?: boolean;
};
