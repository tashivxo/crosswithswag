import { colors } from "@/lib/design-tokens";

export type ChapterId = "home" | "current" | "archive" | "manifesto" | "contact";

export type ChapterConfig = {
  id: ChapterId;
  index: number;
  navLabel: string;
  title: string;
  path: string;
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
    path: "/",
    background: colors.voidBlack,
    foreground: colors.mutedSand,
  },
  {
    id: "current",
    index: 2,
    navLabel: "current",
    title: "Current edition",
    path: "/current",
    background: colors.voidBlack,
    foreground: colors.mutedSand,
  },
  {
    id: "archive",
    index: 3,
    navLabel: "archive",
    title: "Archive",
    path: "/archive",
    background: colors.voidBlack,
    foreground: colors.mutedSand,
  },
  {
    id: "manifesto",
    index: 4,
    navLabel: "manifesto",
    title: "Manifesto",
    path: "/manifesto",
    background: colors.voidBlack,
    foreground: colors.mutedSand,
  },
  {
    id: "contact",
    index: 5,
    navLabel: "contact",
    title: "Contact",
    path: "/contact",
    background: colors.voidBlack,
    foreground: colors.mutedSand,
  },
];

export const navChapters = chapters.filter((chapter) => chapter.id !== "home");

export function chapterByPath(path: string): ChapterConfig | undefined {
  const normalized = path === "/" ? "/" : path.replace(/\/$/, "");
  return chapters.find((chapter) => chapter.path === normalized);
}
