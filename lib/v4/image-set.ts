export type ImageSetKeyResult = { open: boolean; refocusTrigger: boolean };

/** Escape closes an open set and returns focus to its trigger; every other key leaves it alone. */
export function imageSetOnKey(open: boolean, key: string): ImageSetKeyResult {
  if (open && key === "Escape") return { open: false, refocusTrigger: true };
  return { open, refocusTrigger: false };
}
