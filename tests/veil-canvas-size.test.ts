import { describe, expect, it } from "vitest";
import { nextVeilCanvasSize } from "@/lib/veil-canvas-size";

/*
 * iOS Safari clears a WebGL canvas whenever canvas.width / canvas.height are
 * assigned. During a touch scroll the URL bar collapse changes only height
 * (664 → 744 on an iPhone 13 Pro Max) and Safari will not present a new
 * WebGL frame until the gesture ends, so the veil goes solid black.
 *
 * On coarse pointers the buffer may grow to the largest height seen, but it
 * must not be reallocated for a height-only change. Width changes (rotation)
 * still reallocate. Desktop still tracks both axes.
 */

const phone = {
  prevWidth: 390,
  prevHeight: 664,
  nextWidth: 390,
  nextHeight: 744,
};

describe("nextVeilCanvasSize: desktop", () => {
  it("resizes the buffer when only height changes", () => {
    expect(
      nextVeilCanvasSize({ coarsePointer: false, ...phone }),
    ).toEqual({
      width: 390,
      height: 744,
      resizeBuffer: true,
    });
  });

  it("resizes the buffer when only width changes", () => {
    expect(
      nextVeilCanvasSize({
        coarsePointer: false,
        prevWidth: 1440,
        prevHeight: 900,
        nextWidth: 1280,
        nextHeight: 900,
      }),
    ).toEqual({
      width: 1280,
      height: 900,
      resizeBuffer: true,
    });
  });

  it("is a no-op when the size is unchanged, so assigning canvas.width cannot clear the buffer", () => {
    expect(
      nextVeilCanvasSize({
        coarsePointer: false,
        prevWidth: 1440,
        prevHeight: 900,
        nextWidth: 1440,
        nextHeight: 900,
      }),
    ).toEqual({
      width: 1440,
      height: 900,
      resizeBuffer: false,
    });
  });
});

describe("nextVeilCanvasSize: touch / coarse pointer", () => {
  it("never resizes the buffer when only height changes (URL bar)", () => {
    const next = nextVeilCanvasSize({ coarsePointer: true, ...phone });
    expect(next.resizeBuffer).toBe(false);
    expect(next.width).toBe(390);
  });

  it("keeps the largest height seen so the field still covers the expanded viewport", () => {
    const grew = nextVeilCanvasSize({ coarsePointer: true, ...phone });
    expect(grew.height).toBe(744);

    const shrank = nextVeilCanvasSize({
      coarsePointer: true,
      prevWidth: 390,
      prevHeight: 744,
      nextWidth: 390,
      nextHeight: 664,
    });
    expect(shrank.resizeBuffer).toBe(false);
    expect(shrank.height).toBe(744);
  });

  it("resizes when the width changes, for example on rotation", () => {
    expect(
      nextVeilCanvasSize({
        coarsePointer: true,
        prevWidth: 390,
        prevHeight: 744,
        nextWidth: 844,
        nextHeight: 390,
      }),
    ).toEqual({
      width: 844,
      height: 390,
      resizeBuffer: true,
    });
  });

  it("always sizes the buffer on the first layout", () => {
    expect(
      nextVeilCanvasSize({
        coarsePointer: true,
        prevWidth: 0,
        prevHeight: 0,
        nextWidth: 390,
        nextHeight: 744,
      }),
    ).toEqual({
      width: 390,
      height: 744,
      resizeBuffer: true,
    });
  });
});
