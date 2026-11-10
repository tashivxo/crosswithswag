import { existsSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import {
  archiveExtraPhotos,
  archiveGalleryFrames,
  archiveRecordHero,
  manifestoPhotos,
  spaceSet,
  type AssetSlot,
} from "@/lib/v4/assets";

const registered: Record<string, AssetSlot[]> = {
  space: spaceSet,
  manifesto: [manifestoPhotos.backdrop, manifestoPhotos.frame, manifestoPhotos.alternate],
  archive: [...archiveGalleryFrames, archiveRecordHero, ...archiveExtraPhotos],
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

  it("uses unique ids inside the Space set", () => {
    const ids = spaceSet.map((slot) => slot.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
