// SWAG V3 — copy source of truth (Marcus engineering handoff + swag-site.html)

export const meta = {
  title: "SWAG",
  description: "Wearable Editions. Each edition is conceived, released, and permanently closed.",
  ogTitle: "SWAG — Wearable Editions",
};

export const site = {
  handle: "@crosswithswag",
  instagramUrl: "https://www.instagram.com/crosswithswag/",
  email: "crosswithswag@gmail.com",
  location: "cape town",
  year: "2026",
};

export const home = {
  editionLabel: "[ EDITION 001 — KLOOFSTREETNIGHTS ]",
  est: "CAPE TOWN — EST. 2026",
  heroMark: [
    { text: "CROSS" },
    { text: "WITH", clay: true },
    { text: "SWAG" },
  ] as const,
  wearableLabel: "[ WEARABLE EDITIONS ]",
  intro:
    "each edition is one thought held in three objects. a garment. a campaign image. a framed print. conceived, released, and permanently closed.",
  ticker: [
    "edition 001 — kloofstreetnights — live",
    "we owe nothing to anyone",
    "no repeats — no reissues",
    "garment — campaign image — framed print",
    "we stop explaining — we start being",
    "six editions — one thought each",
  ],
  currentEdition: {
    title: "kloofstreetnights",
    lines: [
      "worn after the lights go down and before anyone's watching.",
      "heavy fabric. long shadows. the hours between leaving and arriving.",
      "two colourways, one night. from after hours to first light.",
    ],
  },
  structure: [
    {
      numeral: "[ i ]",
      title: "the garment",
      body: "heavyweight. single-colour screen print. made to be worn, not displayed.",
    },
    {
      numeral: "[ ii ]",
      title: "the campaign image",
      body: "the edition's world, fixed. the record of what it felt like.",
    },
    {
      numeral: "[ iii ]",
      title: "the framed print",
      body: "the campaign image as a physical art object. same world, different weight.",
    },
  ],
  manifestoTeaser: {
    display: ["OWE", "NOTHING."],
    lines: [
      "We owe nothing to anyone. We stop explaining. We stop convincing. We start being.",
      "We occupy the space of those who have already accepted themselves.",
    ],
    orb: "swag. is not a performance; it is the radical act of refusing to fragment yourself.",
  },
  whatIsSwag: {
    intro:
      "Swag is not an attitude. It is becoming whole. It takes what broke you and reconstructs something stronger.",
    dense: [
      "Represents your internal authority",
      "Upholds truth without hesitation",
      "Refuses to negotiate what is essential to you",
      "Is daily practice. Is consistency.",
      "Has density. Does not fragment.",
      "Alchemises pain. Uses ruptures to reconstruct.",
      "Has weight. Embodies a new internal movement.",
      "Simply is.",
    ],
  },
  archiveTeaser: {
    display: ["EVERY EDITION", "CLOSES."],
    body: [
      "every edition closes the moment it opens. no repeats, no reissues.",
      "we're not chasing scale. we're chasing depth.",
    ],
  },
  waitlist: {
    title: ["JOIN", "THE LIST"],
    body: "first access to each edition. one message when an edition opens. nothing else.",
    note: "email and whatsapp waitlist. no paid advertising. no hype.",
  },
  closer: {
    label: "[ nothing owing ]",
    display: ["CROSS", "WITH", "SWAG"],
  },
};

export const landing = {
  hero: {
    srTitle: "swag.",
    standardLabel: "standard edition — drops 13.11",
    shopCta: "shop the standard edition ↓",
    enterCta: "enter the site →",
    meta: "wearable editions + a space",
  },
  shop: {
    barLabel: "[ 01 — shop ]",
    barStatus: (total: number) =>
      `standard edition — ${total} shirts — drops 13.11`,
    title: "standard edition",
    lede: "nine shirts, 220gsm, 100% cotton. a homage to streetwear and the y2k era. always open.",
    specLabel: "[ the shirt ]",
    specCopy: "adult unisex, crew neck, short sleeve.",
    sizesNote: "sizes s to 3xl.",
    steps: "pick a size → add → pay. no account needed.",
    deliveryNote:
      "item price excludes delivery. paxi economy R60 · speed R110 · door-to-door R120, chosen at checkout.",
  },
};

export const productPage = {
  selectSize: "select a size",
  sizeHint: "choose a size to add this shirt to your cart.",
  soldOutSuffix: "sold out",
  soldOutIn: (size: string) => `sold out in ${size}`,
  addToCart: "add to cart →",
  notFound: "product not found.",
  kicker: (index: string, total: string) => `[ shirt ${index} of ${total} ]`,
  badge: "open year round",
  crumbAll: "all shirts",
  priceNote: "prices in zar — delivery extra",
  description:
    "a homage to streetwear and the y2k era. printed to order, packed\u00a0by\u00a0hand.",
  colourwayLabel: "colourway",
  sizeLabel: "[ size ]",
  sizeGuide: "size guide →",
  notes: {
    open: "open year round — drops friday 13 november",
    delivery:
      "item price excludes delivery. paxi economy R60 · speed R110 · door-to-door R120, chosen at checkout.",
    guest: "guest checkout — no account needed",
  },
  relatedLabel: "[ 02 — more from the standard edition ]",
  relatedAll: "all nine →",
  notify: {
    body: (size: string) =>
      `${size} is sold out. leave your email and we will tell you when it is back.`,
    emailLabel: "Email for restock notification",
    placeholder: "your email",
    submit: "notify me →",
    sent: "received — we will be in touch.",
    invalid: "enter a valid email.",
  },
  make: {
    label: "[ 03 — specification ]",
    title: ["THE", "MAKE."],
  },
  director: {
    label: "[ a message from the director ]",
    note: "[ director note — written per edition, signed. frozen on the archive record once the edition closes. ]",
    name: "— the.director",
    edition: "standard edition",
  },
};

/**
 * Commerce routes (/cart, /checkout, /order/confirmed) and the cart drawer.
 * Strings under "existing" were already live copy and are kept verbatim.
 * Strings marked NEW were written for the V4.1 commerce phase and need Marcus's sign-off.
 */
export const cartCopy = {
  label: "[ cart ]",
  count: (n: number) => `standard edition — ${n} shirt${n === 1 ? "" : "s"}`,
  title: "selected objects.",
  lineDetail: (colourway: string, size: string) =>
    `standard edition · ${colourway} · size ${size}`,
  soldOutLine: (size: string) => `sold out in ${size} — still in your cart`,
  remove: "remove",
  keepShopping: "keep shopping",
  subtotal: "subtotal",
  delivery: "delivery",
  deliveryNote: "chosen at checkout — paxi",
  note: "item prices exclude delivery. paxi economy R60 · speed R110 · door-to-door R120.",
  checkout: "continue to checkout →",
  empty: {
    lead: "nothing in here yet.",
    body: "the standard edition is always open.",
    cta: "shop the standard edition →",
  },
  drawer: {
    title: (n: number) => `[ cart — ${n} ]`,
    close: "close",
    closeLabel: "Close cart",
  },
  /** NEW: accessible names and polite live-region announcements. */
  a11y: {
    decrease: (title: string, colourway: string, size: string) =>
      `Decrease quantity for ${title}, ${colourway}, size ${size}`,
    increase: (title: string, colourway: string, size: string) =>
      `Increase quantity for ${title}, ${colourway}, size ${size}`,
    removeLabel: (title: string, colourway: string, size: string) =>
      `Remove ${title}, ${colourway}, size ${size} from cart`,
    quantity: (n: number) => `Quantity ${n}`,
    removed: (title: string, colourway: string, size: string, remaining: number) =>
      `${title}, ${colourway}, size ${size} removed. ${
        remaining === 0
          ? "Your cart is empty."
          : `${remaining} item${remaining === 1 ? "" : "s"} in your cart.`
      }`,
    quantityChanged: (title: string, size: string, quantity: number) =>
      `${title}, size ${size}: quantity ${quantity}.`,
  },
};

export const checkoutCopy = {
  label: "[ checkout ]",
  sub: "guest checkout — no account needed",
  title: "checkout.",
  contact: "[ 01 — contact ]",
  delivery: "[ 02 — delivery — paxi ]",
  payment: "[ 03 — payment ]",
  paymentOptions: [
    { id: "card", label: "card — yoco (hosted checkout)" },
    { id: "eft", label: "instant eft — payfast" },
  ],
  paymentNote:
    "card details never touch this site. an order is marked paid by the processor, not by the redirect.",
  items: (n: number) => `${n} item${n === 1 ? "" : "s"} · delivery extra`,
  /** NEW: stub payment CTA. The existing "pay → (not wired)" is split into label + note. */
  pay: "pay →",
  processing: "processing…",
  stubNote: "payment is not wired yet — nothing is charged.",
  summaryLabel: "[ your order ]",
  deliveryRow: "delivery",
  totalRow: "total",
  /** NEW: form. */
  fields: {
    name: { label: "full name", autoComplete: "name" },
    email: { label: "email", autoComplete: "email" },
    phone: { label: "phone", autoComplete: "tel" },
    address: {
      label: "delivery address or paxi pick-up point",
      autoComplete: "street-address",
    },
  },
  deliveryLegend: "delivery option",
  paymentLegend: "payment method",
  errors: {
    name: "enter your full name.",
    email: "enter a valid email.",
    phone: "enter a phone number with at least 10 digits.",
    address: "enter a delivery address or paxi pick-up point.",
  },
};

export const orderConfirmedCopy = {
  label: "[ order ]",
  state: "received",
  title: "order received.",
  body: "thank you. this is a static confirmation screen on v4_branch.",
  cta: "back to the shop →",
  /** NEW */
  numberLabel: "order number",
};

export const current = {
  editionLabel: "[ edition 001 ]",
  title: "kloofstreetnights",
  lines: [
    "worn after the lights go down and before anyone's watching.",
    "heavy fabric. long shadows. the hours between leaving and arriving.",
  ],
  intake: "no store. orders go through the form.",
  orderCue: "opens in a new tab",
  orderUrl: "https://form.jotform.com/crosswithswag/order-kloofstreetnights",
  orderSubject: "kloofstreetnights",
  clothesRightLabel: "8 looks / 8 prints",
  colourwayNote:
    "hex codes are targets, not finals. pantone / swatch match required before print.",
  spec: [
    { label: "front print", value: "A6 — chest hit" },
    { label: "back print", value: "A4 landscape — 297mm" },
    { label: "print colour", value: "muted sand #D6D1C4 — single colour screen print" },
    { label: "silhouette", value: "heavyweight, boxy" },
    { label: "garments", value: "hoodie / sweater / t-shirt" },
    { label: "edition status", value: "closes permanently — no reissue" },
    { label: "despatch", value: "paxi — economy & speed" },
  ],
  directorNote: {
    lines: [
      "this is not a season. it is a night.",
      "it opens once. it closes once. what you carry out of it is yours, and it will not be made again.",
    ],
    signOff: "— the.director",
    edition: "kloofstreetnights",
  },
};

// NEW: /archive copy from Figma 21:964 (verbatim, dashes kept). The gallery head's right label in Figma reads
// "12 FRAMES — UPLOAD IN ORDER", a designer note; it is shortened to "12 FRAMES". The director note is a
// placeholder in Figma and stays one until Marcus writes it.
export const archive = {
  label: "[ archive ]",
  labelRight: "EVERY EDITION CLOSES",
  display: "THE ARCHIVE.",
  index: {
    head: { left: "[ 01 — the editions ]", right: "SIX NAMED — ONE CLOSED" },
    rows: [
      {
        number: "001",
        name: "kloofstreetnights",
        desc: "two colourways, one night. after hours to first light.",
        state: "CLOSED",
        href: "#edition-001",
      },
      {
        number: "002",
        name: "crosswithswag — standard edition",
        desc: "a homage to streetwear and the y2k era.",
        state: "COMING SOON",
        href: "/current",
        current: true,
      },
      { number: "003", name: "atm", desc: "all that matters.", state: "IN DEVELOPMENT" },
      { number: "004", name: "octane", desc: "—", state: "IN DEVELOPMENT" },
      {
        number: "005",
        name: "mountain eater red",
        desc: "second edition. red colourway.",
        state: "IN DEVELOPMENT",
      },
      { number: "006", name: "courtside club culture", desc: "—", state: "IN DEVELOPMENT" },
    ],
    note: "edition 002 is the standard edition: always open, drops 13.11. editions 003–006 are unreleased. names are locked; dates are not announced.",
  },
  record: {
    head: { left: "[ 02 — edition 001 ]", right: "CLOSED — NO REISSUE" },
    title: "kloofstreetnights",
    thesis: "two colourways, one night. after hours to first light.",
    table: [
      { label: "STATE", value: "closed — no reissue" },
      { label: "COLOURWAYS", value: "two" },
      { label: "OBJECTS", value: "garment · campaign image · framed print" },
      { label: "GARMENTS", value: "hoodie / crewneck / t-shirt" },
      { label: "RELEASED", value: "september 2026" },
    ],
  },
  gallery: {
    head: { left: "[ 03 — gallery · edition 001 ]", right: "12 FRAMES" },
    setLabel: "more photographs from edition 001",
  },
  director: {
    label: "[ a message from the director ]",
    body: "[ director note — written per edition, signed. frozen on the archive record once the edition closes. ]",
    signOff: "— the.director",
    edition: "kloofstreetnights",
  },
  cta: {
    body: "this edition is closed. the standard edition is always open.",
    link: "SHOP THE STANDARD EDITION →",
    href: "/#shop",
  },
};

export const manifesto = {
  display: ["OWE", "NOTHING."],
  lines: [
    "We owe nothing to anyone. We stop explaining. We stop convincing. We start being.",
    "We occupy the space of those who have already accepted themselves.",
  ],
  orb: "swag. is not a performance; it is the radical act of refusing to fragment yourself.",
  homeForIndividuals: {
    label: "does not seek permission to exist",
    dense: [
      "Is rebellion",
      "Is resilience",
      "Is revolutionary",
      "Emanates presence",
      "Does not beg to be understood",
      "Does not convince",
      "Liberates",
    ],
    closing: "Speaks to be true, not approved. Says come as you are. Simply is.",
  },
  wound: {
    lines: [
      "it starts with the wound. the disconnection from yourself.",
      "we learned to need approval before we'd believe what we felt. to control how we were seen just to belong.",
      "swag is not an attitude. it is becoming whole. it takes what broke you and reconstructs something stronger.",
      "it sets boundaries without raising a voice. it does not fight. it does not explain.",
      "it simply does not need approval to exist.",
    ],
    signOff: "— the.director",
    edition: "kloofstreetnights",
    imageTag: "the carrier, not the spectator",
  },
  authenticExpression: {
    display: ["AUTHENTIC", "EXPRESSION."],
    lines: [
      "authenticity needs no gallery, no jury, no permission.",
      "it decides how the fabric falls. what it's made of. what it weighs.",
      "nothing about this edition asked to be approved.",
      "we don't dress the spectator. we dress the carrier.",
      "swag is not an accessory. it's what's left once you stop performing.",
      "no explanation. no permission. just presence.",
      "simply is.",
    ],
  },
  authority: {
    dense: home.whatIsSwag.dense,
    closing: "Commands respect without raising a voice. Communicates integrity.",
  },
  full: {
    label: "[ THE MANIFESTO ]",
    paragraphs: [
      'Swag is not a performance. Swag is individuation. It is the radical act of refusing to fragment yourself to please others. It is the internal authority that says, "I am here," without asking for permission to exist.',
      "We do not wear our hearts on our sleeves for consumption; we carry the truth on our backs. We understand that resilience is not just survival; it is alchemy. We use the ruptures of our past to reconstruct a stronger self. We welcome the pain, because we know the process of becoming whole begins there.",
      "This is a silent revolution. It does not scream to be heard. It commands respect without raising a voice. It creates a stone wall against the noise, not as punishment, but as liberation.",
      "We owe nothing to anyone. We stop explaining. We stop convincing. We start being. We occupy the space of those who have already accepted themselves.",
      "Swag has weight. Swag has density. Swag is integrity. It is the consistent refusal to negotiate what is essential.",
    ],
  },
  closer: {
    label: "[ the wearer ]",
    display: ["SILENT", "WARRIOR"],
  },
};

// V4.1 /space gallery home — Figma 398:1268 / original 21:24.
export const spacePage = {
  hero: {
    editionLabel: "[ STANDARD EDITION — 13.11 ]",
    est: "CAPE TOWN — EST. 2026",
    display: ["CROSS", "WITH", "SWAG"],
    wearableLabel: "[ MORE THAN CLOTHES ]",
    intro:
      "swag is not just clothes. a standard edition, always open. parties. recorded sessions. artist spotlights. and editions that close once.",
    links: [
      { label: "THE STANDARD EDITION", href: "/#shop" },
      { label: "THE ARCHIVE", href: "/archive" },
    ],
  },
  ticker: ["standard edition — drops 13.11"],
  standard: {
    label: "[ 01 — THE STANDARD EDITION ]",
    title: "standard edition",
    body: "a homage to streetwear and the y2k era. always open. drops 13.11.",
    range: "SEE THE RANGE",
    shop: "SHOP THE STANDARD EDITION →",
    tiles: [
      { src: "/assets/Frame_2_clean.svg", alt: "standard edition logo tile one" },
      { src: "/assets/Frame_3_clean.svg", alt: "standard edition logo tile two" },
      { src: "/assets/Frame_4_clean.svg", alt: "standard edition logo tile three" },
      { src: "/assets/Frame_5_clean.svg", alt: "standard edition logo tile four" },
    ],
  },
  space: {
    label: "[ 02 — THE SPACE ]",
    right: "PARTIES — SESSIONS — SPOTLIGHTS",
  },
  objects: [
    {
      numeral: "[ I ]",
      title: "SWAG.BASH",
      body: "the parties. a room for people done performing. hosted by swag.",
    },
    {
      numeral: "[ II ]",
      title: "BOILER ROOM SESSIONS",
      body: "recorded sessions, filmed in the room. the sound of the space, kept.",
    },
    {
      numeral: "[ III ]",
      title: "ARTIST SPOTLIGHTS",
      body: "the artists we listen to, one at a time. given the room and the night.",
    },
  ],
  editions: {
    label: "[ 03 — THE EDITIONS ]",
    right: "THREE OBJECTS — ONE THOUGHT",
    objects: home.structure,
  },
  manifesto: {
    label: "[ 04 — THE MANIFESTO ]",
    display: ["OWE", "NOTHING."],
    lines: [
      "We owe nothing to anyone. We stop explaining. We stop convincing. We start being.",
      "We occupy the space of those who have already accepted themselves.",
    ],
    cta: "READ THE MANIFESTO",
  },
  authority: {
    label: "[ 05 — AUTHORITY ]",
    display: ["WHAT IS", "SWAG?"],
    intro: home.whatIsSwag.intro,
    dense: home.whatIsSwag.dense,
  },
  archive: {
    label: "[ 06 — THE ARCHIVE ]",
    cta: "ENTER GALLERY →",
    editionsLabel: "[ 07 — THE ARCHIVE ]",
    editionsCta: "ALL EDITIONS →",
    display: ["EVERY EDITION", "CLOSES."],
    body:
      "every edition closes the moment it opens. no repeats, no reissues. the standard edition never closes. we're not chasing scale. we're chasing depth.",
    rows: [
      { number: "001", name: "kloofstreetnights", desc: "two colourways, one night. after hours to first light.", state: "CLOSED" },
      { number: "002", name: "crosswithswag — standard edition", desc: "a homage to streetwear and the y2k era.", state: "COMING SOON" },
      { number: "003", name: "atm", desc: "all that matters.", state: "IN DEVELOPMENT" },
      { number: "004", name: "octane", desc: "—", state: "IN DEVELOPMENT" },
      { number: "005", name: "mountain eater red", desc: "second edition. red colourway.", state: "IN DEVELOPMENT" },
      { number: "006", name: "courtside club culture", desc: "—", state: "IN DEVELOPMENT" },
    ],
    note:
      "edition 002 is the standard edition: always open, drops 13.11. editions 003–006 are unreleased. names are locked; dates are not announced.",
  },
  list: {
    label: "[ 08 — THE LIST ]",
    title: ["JOIN", "THE LIST"],
    body: "first access to each drop. the standard edition, swag.bash, the sessions. nothing else.",
    note: "email and whatsapp waitlist. no paid advertising. no hype.",
  },
  closer: {
    label: "[ NOTHING OWING ]",
    display: ["CROSS", "WITH", "SWAG"],
  },
  playlistPopup: {
    label: "[ NEW — PLAYLISTS ]",
    close: "[ CLOSE ]",
    display: "SOUND COMES FIRST.",
    lede: "three playlists for three moments. free to save, always open.",
    seeAll: "SEE ALL THREE PLAYLISTS →",
    notNow: "NOT NOW",
    listen: "LISTEN →",
    rows: [
      { slug: "stepwithswag" as const, name: "STEP" },
      { slug: "dalawithswag" as const, name: "DALA" },
      { slug: "freefallwithswag" as const, name: "FREEFALL" },
    ],
  },
};

// NEW: "open the set" interaction (no Figma frame). Extra photographs sit behind it.
export const imageSetCopy = {
  open: "open the set",
  close: "close the set",
  region: "more photographs from the set",
};

// NEW (Figma 21:752): display breaks over three lines and the sign-off line is "@crosswithswag".
export const contact = {
  display: ["NO", "PERMISSION", "NEEDED."],
  intro:
    "one inbox. orders, collaborations, everything. we don't need a storefront to sell you something true.",
  cards: [
    {
      numeral: "[ 01 ]",
      title: ["everything", "comes here"],
      body: "orders, collaborations, stockists, press. one inbox. we answer what matters.",
      href: "mailto:crosswithswag@gmail.com",
      go: "crosswithswag@gmail.com →",
    },
    {
      numeral: "[ 02 ]",
      title: ["this lives at", "@crosswithswag"],
      body: "the edition is announced there first. nowhere else.",
      href: site.instagramUrl,
      go: "instagram →",
      external: true,
    },
  ],
  waitlist: {
    title: ["FIRST", "ACCESS."],
    body: "one message when an edition opens. nothing else. no paid advertising, no hype.",
    note: "email + whatsapp waitlist",
  },
  signOff: {
    lines: [
      "we're not chasing scale. we're chasing depth.",
      "so here is the invitation —",
    ],
    signOff: "— the.director",
    edition: "@crosswithswag",
  },
};

// NEW: /playlists copy from Figma 21:23 frame 265:262 (verbatim, dashes kept). Display type is uppercased in CSS.
export const playlistsPage = {
  label: "[ playlists ]",
  display: ["SOUND", "COMES", "FIRST."],
  intro:
    "the playlists came before the clothes. three moments, three playlists. free to save, always open.",
  channels: [
    {
      slug: "stepwithswag",
      numeral: "[ 01 ]",
      title: ["STEP.", "GOING OUT"],
      body: "confident, pregame, hot club energy. amapiano, afrobeats, gqom, hip hop.",
      jump: "JUMP TO STEP. ↓",
    },
    {
      slug: "dalawithswag",
      numeral: "[ 02 ]",
      title: ["DALA.", "STUDY"],
      body: "for the lock in sessions. hip hop, indie, lofi, 3 step, house, afrotech.",
      jump: "JUMP TO DALA. ↓",
    },
    {
      slug: "freefallwithswag",
      numeral: "[ 03 ]",
      title: ["FREEFALL.", "CHILL"],
      body: "the drop. no plan, just the fall. neo-soul, r&b, soft amapiano, downtempo.",
      jump: "JUMP TO FREEFALL. ↓",
    },
  ],
  rows: {
    stepwithswag: {
      label: "[ 01 — GOING OUT ]",
      display: "STEP.",
      cover: ["step.", "with.", "swag."],
      body: "confident, pregame vibes, hip hop, hot club energy. amapiano, afrobeats, gqom. sounds of south ah.",
      tags: ["AMAPIANO", "AFROBEATS", "HIP HOP", "GQOM"],
      open: "OPEN STEPWITHSWAG. IN SPOTIFY →",
    },
    dalawithswag: {
      label: "[ 02 — STUDY ]",
      display: "DALA.",
      cover: ["dala.", "with.", "swag."],
      body: "for the lock in sessions. hip hop, indie, lofi, 3 step, house, edm, afrotech.",
      tags: ["HIP HOP", "INDIE", "LOFI", "3 STEP", "HOUSE", "AFROTECH"],
      open: "OPEN DALAWITHSWAG. IN SPOTIFY →",
    },
    freefallwithswag: {
      label: "[ 03 — CHILL ]",
      display: "FREEFALL.",
      cover: ["freefall.", "with.", "swag."],
      body: "the drop. no plan, just the fall. chill. decompression, warmth. neo-soul, r&b, soft amapiano, downtempo.",
      tags: ["NEO-SOUL", "R&B", "SOFT AMAPIANO", "DOWNTEMPO"],
      open: "OPEN FREEFALLWITHSWAG. IN SPOTIFY →",
    },
  },
  list: {
    label: "[ the list ]",
    title: ["FIRST", "ACCESS."],
    body: "one message when an edition opens. nothing else. no paid advertising, no hype.",
    note: "email + whatsapp waitlist",
  },
};

export const footer = {
  /** Figma 21:23 footer: tagline sits under the mark. */
  tagline: "CROSS WITH SWAG",
  handle: { label: site.handle, href: site.instagramUrl },
  editions: [
    { label: "shop — standard edition", href: "/#shop" },
    { label: "archive", href: "/archive" },
  ],
  info: [
    { label: "manifesto", href: "/manifesto" },
    { label: "contact", href: "/contact" },
  ],
  meta: [
    "WEARABLE EDITIONS + A SPACE — CAPE TOWN",
    "GRISEUS REGIUS (PTY) LTD 2026",
  ],
};

// Coming-soon poster (Figma file lCZqp5HNaFCPBcWgPzAwUU, node 202:253).
// Strings marked VERIFY were not machine-readable from Figma; confirm against the Copy deck.
export const comingSoon = {
  label: "COMING SOON",
  identifier: "WEARABLE EDITIONS",
  statement: ["the next edition", "is being made."],
  emailLabel: "EMAIL ADDRESS",
  emailPlaceholder: "name@email.com",
  emailError: "enter a valid email, including @.", // VERIFY
  consentLabel: "yes, tell me when the next edition opens.", // VERIFY
  consentDetail:
    "one message when an edition opens. nothing else. you can unsubscribe at any time.", // VERIFY
  consentError: "tick the box to continue.", // VERIFY
  submit: "TELL ME WHEN IT OPENS →",
  submitting: "SENDING…",
  retry: "TRY AGAIN →",
  note: "no paid advertising. no hype.", // VERIFY
  successLabel: "SIGNED UP", // VERIFY
  successHeadline: "received.",
  successBody: "we will write once, when the next edition opens.", // VERIFY
  successNote: "nothing to buy. nothing to confirm.", // VERIFY
  failureHeadline: "that did not go through.", // VERIFY
  failureFallback: "nothing was saved. try again in a moment.", // VERIFY
  footerLeft: "CAPE TOWN — 2026", // VERIFY
  footerRight: "CROSSWITHSWAG.CO.ZA", // VERIFY
};

// NEW: 404 copy from Figma 21:618 (verbatim, curly apostrophe kept). The optional 21:9 photograph slot is a
// designer note in Figma and the Drive 404 folder is empty, so the page is type-only; `gap` is shown as a label.
export const notFoundPage = {
  label: "[ 404 ]",
  labelRight: "NOTHING LIVES AT THIS ADDRESS",
  display: ["NOT", "HERE."],
  lines: ["some things close. some were never here.", "we don\u2019t explain the gap. we point you home."],
  links: [
    { label: "SHOP THE STANDARD EDITION →", href: "/#shop" },
    { label: "THE ARCHIVE →", href: "/archive" },
    { label: "THE MANIFESTO →", href: "/manifesto" },
  ],
  gap: "[ 404 photograph — not yet supplied ]",
};
