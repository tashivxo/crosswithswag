export type EditionState = "live" | "in-development" | "closed";

export interface Colourway {
  name: string;
  hex: string | null;
  locked: boolean;
  unnamed?: boolean;
}

export interface Edition {
  no: string;
  slug: string;
  name: string;
  description: string;
  state: EditionState;
  colourways?: Colourway[];
}

export const campaignArtboards = [
  1, 2, 3, 4, 6, 7, 8, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20,
] as const;

export const editions: Edition[] = [
  {
    no: "001",
    slug: "kloofstreetnights",
    name: "kloofstreetnights",
    description:
      "two colourways, one night. after hours → first light. heavyweight, single-colour sand print.",
    state: "live",
    colourways: [
      { name: "after hours", hex: "#0A0A0A", locked: true },
      { name: "first light", hex: "#EDE7D8", locked: true },
    ],
  },
  {
    no: "002",
    slug: "crosswithswag-first",
    name: "crosswithswag — first edition",
    description: "pink and green colourways.",
    state: "in-development",
  },
  {
    no: "003",
    slug: "atm",
    name: "atm",
    description: "all that matters.",
    state: "in-development",
  },
  {
    no: "004",
    slug: "octane",
    name: "octane",
    description: "—",
    state: "in-development",
  },
  {
    no: "005",
    slug: "mountain-eater-red",
    name: "mountain eater red",
    description: "crosswithswag second edition. red colourway.",
    state: "in-development",
  },
  {
    no: "006",
    slug: "courtside-club-culture",
    name: "courtside club culture",
    description: "—",
    state: "in-development",
  },
];

export const currentEdition = editions[0];
