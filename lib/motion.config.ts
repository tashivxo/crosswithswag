// SWAG — Motion Configuration
// Marcus approved: scroll-linked interpolation with slow parallax on ghost watermark
// No animation on static bleed words, no kinetic scroll effects
// Restraint-as-strategy: let the copy and garment speak

export const motion = {
  // Scroll reveal (phase 5)
  revealDuration: 0.7,
  revealY: 24,
  revealStagger: 0.1,
  revealEase: "power2.out",

  // Ghost watermark parallax (phase 5)
  // Slow parallax: 0.3x scroll speed
  ghostParallaxRatio: 0.3,

  // Background colour interpolation (phase 5)
  // Scroll-linked: smooth colour transition as user scrolls
  bgTransitionDuration: 0.6,
  bgInterpolationMode: "scroll-linked" as const,

  // Lenis smooth scroll
  lenisDuration: 1.2,
  lenisEasing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),

  // Section transition style — LOCKED per Marcus
  transitionStyle: "scroll-linked" as const,
};
