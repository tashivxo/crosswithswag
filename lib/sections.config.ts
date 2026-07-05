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
  ghost?: string;
  statements?: readonly string[];
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
    bleedWord: bleedWords.s3,
    ghost: "CROSS\nWITH\nSWAG",
    statements: swagModules.authenticExpression,
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
  },
  {
    id: "presence",
    index: 5,
    title: "Presence",
    background: colors.stoneGrey,
    foreground: colors.mutedSand,
    tone: "dark",
    label: "WHAT IS SWAG?",
    bleedWord: bleedWords.s5,
    ghost: "CROSS\nWITH\nSWAG",
    statements: swagModules.presence,
  },
  {
    id: "kloofstreetnights",
    index: 6,
    title: "kloofstreetnights — Wearable Edition",
    background: colors.deepEarth,
    foreground: colors.mutedSand,
    tone: "dark",
  },
  {
    id: "density-weight",
    index: 7,
    title: "Density / Weight",
    background: colors.stoneGrey,
    foreground: colors.mutedSand,
    tone: "dark",
    label: "WHAT IS SWAG?",
    bleedWord: bleedWords.s7,
    ghost: "CROSS\nWITH\nSWAG",
    statements: swagModules.densityWeight,
  },
  {
    id: "closing",
    index: 8,
    title: "Closing Statement",
    background: colors.voidBlack,
    foreground: colors.mutedSand,
    tone: "dark",
    ghost: "NOTH-\nOWE\nING.",
  },
  {
    id: "footer",
    index: 9,
    title: "Footer",
    background: colors.voidBlack,
    foreground: colors.mutedSand,
    tone: "dark",
  },
] as const satisfies readonly SectionConfig[];

export const colorSequence = sections.map((section) => section.background);
