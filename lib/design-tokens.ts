export const colors = {
  voidBlack: "#0A0A0A",
  stoneGrey: "#575D61",
  deepEarth: "#8C5E4A",
  mutedSand: "#D6D1C4",
} as const;

export const typeScale = {
  display: "clamp(80px, 16vw, 220px)",
  headline: "clamp(40px, 7vw, 96px)",
  statement: "clamp(24px, 4vw, 56px)",
  body: "clamp(16px, 1.5vw, 20px)",
  label: "clamp(11px, 1vw, 13px)",
} as const;

export const tracking = {
  tight: "-0.04em",
  tighter: "-0.06em",
  normal: "0em",
  open: "0.05em",
} as const;

export const spacing = {
  sectionPadX: "clamp(24px, 5vw, 80px)",
  sectionPadY: "clamp(48px, 8vh, 120px)",
} as const;
