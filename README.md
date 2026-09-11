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
- `spotifyUrl` - canonical `open.spotify.com` url, or `null`
- `cover` - optional local path such as `/assets/playlists/dala.jpg`

Cover order: local `cover` wins, then Spotify oEmbed (`https://open.spotify.com/oembed?url=…`, revalidated, no client secret), then a typographic Void Black title if both fail.

Set `spotifyId` to `null` to keep the coming-soon path (no iframe, no open-in-spotify link). All three v1 lists are live.

## Out of scope (v2)

OAuth PKCE, add to library, and the Spotify Web Playback SDK are not part of this site. v1 is public embeds only. No client secrets.
