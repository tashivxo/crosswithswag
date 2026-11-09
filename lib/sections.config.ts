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

/**
 * Routes converted to the Figma cream surface (21:277 / 21:23). Chrome and content follow the
 * route; every other route keeps the Void surface until its own phase converts it.
 */
export const creamSurfaceRoutes: readonly string[] = ["/", "/current"];

export function isCreamSurface(path: string): boolean {
  return creamSurfaceRoutes.includes(normalizePath(path));
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

/** Overlay MENU (mobile): production V3 engine, plus cart. Playlists stays here. */
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

/** Figma V4.1 inline header (desktop ≥900px): SHOP / SPACE / ARCHIVE / MANIFESTO / CONTACT / CART. */
export const DESKTOP_NAV_MIN_WIDTH = 900;
export const DESKTOP_NAV_QUERY = `(min-width: ${DESKTOP_NAV_MIN_WIDTH}px)`;

const desktopChapterIds = [
  "home",
  "space",
  "archive",
  "manifesto",
  "contact",
] as const;

function desktopChapterItem(id: ChapterId): NavItem {
  const chapter = chapters.find((entry) => entry.id === id);
  if (!chapter) {
    throw new Error(`Missing desktop nav chapter: ${id}`);
  }
  return {
    id: chapter.id,
    navLabel: chapter.navLabel,
    href: chapter.path,
  };
}

const cartNavItem: NavItem = {
  id: "cart",
  navLabel: "cart",
  href: "/cart",
  action: "cart",
};

export const desktopNavItems: NavItem[] = [
  ...desktopChapterIds.map(desktopChapterItem),
  cartNavItem,
];

/** Figma nav, plus PLAYLISTS (before CART) only while on /playlists. */
export function getDesktopNavItems(path: string): NavItem[] {
  if (normalizePath(path) !== "/playlists") return desktopNavItems;
  return [
    ...desktopChapterIds.map(desktopChapterItem),
    desktopChapterItem("playlists"),
    cartNavItem,
  ];
}

export function isDesktopNavCurrent(item: NavItem, path: string): boolean {
  const normalized = normalizePath(path);
  if (item.action === "cart") {
    return (
      normalized === "/cart" ||
      normalized.startsWith("/checkout") ||
      normalized.startsWith("/order")
    );
  }
  if (item.href === "/") {
    return normalized === "/" || normalized.startsWith("/current");
  }
  return normalized === item.href;
}

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
