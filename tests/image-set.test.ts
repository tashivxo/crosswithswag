import { describe, expect, it } from "vitest";
import { imageSetOnKey } from "@/lib/v4/image-set";

describe("imageSetOnKey", () => {
  it("closes an open set on Escape and asks for focus on the trigger", () => {
    expect(imageSetOnKey(true, "Escape")).toEqual({ open: false, refocusTrigger: true });
  });

  it("ignores Escape when the set is already closed", () => {
    expect(imageSetOnKey(false, "Escape")).toEqual({ open: false, refocusTrigger: false });
  });

  it("ignores other keys", () => {
    expect(imageSetOnKey(true, "Tab")).toEqual({ open: true, refocusTrigger: false });
    expect(imageSetOnKey(true, "Enter")).toEqual({ open: true, refocusTrigger: false });
  });
});
