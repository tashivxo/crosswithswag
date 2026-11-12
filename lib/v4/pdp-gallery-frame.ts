import { join } from "node:path";
import sharp from "sharp";
import {
  productGalleryViews,
  standardProducts,
} from "@/lib/v4/products";

/** Pixel size of the tallest PDP gallery file (every 4:5 product photo). */
export const PDP_GALLERY_ASPECT_WIDTH = 1600;
export const PDP_GALLERY_ASPECT_HEIGHT = 2000;
/** CSS `aspect-ratio` from those pixels — not a 4/5 guess. */
export const PDP_GALLERY_ASPECT_CSS = `${PDP_GALLERY_ASPECT_WIDTH} / ${PDP_GALLERY_ASPECT_HEIGHT}`;
/** Studio backdrop sampled from Front photo edges. Not cream (`#f5f3e7`) or sand. */
export const PDP_GALLERY_MAT = "#ffffff";

/** Majority colour of each Print close-up edge (full row/column). */
export const PDP_PRINT_EDGES = {
  top: "#0a0a0a",
  bottom: "#000000",
  left: "#000000",
  right: "#000000",
} as const;

/** Majority of all four Print edge pixels — not Figma tile `#141414`. */
export const PDP_PRINT_MAT = "#000000";

export function publicFileForSrc(src: string): string {
  return join(process.cwd(), "public", src.replace(/^\//, ""));
}

export type GalleryFileSize = {
  src: string;
  label: string;
  width: number;
  height: number;
};

export async function galleryViewFileSizes(): Promise<GalleryFileSize[]> {
  const seen = new Set<string>();
  const out: GalleryFileSize[] = [];
  for (const product of standardProducts) {
    for (const view of productGalleryViews(product)) {
      if (seen.has(view.src)) continue;
      seen.add(view.src);
      const meta = await sharp(publicFileForSrc(view.src)).metadata();
      out.push({
        src: view.src,
        label: view.label,
        width: meta.width ?? 0,
        height: meta.height ?? 0,
      });
    }
  }
  return out;
}

/** Greatest height/width among every product's gallery files. */
export async function tallestGalleryAspect(): Promise<{
  width: number;
  height: number;
  css: string;
  src: string;
}> {
  const views = await galleryViewFileSizes();
  if (views.length === 0) {
    throw new Error("no PDP gallery files");
  }
  let best = views[0]!;
  for (const view of views) {
    if (view.height / view.width > best.height / best.width) best = view;
  }
  return {
    width: best.width,
    height: best.height,
    css: `${best.width} / ${best.height}`,
    src: best.src,
  };
}

function pixelHex(
  data: Buffer,
  width: number,
  channels: number,
  x: number,
  y: number,
): string {
  const i = (y * width + x) * channels;
  return `#${[data[i]!, data[i + 1]!, data[i + 2]!]
    .map((n) => n.toString(16).padStart(2, "0"))
    .join("")}`;
}

/**
 * Majority colour of Front photo edges (corners + mid-sides). Print close-ups
 * are excluded — they sit on Void, not the product-photo backdrop.
 */
export async function sampleGalleryMatColour(): Promise<string> {
  const fronts = (await galleryViewFileSizes()).filter(
    (view) => view.label === "Front",
  );
  const counts = new Map<string, number>();
  for (const view of fronts) {
    const { data, info } = await sharp(publicFileForSrc(view.src))
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const w = info.width;
    const h = info.height;
    const ch = info.channels;
    const points: Array<[number, number]> = [
      [0, 0],
      [w - 1, 0],
      [0, h - 1],
      [w - 1, h - 1],
      [Math.floor(w / 2), 0],
      [Math.floor(w / 2), h - 1],
      [0, Math.floor(h / 2)],
      [w - 1, Math.floor(h / 2)],
    ];
    for (const [x, y] of points) {
      const hex = pixelHex(data, w, ch, x, y);
      counts.set(hex, (counts.get(hex) ?? 0) + 1);
    }
  }
  let best = "";
  let bestN = 0;
  for (const [hex, n] of counts) {
    if (n > bestN) {
      best = hex;
      bestN = n;
    }
  }
  return best;
}

function majorityHex(counts: Map<string, number>): string {
  let best = "";
  let bestN = 0;
  for (const [hex, n] of counts) {
    if (n > bestN) {
      best = hex;
      bestN = n;
    }
  }
  return best;
}

export type PrintEdgeColours = {
  top: string;
  bottom: string;
  left: string;
  right: string;
};

/** Majority colour of every pixel on each edge of the Print close-up. */
export async function samplePrintEdgeColours(): Promise<PrintEdgeColours> {
  const print = (await galleryViewFileSizes()).find((view) => view.label === "Print");
  if (!print) throw new Error("no Print gallery file");
  const { data, info } = await sharp(publicFileForSrc(print.src))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const ch = info.channels;
  const top = new Map<string, number>();
  const bottom = new Map<string, number>();
  const left = new Map<string, number>();
  const right = new Map<string, number>();
  for (let x = 0; x < w; x++) {
    const t = pixelHex(data, w, ch, x, 0);
    top.set(t, (top.get(t) ?? 0) + 1);
    const b = pixelHex(data, w, ch, x, h - 1);
    bottom.set(b, (bottom.get(b) ?? 0) + 1);
  }
  for (let y = 0; y < h; y++) {
    const l = pixelHex(data, w, ch, 0, y);
    left.set(l, (left.get(l) ?? 0) + 1);
    const r = pixelHex(data, w, ch, w - 1, y);
    right.set(r, (right.get(r) ?? 0) + 1);
  }
  return {
    top: majorityHex(top),
    bottom: majorityHex(bottom),
    left: majorityHex(left),
    right: majorityHex(right),
  };
}

/** Majority colour across every pixel on all four Print edges. */
export async function samplePrintMatColour(): Promise<string> {
  const print = (await galleryViewFileSizes()).find((view) => view.label === "Print");
  if (!print) throw new Error("no Print gallery file");
  const { data, info } = await sharp(publicFileForSrc(print.src))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const ch = info.channels;
  const counts = new Map<string, number>();
  const add = (x: number, y: number) => {
    const hex = pixelHex(data, w, ch, x, y);
    counts.set(hex, (counts.get(hex) ?? 0) + 1);
  };
  for (let x = 0; x < w; x++) {
    add(x, 0);
    add(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    add(0, y);
    add(w - 1, y);
  }
  return majorityHex(counts);
}
