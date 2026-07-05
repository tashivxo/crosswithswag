// SWAG - Copy source of truth
// Locked per Marcus sign-off (Phase 0 complete)
// Keep final copy here rather than scattering it through JSX.

export const meta = {
  title: "SWAG",
  description: "Wearable Editions",
  ogTitle: "SWAG — Wearable Editions",
};

export const hero = {
  wordmark: "SWAG",
  edition: "WEARABLE EDITIONS",
  tagline: "",
};

export const manifestoLines = [
  "We stopped explaining ourselves a long time ago.",
  "swag. is not a collection. It is not a drop. It is not content.",
  "Each piece exists once — conceived, made, and released into the world as a singular object. The garment. The image. The frame on your wall. All the same thoughts, held in different forms.",
  "We call them wearable editions because that is what they are. Not a product. Not merch. Objects that carry a point of view — made for the people who already know who they are.",
  "We owe nothing to anyone. We occupy the space of those who have already accepted themselves.",
  "This is not for everyone.",
  "It was never meant to be.",
] as const;

export const manifesto = {
  heading: "WEARABLE EDITIONS",
  body: manifestoLines.join("\n\n"),
  signOff: "— the director.",
};

export const swagStatements = [
  // Section 3: Authentic Expression
  "A home for individuals",
  "Does not seek permission to exist",
  "Speaks to be true, not approved",
  "Says come as you are",

  // Section 4: Internal Authority
  "Represents your internal authority",
  "Upholds truth without hesitation",
  "Refuses to negotiate what is essential to you",

  // Section 5: Presence
  "Emanates presence",
  "Does not beg to be understood",
  "Commands respect without raising a voice",

  // Section 7: Density / Weight
  "Is daily practice. Is consistency.",
  "Has density. Does not fragment.",
  "Alchemises pain. Uses ruptures to reconstruct.",
  "Has weight. Embodies a new internal movement.",
] as const;

export const brandStatements = swagStatements;

export const swagModules = {
  authenticExpression: swagStatements.slice(0, 4),
  internalAuthority: swagStatements.slice(4, 7),
  presence: swagStatements.slice(7, 10),
  densityWeight: swagStatements.slice(10, 14),
} as const;

/** @deprecated Use swagModules */
export const provisionalSwagModules = swagModules;

export const cta = {
  instagramHandle: "@crosswithswag",
  instagramUrl: "https://www.instagram.com/crosswithswag/",
} as const;

export const bleedWords = {
  s3: "EXPRESSION",
  s4: "AUTHORITY",
  s5: "PRESENCE",
  s7: "WEIGHT",
} as const;

export const edition = {
  name: "kloofstreetnights",
  subtitle: "Wearable Edition",
  cta: "this lives at @crosswithswag.",
  ctaHref: "https://instagram.com/crosswithswag",
  copyLines: [
    "kloof street nights started with a dinner. a first date night with **** — good food, good wine, better company. that's it. that's the whole story. this account, these designs — they exist for me and my people. no greater explanation is owed beyond that.",
  ],
  signOff: "-the.director",
  closingStatement: "kloofstreetnights.",
  imagery: {
    direction: "campaign photography, void black colourway",
    assets: [
      "/assets/winter-drop/Artboard1.jpg",
      "/assets/winter-drop/Artboard2.jpg",
      "/assets/winter-drop/Artboard3.jpg",
    ],
  },
} as const;

export const close = {
  line1: "NOTHING",
  line2: "OWING.",
} as const;

export const footer = {
  handle: "@crosswithswag",
  credit: "the director.",
} as const;
