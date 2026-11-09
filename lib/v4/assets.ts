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

/**
 * Shop files in /assets/v4/shop (curated from Marcus's v41-products.zip, resized to 1600w).
 * Naming: product-{family}_{colourway}[ _view].jpg
 *   product-X.jpg          card (Figma front + back composite)
 *   product-X_front.jpg    Front / Full
 *   product-X_front-detail.jpg, product-X_back.jpg, product-X_back-detail.jpg
 *
 * DRAFT: confirm with Marcus. The zip folders are Dispatch, Orbit, Grey Department,
 * Royal Department, Pulse, Rush. There is no Super or Daily folder, so the family
 * grouping below (SUPER = rush + pulse, DAILY = grey department + royal department)
 * is inferred from the Figma landing frame 21:277 card labels, not from the zip.
 */
export const shopFileNames = {
  expressDispatchBlack: "product-express_dispatch-black.jpg",
  expressDispatchWhite: "product-express_dispatch-white.jpg",
  haloOrbitPink: "product-halo_orbit-pink.jpg",
  haloOrbitBlack: "product-halo_orbit-black.jpg",
  haloOrbitWhite: "product-halo_orbit-white.jpg",
  superRush: "product-super_rush.jpg",
  superPulse: "product-super_pulse.jpg",
  dailyGreyDepartment: "product-daily_grey-department.jpg",
  dailyRoyalDepartment: "product-daily_royal-department.jpg",
} as const;

/** Zip folder (Marcus) to catalog product. Inferred rows are DRAFT. */
export const shopZipMapping = [
  { zip: "Dispatch / Black tee", product: "express-dispatch-black" },
  { zip: "Dispatch / White tee", product: "express-dispatch-white" },
  { zip: "Orbit / White tee – Pink print", product: "halo-orbit-pink" },
  { zip: "Orbit / Black tee – White print", product: "halo-orbit-black" },
  { zip: "Orbit / White tee – Black print", product: "halo-orbit-white" },
  { zip: "Rush / White tee – Lime print", product: "super-rush", draft: "family SUPER inferred from Figma" },
  { zip: "Pulse / White tee – Pink print", product: "super-pulse", draft: "family SUPER inferred from Figma; replaces placeholder 'speed'" },
  { zip: "Grey Department / Black tee – Grey print", product: "daily-grey-department", draft: "family DAILY inferred from Figma" },
  { zip: "Royal Department / White tee – Blue print", product: "daily-royal-department", draft: "family DAILY inferred from Figma" },
] as const;

export const draftMissingAssets = {
  shop: [
    `${shopFileNames.haloOrbitWhite} (front + back card composite; card uses single front shot)`,
    `${shopFileNames.dailyGreyDepartment} (front + back card composite; card uses single front shot)`,
    `${shopFileNames.dailyRoyalDepartment} (front + back card composite; card uses single front shot)`,
    "back views: dispatch, orbit, grey department, royal department (zip has Front only)",
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
