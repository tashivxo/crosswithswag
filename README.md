# swag.

Type-led digital gallery for Wearable Editions. Not an ecommerce store.

## Setup

```bash
npm install
```

## Commands

```bash
npm run dev
```

```bash
npm run build
```

```bash
npm run lint
```

Local site: `http://localhost:3000`. Playlists: `http://localhost:3000/playlists`.

## Adding a playlist

Edit `lib/playlists.ts` and add an entry to the `playlists` array:

- `slug` - one of the locked slugs, or extend the `PlaylistSlug` union
- `title` - display name
- `description` - one short line under the title
- `spotifyId` - Spotify playlist id, or `null` for coming soon
- `cover` - local path such as `/assets/playlists/dalawithswag.jpg`, or `null` for the typographic fallback
- `curators` - Instagram handles for the curator row

Embed and open-in-spotify URLs are derived from `spotifyId`. Set `spotifyId` to `null` to keep the coming-soon path. All three v1 lists are live.

## Out of scope (v2)

OAuth PKCE, add to library, and the Spotify Web Playback SDK are not part of this site. v1 is public embeds only. No client secrets.
