import { colors } from "@/lib/design-tokens";

export type ChapterId = "home" | "current" | "archive" | "manifesto" | "contact";

export type ChapterConfig = {
  id: ChapterId;
  index: number;
  navLabel: string;
  title: string;
  background: string;
  foreground: string;
};

/** @deprecated V2 section shell type — legacy components only */
export type SectionTone = "dark" | "light";

/** @deprecated V2 section shell type — legacy components only */
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

export const chapters: ChapterConfig[] = [
  {
    id: "home",
    index: 1,
    navLabel: "home",
    title: "Home",
    background: colors.voidBlack,
    foreground: colors.mutedSand,
  },
  {
    id: "current",
    index: 2,
    navLabel: "current",
    title: "Current edition",
    background: colors.voidBlack,
    foreground: colors.mutedSand,
  },
  {
    id: "archive",
    index: 3,
    navLabel: "archive",
    title: "Archive",
    background: colors.voidBlack,
    foreground: colors.mutedSand,
  },
  {
    id: "manifesto",
    index: 4,
    navLabel: "manifesto",
    title: "Manifesto",
    background: colors.voidBlack,
    foreground: colors.mutedSand,
  },
  {
    id: "contact",
    index: 5,
    navLabel: "contact",
    title: "Contact",
    background: colors.voidBlack,
    foreground: colors.mutedSand,
  },
];

export const navChapters = chapters.filter((chapter) => chapter.id !== "home");
