// Resize Marcus's archive originals (marcus-assets/figma-v4/archive, gitignored) into
// public/assets/v4/archive as ~2400px WebP with metadata stripped.
// Run: node scripts/optimize-archive.mjs
import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = "marcus-assets/figma-v4/archive";
const OUT = "public/assets/v4/archive";
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
  return `ed001-${kebab}.webp`;
}

const files = (await readdir(SRC))
  .filter((f) => /\.jpe?g$/i.test(f))
  .sort(collator.compare);

await mkdir(OUT, { recursive: true });

const rows = [];
for (const file of files) {
  const name = webName(file);
  const out = path.join(OUT, name);
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
  rows.push({ original: file, web: name, width: info.width, height: info.height, bytes: info.size, quality });
  console.log(`${file} -> ${name} ${info.width}x${info.height} ${Math.round(info.size / 1024)}KB q${quality}`);
}

await writeFile("marcus-assets/figma-v4/archive-manifest.json", JSON.stringify(rows, null, 2));
console.log(`${rows.length} files, ${Math.round(rows.reduce((n, r) => n + r.bytes, 0) / 1024)}KB total`);
