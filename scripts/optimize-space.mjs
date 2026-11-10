// Resize Marcus's Space originals (marcus-assets/figma-v4/space, gitignored) into
// public/assets/v4/space as <=2400px WebP with metadata stripped.
// Run: node scripts/optimize-space.mjs
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = "marcus-assets/figma-v4/space";
const OUT = "public/assets/v4/space";
const LONG_EDGE = 2400;
const QUALITY = 80;
const MAX_BYTES = 500 * 1024;

const collator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });

function webName(original) {
  const stem = path.parse(original).name;
  const kebab = stem
    .toLowerCase()
    .replace(/^_+/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `space-${kebab}.webp`;
}

const files = (await readdir(SRC)).filter((f) => /\.jpe?g$/i.test(f)).sort(collator.compare);

await mkdir(OUT, { recursive: true });

for (const file of files) {
  const out = path.join(OUT, webName(file));
  let quality = QUALITY;
  let info;
  for (;;) {
    info = await sharp(path.join(SRC, file))
      .rotate()
      .resize({ width: LONG_EDGE, height: LONG_EDGE, fit: "inside", withoutEnlargement: true })
      .webp({ quality, effort: 5 })
      .toFile(out);
    if (info.size <= MAX_BYTES || quality <= 40) break;
    quality -= 5;
  }
  console.log(`${file} -> ${path.basename(out)} ${info.width}x${info.height} ${Math.round(info.size / 1024)}KB q${quality}`);
}
