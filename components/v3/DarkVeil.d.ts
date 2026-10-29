import type { ComponentType, HTMLAttributes } from "react";

export type DarkVeilProps = {
  color?: string;
  speed?: number;
  scale?: number;
  rotation?: number;
  flow?: number;
  warp?: number;
  variation?: number;
  brightness?: number;
  sheen?: number;
  glow?: number;
  grain?: number;
  quality?: number;
  mouseInteraction?: boolean;
  mouseStrength?: number;
  intro?: boolean;
  fade?: number;
  opacity?: number;
  lightMode?: boolean;
  paused?: boolean;
  dpr?: number;
  className?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, "color">;

export const DarkVeil: ComponentType<DarkVeilProps>;
export default DarkVeil;
