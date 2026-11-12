import { existsSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import {
  archiveExtraPhotos,
  archiveGalleryFrames,
  manifestoPhotos,
  spaceSet,
  type AssetSlot,
} from "@/lib/v4/assets";

const registered: Record<string, AssetSlot[]> = {
  space: spaceSet,
  manifesto: [manifestoPhotos.frame, manifestoPhotos.alternate],
  archive: [...archiveGalleryFrames, ...archiveExtraPhotos],
};

describe("registered v4 photos", () => {
  for (const [group, slots] of Object.entries(registered)) {
    describe(group, () => {
      it("has at least one photo", () => {
        expect(slots.length).toBeGreaterThan(0);
      });

      it("every slot has a served file and non-empty alt text", () => {
        for (const slot of slots) {
          expect(slot.path.startsWith("/assets/v4/"), slot.id).toBe(true);
          expect(existsSync(join(process.cwd(), "public", slot.path)), slot.path).toBe(true);
          expect(slot.alt?.trim().length ?? 0, `${slot.id} alt`).toBeGreaterThan(8);
        }
      });

      it("every file is WebP and no longer than 2400px on its long edge", async () => {
        for (const slot of slots) {
          const meta = await sharp(join(process.cwd(), "public", slot.path)).metadata();
          expect(meta.format, slot.path).toBe("webp");
          expect(Math.max(meta.width ?? 0, meta.height ?? 0), slot.path).toBeLessThanOrEqual(2400);
          expect(slot.width, `${slot.id} width matches file`).toBe(meta.width);
          expect(slot.height, `${slot.id} height matches file`).toBe(meta.height);
        }
      });
    });
  }

  describe("manifesto backdrop set", () => {
    const widths = [1200, 2000, 3200];
    const formats = ["avif", "webp"] as const;
    const slot = manifestoPhotos.backdrop;

    it("is registered with alt text and the 3200w AVIF as its primary path", () => {
      expect(slot.path).toBe("/assets/v4/archive/manifesto-backdrop-3200.avif");
      expect(slot.alt?.trim().length ?? 0).toBeGreaterThan(8);
      expect(existsSync(join(process.cwd(), "public", slot.path))).toBe(true);
    });

    for (const format of formats) {
      for (const width of widths) {
        const file = `public/assets/v4/archive/manifesto-backdrop-${width}.${format}`;
        it(`${file} exists as ${format} at ${width}px wide`, async () => {
          expect(existsSync(join(process.cwd(), file)), file).toBe(true);
          const meta = await sharp(join(process.cwd(), file)).metadata();
          expect(meta.format, file).toBe(format === "avif" ? "heif" : "webp");
          expect(meta.width, file).toBe(width);
        });
      }
    }

    it("registered dimensions match the 3200w AVIF", async () => {
      const meta = await sharp(join(process.cwd(), "public", slot.path)).metadata();
      expect(slot.width).toBe(meta.width);
      expect(slot.height).toBe(meta.height);
    });
  });

  it("places all 22 archive photos exactly once: 12 gallery frames, the rest behind the set", () => {
    expect(archiveGalleryFrames).toHaveLength(12);
    const paths = [...archiveGalleryFrames, ...archiveExtraPhotos].map((slot) => slot.path);
    expect(paths).toHaveLength(22);
    expect(new Set(paths).size).toBe(22);
  });

  it("gives every gallery frame a layout kind and focal point", () => {
    for (const frame of archiveGalleryFrames) {
      expect(frame.frame, frame.id).toBeTruthy();
      expect(frame.focus, frame.id).toMatch(/^\d+% \d+%$/);
    }
  });

  it("uses unique ids inside the Space set", () => {
    const ids = spaceSet.map((slot) => slot.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
