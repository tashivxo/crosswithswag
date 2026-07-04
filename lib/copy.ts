// SWAG - Copy source of truth
// Draft 1 - pending Marcus sign-off
// Keep final copy here rather than scattering it through JSX.

export const meta = {
  title: "SWAG",
  description: "Draft 1 - pending director lock",
  ogTitle: "SWAG - Wearable Editions",
};

export const hero = {
  wordmark: "SWAG",
  edition: "WEARABLE EDITIONS",
  tagline: "",
};

export const manifestoLines = [
  "We stopped explaining ourselves a long time ago.",
  "swag. is not a collection. It is not a drop. It is not content.",
  "Each piece exists once - conceived, made, and released into the world as a singular object. The garment. The image. The frame on your wall. All the same thoughts, held in different forms.",
  "We call them wearable editions because that is what they are. Not a product. Not merch. Objects that carry a point of view - made for the people who already know who they are.",
  "We owe nothing to anyone. We occupy the space of those who have already accepted themselves.",
  "This is not for everyone.",
  "It was never meant to be.",
] as const;

export const manifesto = {
  heading: "WEARABLE EDITIONS",
  body: manifestoLines.join("\n\n"),
};

export const swagStatements = [
  "A home for individuals",
  "Does not seek permission to exist",
  "Speaks to be true, not approved",
  "Represents your internal authority",
  "Emanates presence",
  "Does not beg to be understood",
  "Commands respect without raising a voice",
  "Is daily practice. Is consistency.",
  "Has density. Does not fragment.",
  "Alchemises pain. Uses ruptures to reconstruct.",
  "Has weight. Embodies a new internal movement.",
  "Upholds truth without hesitation",
  "Refuses to negotiate what is essential to you",
  "Says come as you are",
] as const;

export const brandStatements = swagStatements;

export const provisionalSwagModules = {
  authenticExpression: [
    "A home for individuals",
    "Does not seek permission to exist",
    "Speaks to be true, not approved",
    "Says come as you are",
  ],
  internalAuthority: [
    "Represents your internal authority",
    "Upholds truth without hesitation",
    "Refuses to negotiate what is essential to you",
  ],
  presence: [
    "Emanates presence",
    "Does not beg to be understood",
    "Commands respect without raising a voice",
  ],
  densityWeight: [
    "Is daily practice. Is consistency.",
    "Has density. Does not fragment.",
    "Alchemises pain. Uses ruptures to reconstruct.",
    "Has weight. Embodies a new internal movement.",
  ],
} as const;

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
  cta: "@crosswithswag",
  ctaHref: "https://instagram.com/crosswithswag",
  copyLine: "A wearable edition carrying a point of view.",
} as const;

export const close = {
  line1: "NOTHING",
  line2: "OWING.",
} as const;

export const footer = {
  handle: "@crosswithswag",
  credit: "the director.",
} as const;
