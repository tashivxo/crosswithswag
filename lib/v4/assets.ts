/**
 * V4.1 local asset map — paths are under /assets/v4/ only (no Figma CDN).
 * Empty path = slot reserved; see `note` for draft-missing gaps pending Marcus Drive export.
 */

export type AssetSlot = {
  id: string;
  path: string;
  note?: string;
};

const V4 = "/assets/v4";

/** Target Figma filename vs current served file (rename when Drive pack lands). */
export const shopFileNames = {
  expressDispatchBlack: "product-express_dispatch-black.jpg",
  expressDispatchWhite: "product-express_dispatch-white.jpg",
  haloOrbitPink: "product-halo_orbit-pink.jpg",
  haloOrbitBlack: "product-halo_orbit-black.jpg",
  haloOrbitWhite: "product-halo_orbit-white.jpg",
  superRush: "product-super_rush.jpg",
  superSecond: "product-super_speed.jpg", // draft-missing — VERIFY Figma export name for SUPER #2
  dailyGreyDepartment: "product-daily_grey-department.jpg",
  dailyRoyalDepartment: "product-daily_royal-department.jpg",
} as const;

export const draftMissingAssets = {
  shop: [
    shopFileNames.haloOrbitWhite,
    shopFileNames.superRush,
    shopFileNames.superSecond,
    shopFileNames.dailyGreyDepartment,
    shopFileNames.dailyRoyalDepartment,
    `${shopFileNames.expressDispatchBlack} (PDP cross print)`,
  ],
  archiveGallery: "12-frame kloofstreetnights gallery — Marcus Drive archive folder",
  space: "Campaign stills for /space sections 01–08",
  notFound: "21:9 empty-shoot frame for NOT HERE.",
} as const;

/** Edition 001 archive gallery (21:9 / 4:5 / 3:2 / 16:9 mix) — paths TBC from Drive archive pack. */
export const archiveGalleryFrames: AssetSlot[] = Array.from({ length: 12 }, (_, i) => ({
  id: `archive-ed001-${String(i + 1).padStart(2, "0")}`,
  path: "",
  note: "draft-missing — Marcus archive Drive folder (1kTH9y…)",
}));

export const spaceCampaignStills: AssetSlot[] = [
  { id: "space-hero", path: "", note: "draft-missing — V4 main Drive pack" },
  { id: "space-standard-edition", path: "", note: "draft-missing" },
  { id: "space-bash", path: "", note: "draft-missing" },
  { id: "space-boiler-room", path: "", note: "draft-missing" },
  { id: "space-artist-spotlights", path: "", note: "draft-missing" },
];

export const notFoundAsset: AssetSlot = {
  id: "404-empty-shoot",
  path: "",
  note: "draft-missing — 21:9 empty-shoot slot (NOT HERE.)",
};

export const servedV4Prefixes = {
  shop: `${V4}/shop`,
  pdp: `${V4}/pdp`,
  archive: `${V4}/archive`,
  space: `${V4}/space`,
  notFound: `${V4}/404`,
} as const;
