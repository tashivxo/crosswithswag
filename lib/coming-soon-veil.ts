export const VEIL_QUALITY_DESKTOP = 0.55;
export const VEIL_QUALITY_TOUCH = 0.4;

/**
 * Canvas pixel ratio on coarse pointers (phones, tablets). DarkVeil otherwise
 * draws at min(devicePixelRatio, 2): 4x the pixels on a 3x iPhone, every frame
 * of the pin. The field is already rendered at 0.4x and upscaled, so the
 * composite at 1x looks the same.
 */
export const VEIL_DPR_TOUCH = 1;

/** Marcus's locked DarkVeil settings (Oct 28, 2026 handoff). Quality is chosen at runtime. */
export const COMING_SOON_VEIL_PROPS = {
  color: "#393943",
  speed: 0.65,
  scale: 1.05,
  rotation: 354,
  flow: 0.35,
  warp: 0.4,
  variation: 4,
  sheen: 0.35,
  glow: 0.2,
  brightness: 1.2,
  grain: 0.07,
  opacity: 0.7,
  mouseStrength: 1.3,
} as const;

export function resolveVeilQuality({
  coarsePointer,
  maxTouchPoints,
}: {
  coarsePointer: boolean;
  maxTouchPoints: number;
}): number {
  return coarsePointer || maxTouchPoints > 0
    ? VEIL_QUALITY_TOUCH
    : VEIL_QUALITY_DESKTOP;
}

/** DPR for DarkVeil: capped on coarse pointers, undefined (DarkVeil's default) on desktop. */
export function resolveVeilDpr({
  coarsePointer,
}: {
  coarsePointer: boolean;
}): number | undefined {
  return coarsePointer ? VEIL_DPR_TOUCH : undefined;
}
