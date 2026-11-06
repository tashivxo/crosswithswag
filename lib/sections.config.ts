import { colors } from "@/lib/design-tokens";

export type ChapterId =
  | "home"
  | "space"
  | "current"
  | "archive"
  | "manifesto"
  | "playlists"
  | "contact";

export type ChapterConfig = {
  id: ChapterId;
  index: number;
  navLabel: string;
  title: string;
  path: string;
  headId: string;
  background: string;
  foreground: string;
};

export type NavItem = {
  id: string;
  navLabel: string;
  href: string;
  external?: boolean;
  /** Opens the cart drawer instead of navigating. */
  action?: "cart";
};

export function normalizePath(path: string): string {
  if (path === "/") return "/";
  return path.replace(/\/$/, "");
}

export const chapters: ChapterConfig[] = [
  {
    id: "home",
    index: 1,
    navLabel: "shop",
    title: "Shop",
    path: "/",
    headId: "home-hero",
    background: colors.voidBlack,
    foreground: colors.mutedSand,
  },
  {
    id: "space",
    index: 2,
    navLabel: "space",
    title: "Space",
    path: "/space",
    headId: "space-head",
    background: colors.voidBlack,
    foreground: colors.mutedSand,
  },
  {
    id: "current",
    index: 2,
    navLabel: "current",
    title: "Current edition",
    path: "/current",
    headId: "current-head",
    background: colors.voidBlack,
    foreground: colors.mutedSand,
  },
  {
    id: "archive",
    index: 3,
    navLabel: "archive",
    title: "Archive",
    path: "/archive",
    headId: "archive",
    background: colors.voidBlack,
    foreground: colors.mutedSand,
  },
  {
    id: "manifesto",
    index: 4,
    navLabel: "manifesto",
    title: "Manifesto",
    path: "/manifesto",
    headId: "manifesto",
    background: colors.voidBlack,
    foreground: colors.mutedSand,
  },
  {
    id: "playlists",
    index: 5,
    navLabel: "playlists",
    title: "Playlists",
    path: "/playlists",
    headId: "playlists",
    background: colors.voidBlack,
    foreground: colors.mutedSand,
  },
  {
    id: "contact",
    index: 6,
    navLabel: "contact",
    title: "Contact",
    path: "/contact",
    headId: "contact",
    background: colors.voidBlack,
    foreground: colors.mutedSand,
  },
];

export const hashRoutes: Record<string, string> = Object.fromEntries(
  chapters.map((chapter) => [`#${chapter.id}`, chapter.path]),
);

export const navItems: NavItem[] = [
  ...chapters
    .filter((chapter) => chapter.id !== "current")
    .map((chapter) => ({
      id: chapter.id,
      navLabel: chapter.navLabel,
      href: chapter.path,
    })),
  { id: "cart", navLabel: "cart", href: "/cart", action: "cart" },
];

export function chapterByPath(path: string): ChapterConfig | undefined {
  const normalized = normalizePath(path);
  return chapters.find((chapter) => chapter.path === normalized);
}

const chaptersById = Object.fromEntries(
  chapters.map((chapter) => [chapter.id, chapter]),
) as Record<ChapterId, ChapterConfig>;

export function chapterById(id: ChapterId): ChapterConfig {
  return chaptersById[id];
}
