import { colors } from "@/lib/design-tokens";
import { bleedWords, swagModules } from "@/lib/copy";

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

export const sections = [
  {
    id: "hero",
    index: 1,
    title: "Hero / Landing",
    background: colors.voidBlack,
    foreground: colors.mutedSand,
    tone: "dark",
    ghost: "NOTH-\nOWE\nING.",
  },
  {
    id: "manifesto",
    index: 2,
    title: "Manifesto",
    background: colors.voidBlack,
    foreground: colors.mutedSand,
    tone: "dark",
  },
  {
    id: "authentic-expression",
    index: 3,
    title: "Authentic Expression",
    background: colors.voidBlack,
    foreground: colors.mutedSand,
    tone: "dark",
    label: "WHAT IS SWAG?",
    displayHeadline: bleedWords.s3,
    ghost: "CROSS\nWITH\nSWAG",
    statements: swagModules.authenticExpression,
    interactive: true,
  },
  {
    id: "internal-authority",
    index: 4,
    title: "Internal Authority",
    background: colors.mutedSand,
    foreground: colors.voidBlack,
    tone: "light",
    label: "WHAT IS SWAG?",
    bleedWord: bleedWords.s4,
    ghost: "CROSS\nWITH\nSWAG",
    statements: swagModules.internalAuthority,
    interactive: true,
  },
  {
    id: "kloofstreetnights",
    index: 5,
    title: "kloofstreetnights — Wearable Edition",
    background: colors.voidBlack,
    foreground: colors.mutedSand,
    tone: "dark",
  },
  {
    id: "showcase",
    index: 6,
    title: "Clothes Showcase / Community",
    background: colors.stoneGrey,
    foreground: colors.mutedSand,
    tone: "dark",
  },
  {
    id: "closing",
    index: 7,
    title: "Closing Statement",
    background: colors.voidBlack,
    foreground: colors.mutedSand,
    tone: "dark",
    ghost: "NOTH-\nOWE\nING.",
  },
  {
    id: "footer",
    index: 8,
    title: "Footer",
    background: colors.voidBlack,
    foreground: colors.mutedSand,
    tone: "dark",
  },
] as const satisfies readonly SectionConfig[];

export const colorSequence = sections.map((section) => section.background);
