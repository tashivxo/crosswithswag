// Full-res manifesto backdrop from the _DSC0587 master (3264x4928), exempt from the
// archive size cap. Run: node scripts/optimize-manifesto-backdrop.mjs <path/to/_DSC0587.jpg>
import { writeFile } from "node:fs/promises";
import sharp from "sharp";

const src = process.argv[2] ?? "marcus-assets/figma-v4/archive/_DSC0587.jpg";
const out = "public/assets/v4/archive/manifesto-backdrop-3200.avif";
const buf = await sharp(src).rotate().resize({ width: 3200 }).avif({ quality: 42, effort: 6 }).toBuffer();
await writeFile(out, buf);
const m = await sharp(buf).metadata();
console.log(`${out} ${m.width}x${m.height} ${buf.length} bytes`);
