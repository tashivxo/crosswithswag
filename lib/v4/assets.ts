/**
 * V4.1 local asset map — paths are under /assets/v4/ only (no Figma CDN).
 * Empty path = slot reserved; see `note` for draft-missing gaps pending Marcus Drive export.
 */

export type AssetSlot = {
  id: string;
  path: string;
  note?: string;
  /** Pixel size of the served web file, so layouts can pick object-fit per slot. */
  width?: number;
  height?: number;
  /** Alt text for photographs (required for every registered photo; see tests/v4-assets.test.ts). */
  alt?: string;
  /** Marcus's original filename (see marcus-assets/figma-v4/README.md). */
  original?: string;
};

const V4 = "/assets/v4";

/**
 * Shop files in /assets/v4/shop (curated from Marcus's v41-products.zip, resized to 1600w).
 * Naming: product-{family}_{colourway}[ _view].jpg
 *   product-X.jpg          card (Figma front + back composite)
 *   product-X_front.jpg    Front / Full
 *   product-X_front-detail.jpg, product-X_back.jpg, product-X_back-detail.jpg
 *
 * The zip folders are Dispatch, Orbit, Grey Department, Royal Department, Pulse, Rush.
 * Confirmed by Marcus (9 Nov 23:17 SAST): SUPER = Pulse (pink) + Rush (lime);
 * DAILY = Royal Department (blue) + Grey Department (black).
 * DRAFT: confirm with Marcus. Dispatch and Orbit placement (EXPRESS / HALO) and colourways.
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

/** Zip folder (Marcus) to catalog product. Dispatch and Orbit rows are DRAFT. */
export const shopZipMapping = [
  { zip: "Dispatch / Black tee", product: "express-dispatch-black" },
  { zip: "Dispatch / White tee", product: "express-dispatch-white" },
  { zip: "Orbit / White tee – Pink print", product: "halo-orbit-pink" },
  { zip: "Orbit / Black tee – White print", product: "halo-orbit-black" },
  { zip: "Orbit / White tee – Black print", product: "halo-orbit-white" },
  { zip: "Rush / White tee – Lime print", product: "super-rush" },
  { zip: "Pulse / White tee – Pink print", product: "super-pulse" },
  { zip: "Grey Department / Black tee – Grey print", product: "daily-grey-department" },
  { zip: "Royal Department / White tee – Blue print", product: "daily-royal-department" },
] as const;

export const draftMissingAssets = {
  shop: [
    `${shopFileNames.haloOrbitWhite} (front + back card composite; card uses single front shot)`,
    `${shopFileNames.dailyGreyDepartment} (front + back card composite; card uses single front shot)`,
    `${shopFileNames.dailyRoyalDepartment} (front + back card composite; card uses single front shot)`,
    "back views: dispatch, orbit, grey department, royal department (zip has Front only)",
  ],
  archiveGallery:
    "none missing: 22 photos wired. Slot order, record/hero choice and extras are DRAFT: confirm with Marcus",
  space: "5 of 10 Space photos missing (Drive download cap): _DSC0448, _DSC0673, _DSC0677, KSN (35), KSN (39)",
  notFound: "21:9 empty-shoot frame for NOT HERE.",
} as const;

/**
 * Marcus's 22 edition 001 archive photos, resized to <=2400px WebP (scripts/optimize-archive.mjs).
 * Order is the original-filename order (_DSC… then KSN…), NOT a Figma order.
 * DRAFT: confirm with Marcus which photo belongs in which gallery frame, the record/hero slot, and the extras.
 * Most files are portrait (about 2:3) and only KSN (23) / KSN (27) are 3:2 landscape, so the Figma 21:9 / 4:5 /
 * 3:2 / 16:9 frame ratios are applied with object-fit: cover until the order is confirmed.
 */
const archivePhotoSlots: AssetSlot[] = [
  { id: "archive-ed001-photo-01", original: "_DSC0355.jpg", path: `${V4}/archive/ed001-dsc0355.webp`, width: 1590, height: 2400 },
  { id: "archive-ed001-photo-02", original: "_DSC0403.jpg", path: `${V4}/archive/ed001-dsc0403.webp`, width: 1590, height: 2400 },
  { id: "archive-ed001-photo-03", original: "_DSC0422.jpg", path: `${V4}/archive/ed001-dsc0422.webp`, width: 1590, height: 2400 },
  { id: "archive-ed001-photo-04", original: "_DSC0430.jpg", path: `${V4}/archive/ed001-dsc0430.webp`, width: 1590, height: 2400 },
  { id: "archive-ed001-photo-05", original: "_DSC0586.jpg", path: `${V4}/archive/ed001-dsc0586.webp`, width: 1590, height: 2400 },
  { id: "archive-ed001-photo-06", original: "_DSC0587.jpg", path: `${V4}/archive/ed001-dsc0587.webp`, width: 1590, height: 2400 },
  { id: "archive-ed001-photo-07", original: "_DSC0610.jpg", path: `${V4}/archive/ed001-dsc0610.webp`, width: 1590, height: 2400 },
  { id: "archive-ed001-photo-08", original: "_DSC0614.jpg", path: `${V4}/archive/ed001-dsc0614.webp`, width: 1590, height: 2400 },
  { id: "archive-ed001-photo-09", original: "_DSC0631-3.jpg", path: `${V4}/archive/ed001-dsc0631-3.webp`, width: 1445, height: 2400 },
  { id: "archive-ed001-photo-10", original: "_DSC0632.jpg", path: `${V4}/archive/ed001-dsc0632.webp`, width: 1590, height: 2400 },
  { id: "archive-ed001-photo-11", original: "_DSC0681.jpg", path: `${V4}/archive/ed001-dsc0681.webp`, width: 1590, height: 2400 },
  { id: "archive-ed001-photo-12", original: "_DSC0684.jpg", path: `${V4}/archive/ed001-dsc0684.webp`, width: 1590, height: 2400 },
  { id: "archive-ed001-photo-13", original: "_DSC0699.jpg", path: `${V4}/archive/ed001-dsc0699.webp`, width: 1590, height: 2400 },
  { id: "archive-ed001-photo-14", original: "_DSC0738.jpg", path: `${V4}/archive/ed001-dsc0738.webp`, width: 1590, height: 2400 },
  { id: "archive-ed001-photo-15", original: "_DSC0810.jpg", path: `${V4}/archive/ed001-dsc0810.webp`, width: 1590, height: 2400 },
  { id: "archive-ed001-photo-16", original: "_DSC0836.jpg", path: `${V4}/archive/ed001-dsc0836.webp`, width: 1590, height: 2400 },
  { id: "archive-ed001-photo-17", original: "KSN (11).jpg", path: `${V4}/archive/ed001-ksn-11.webp`, width: 1991, height: 2400 },
  { id: "archive-ed001-photo-18", original: "KSN (17).jpg", path: `${V4}/archive/ed001-ksn-17.webp`, width: 1590, height: 2400 },
  { id: "archive-ed001-photo-19", original: "KSN (23).jpg", path: `${V4}/archive/ed001-ksn-23.webp`, width: 2400, height: 1590 },
  { id: "archive-ed001-photo-20", original: "KSN (27).jpg", path: `${V4}/archive/ed001-ksn-27.webp`, width: 2400, height: 1590 },
  { id: "archive-ed001-photo-21", original: "KSN (28).jpg", path: `${V4}/archive/ed001-ksn-28.webp`, width: 1576, height: 2400 },
  { id: "archive-ed001-photo-22", original: "KSN (42).jpg", path: `${V4}/archive/ed001-ksn-42.webp`, width: 1590, height: 2400 },
];

/** NEW: generic alt text until Marcus supplies captions (no per-photo descriptions exist yet). */
const archivePhotos: AssetSlot[] = archivePhotoSlots.map((photo, i) => ({
  ...photo,
  alt: `kloofstreetnights, edition 001: campaign photograph ${i + 1} of ${archivePhotoSlots.length}`,
}));

const DRAFT_ORDER = "DRAFT: confirm with Marcus (filename order, not Figma order)";

/** Edition 001 12-frame gallery (21:9 / 4:5 / 3:2 / 16:9 slots): photos 01-12. All 12 slots have a real file; the order is DRAFT. */
export const archiveGalleryFrames: AssetSlot[] = archivePhotos
  .slice(0, 12)
  .map((photo, i) => ({
    ...photo,
    id: `archive-ed001-${String(i + 1).padStart(2, "0")}`,
    note: DRAFT_ORDER,
  }));

/** Edition 001 record / hero slot. DRAFT: confirm with Marcus (photo 13 by filename order). */
export const archiveRecordHero: AssetSlot = {
  ...archivePhotos[12],
  id: "archive-ed001-record",
  note: DRAFT_ORDER,
};

/** Remaining photos (14-22) with no confirmed slot yet. DRAFT: confirm with Marcus. */
export const archiveExtraPhotos: AssetSlot[] = archivePhotos.slice(13).map((photo) => ({
  ...photo,
  note: "DRAFT: confirm with Marcus (no slot assigned)",
}));

/**
 * Space (no Figma frame): Marcus's Drive "Space" folder has 10 photos. Five are wired; _DSC0422, _DSC0631-3, _DSC0738
 * and KSN (28) reuse the archive WebPs (same originals), KSN (18) is new (scripts/optimize-space.mjs).
 * Missing (Drive download cap is 10 MiB): _DSC0448, _DSC0673, _DSC0677, KSN (35), KSN (39).
 * Order and hero choice are DRAFT: the first three are the main section, the rest sit behind "open the set".
 */
export const spaceSet: AssetSlot[] = [
  { id: "space-dsc0738", original: "_DSC0738.jpg", path: `${V4}/archive/ed001-dsc0738.webp`, width: 1590, height: 2400, alt: "A figure in a white tee standing on rocks above the sea at sunset" },
  { id: "space-dsc0631-3", original: "_DSC0631-3.jpg", path: `${V4}/archive/ed001-dsc0631-3.webp`, width: 1445, height: 2400, alt: "A woman in sunglasses and an oversized black tee, leaning against a stone wall" },
  { id: "space-ksn-28", original: "KSN (28).jpg", path: `${V4}/archive/ed001-ksn-28.webp`, width: 1576, height: 2400, alt: "A smiling woman in a black hoodie with white hair clips, hands clasped" },
  { id: "space-ksn-18", original: "KSN (18).jpg", path: `${V4}/space/space-ksn-18.webp`, width: 1609, height: 2279, alt: "A woman in a black hoodie with white hair clips, looking down" },
  { id: "space-dsc0422", original: "_DSC0422.jpg", path: `${V4}/archive/ed001-dsc0422.webp`, width: 1590, height: 2400, alt: "A woman in a white shirt seated at an outdoor bar table with an orange handbag" },
];

export const spaceMissingPhotos = [
  "_DSC0448.jpg",
  "_DSC0673.jpg",
  "_DSC0677.jpg",
  "KSN (35).jpg",
  "KSN (39).jpg",
] as const;

/** Manifesto: _DSC0586 and _DSC0587 reuse the archive WebPs (same originals). Figma 21:671 uses _DSC0587 for the backdrop and the frame. */
export const manifestoPhotos: Record<"backdrop" | "frame" | "alternate", AssetSlot> = {
  backdrop: { id: "manifesto-backdrop", original: "_DSC0587.jpg", path: `${V4}/archive/ed001-dsc0587.webp`, width: 1590, height: 2400, alt: "A woman crouching on granite boulders, one arm raised against the rock" },
  frame: { id: "manifesto-frame", original: "_DSC0587.jpg", path: `${V4}/archive/ed001-dsc0587.webp`, width: 1590, height: 2400, alt: "A woman crouching on granite boulders in a black tee, one arm raised against the rock" },
  alternate: { id: "manifesto-alternate", original: "_DSC0586.jpg", path: `${V4}/archive/ed001-dsc0586.webp`, width: 1590, height: 2400, alt: "A woman in a black tee crouching on granite boulders, looking out of frame" },
};

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
