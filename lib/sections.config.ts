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
 * Cream frames in V4.1 (landing, shop, space, archive, contact, playlists, commerce).
 * Manifesto is the photo surface; unknown paths use the Clay 404.
 */
export const creamSurfaceRoutes: readonly string[] = [
  "/",
  "/current",
  "/cart",
  "/checkout",
  "/order/confirmed",
  "/playlists",
  "/archive",
  "/space",
  "/contact",
];

export type SurfaceTone = "cream" | "photo" | "clay";

/** Manifesto is a full-bleed photo with cream type (Figma 21:671). */
export const photoSurfaceRoutes: readonly string[] = ["/manifesto"];

/** Cream and photo routes by path; any other path is the Clay 404 frame (Figma 21:618). */
export function surfaceTone(path: string): SurfaceTone {
  const normalized = normalizePath(path);
  if (creamSurfaceRoutes.includes(normalized)) return "cream";
  if (photoSurfaceRoutes.includes(normalized)) return "photo";
  return "clay";
}

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

/** Figma V4.1 inline header (desktop ≥900px), with PLAYLISTS always present. */
export const DESKTOP_NAV_MIN_WIDTH = 900;
export const DESKTOP_NAV_QUERY = `(min-width: ${DESKTOP_NAV_MIN_WIDTH}px)`;

const desktopChapterIds = [
  "home",
  "space",
  "playlists",
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

export function getDesktopNavItems(_path?: string): NavItem[] {
  return desktopNavItems;
}

export function isDesktopNavCurrent(item: NavItem, path: string): boolean {
  const normalized = normalizePath(path);
  if (item.action === "cart") {
    // /order/confirmed is the end of the flow: nothing in the nav is current there.
    return normalized === "/cart" || normalized.startsWith("/checkout");
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
