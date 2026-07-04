// SWAG - Motion constants
// All animation timings and parallax ratios live here.
// Do not hardcode these values in components.

export const motion = {
  // Scroll reveal
  revealDuration: 0.7,
  revealY: 24,
  revealStagger: 0.1,
  revealEase: "power2.out",

  // Ghost watermark parallax
  ghostParallaxRatio: 0.3,

  // Background colour interpolation
  bgTransitionDuration: 0.6,

  // Lenis
  lenisDuration: 1.2,

  // Section transition style: "crossfade" | "push" | "scroll-linked"
  // TBD - awaiting Marcus sign-off
  transitionStyle: "scroll-linked" as const,
};
