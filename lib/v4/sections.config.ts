export type V4RouteId =
  | "shop"
  | "space"
  | "archive"
  | "manifesto"
  | "contact"
  | "playlists"
  | "cart"
  | "checkout"
  | "orderConfirmed";

export type V4NavItem = {
  id: V4RouteId;
  label: string;
  href: string;
  showCartCount?: boolean;
};

export const v4NavItems: V4NavItem[] = [
  { id: "shop", label: "SHOP", href: "/" },
  { id: "space", label: "SPACE", href: "/space" },
  { id: "archive", label: "ARCHIVE", href: "/archive" },
  { id: "manifesto", label: "MANIFESTO", href: "/manifesto" },
  { id: "contact", label: "CONTACT", href: "/contact" },
  { id: "cart", label: "CART", href: "/cart", showCartCount: true },
];

export const v4FooterTagline = "WEARABLE EDITIONS + A SPACE — CAPE TOWN";

export const v4VersionLabel = "V4.1 DRAFT";
