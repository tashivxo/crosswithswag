// SWAG - Copy source of truth
// Updated per Marcus Canva whiteboard feedback (V2)

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
  "it starts with the wound. the disconnection from yourself.",
  "we learned to need approval before we'd believe what we felt. to control how we were seen just to belong.",
  "swag is not an attitude. it is becoming whole. it takes what broke you and reconstructs something stronger.",
  "it sets boundaries without raising a voice. it does not fight. it does not explain.",
  "it simply does not need approval to exist.",
] as const;

export const manifesto = {
  heading: "WEARABLE EDITIONS",
  body: manifestoLines.join("\n\n"),
  signOff: "- the director.",
};

export const swagStatements = [
  // Section 3: Authentic Expression
  "authenticity needs no gallery, no jury, no permission.",
  "it decides how the fabric falls. what it's made of. what it weighs.",
  "nothing about this edition asked to be approved.",
  "we don't dress the spectator. we dress the carrier.",
  "swag is not an accessory. it's what's left once you stop performing.",
  "no explanation. no permission. just presence.",

  // Section 4: Internal Authority (includes former density/weight statements)
  "Represents your internal authority",
  "Upholds truth without hesitation",
  "Refuses to negotiate what is essential to you",
  "Is daily practice. Is consistency.",
  "Has density. Does not fragment.",
  "Alchemises pain. Uses ruptures to reconstruct.",
  "Has weight. Embodies a new internal movement.",
] as const;

export const brandStatements = swagStatements;

export const swagModules = {
  authenticExpression: swagStatements.slice(0, 6),
  internalAuthority: swagStatements.slice(6, 13),
} as const;

/** @deprecated Use swagModules */
export const provisionalSwagModules = swagModules;

export const cta = {
  instagramHandle: "@crosswithswag",
  instagramUrl: "https://www.instagram.com/crosswithswag/",
} as const;

export const bleedWords = {
  s3: "AUTHENTIC EXPRESSION.",
  s4: "AUTHORITY",
} as const;

export const edition = {
  name: "kloofstreetnights",
  subtitle: "Wearable Edition",
  cta: "this lives at @crosswithswag.",
  ctaHref: "https://instagram.com/crosswithswag",
  showcaseAnchor: "#showcase",
  copyLines: [
    "worn after the lights go down and before anyone's watching.",
    "heavy fabric. long shadows. the hours between leaving and arriving.",
    "five colourways, one night. from after hours to first light.",
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

export const showcase = {
  label: "WEARABLE EDITIONS",
  title: "the clothes.",
  editionLink: "kloofstreetnights",
  assets: [
    "/assets/winter-drop/Artboard1.jpg",
    "/assets/winter-drop/Artboard2.jpg",
    "/assets/winter-drop/Artboard3.jpg",
    "/assets/winter-drop/Artboard4.jpg",
    "/assets/winter-drop/Artboard6.jpg",
    "/assets/winter-drop/Artboard7.jpg",
    "/assets/winter-drop/Artboard8.jpg",
    "/assets/winter-drop/Artboard10.jpg",
    "/assets/winter-drop/Artboard11.jpg",
    "/assets/winter-drop/Artboard12.jpg",
    "/assets/winter-drop/Artboard13.jpg",
    "/assets/winter-drop/Artboard14.jpg",
    "/assets/winter-drop/Artboard15.jpg",
    "/assets/winter-drop/Artboard17.jpg",
    "/assets/winter-drop/Artboard18.jpg",
    "/assets/winter-drop/Artboard19.jpg",
    "/assets/winter-drop/Artboard20.jpg",
  ],
} as const;

export const community = {
  label: "COMMUNITY",
  body: [
    "every edition closes the moment it opens. no repeats, no reissues.",
    "we're not chasing scale. we're chasing depth.",
    "this is the nothing owing.",
  ],
  cta: "join @crosswithswag",
  ctaHref: "https://www.instagram.com/crosswithswag/",
} as const;

export const close = {
  line1: "NOTHING",
  line2: "OWING.",
} as const;

export const footer = {
  handle: "@crosswithswag",
  credit: "the director.",
} as const;
