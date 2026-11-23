import type { PlaylistCurator } from "@/lib/playlists";

/** Handwritten stroke path (viewBox 0 0 100 12); pathLength enables dash draw. */
const UNDERLINE_PATH =
  "M1.5 7.2 C18 10.5, 32 4.8, 48 7.8 S76 9.2, 98.5 5.8";

type PlaylistCuratorLinkProps = {
  curator: PlaylistCurator;
};

export function PlaylistCuratorLink({ curator }: PlaylistCuratorLinkProps) {
  return (
    <a
      className="fp-curator-link"
      href={curator.href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="fp-curator-link__text">{curator.handle}</span>
      <svg
        className="fp-curator-link__mark"
        viewBox="0 0 100 12"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d={UNDERLINE_PATH}
          pathLength={100}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}