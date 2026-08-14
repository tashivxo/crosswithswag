import Link from "next/link";
import type { Edition, EditionState } from "@/lib/editions";

function StateChip({ state }: { state: EditionState }) {
  const className = `state state--${state === "in-development" ? "dev" : state}`;
  const label =
    state === "in-development" ? "in development" : state === "live" ? "live" : "closed";

  return <span className={className}>{label}</span>;
}

export function EditionRow({
  edition,
  href,
}: {
  edition: Edition;
  href?: string;
}) {
  const content = (
  <>
      <span className="no">{edition.no}</span>
      <span className="nm voice">{edition.name}</span>
      <span className="dsc voice">{edition.description}</span>
      <StateChip state={edition.state} />
    </>
  );

  if (href) {
    return (
      <Link className="arow" href={href}>
        {content}
      </Link>
    );
  }

  return <div className="arow">{content}</div>;
}
