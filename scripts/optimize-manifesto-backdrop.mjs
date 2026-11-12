// Full-res manifesto backdrop variants from the _DSC0587 master (3264x4928), exempt from the
// archive size cap. Run: node scripts/optimize-manifesto-backdrop.mjs <path/to/_DSC0587.jpg>
import { writeFile } from "node:fs/promises";
import sharp from "sharp";

const src = process.argv[2] ?? "marcus-assets/figma-v4/archive/_DSC0587.jpg";
const dir = "public/assets/v4/archive";
const variants = [
  { w: 1200, avif: 42, webp: 62 },
  { w: 2000, avif: 42, webp: 58 },
  { w: 3200, avif: 42, webp: null },
];

for (const { w, avif, webp } of variants) {
  const base = sharp(src).rotate().resize({ width: w });
  const a = await base.clone().avif({ quality: avif, effort: 6 }).toBuffer();
  await writeFile(`${dir}/manifesto-backdrop-${w}.avif`, a);
  console.log(`avif ${w} ${a.length}`);
  if (webp) {
    const b = await base.clone().webp({ quality: webp, effort: 6 }).toBuffer();
    await writeFile(`${dir}/manifesto-backdrop-${w}.webp`, b);
    console.log(`webp ${w} ${b.length}`);
  }
}
