import Image from "next/image";

export function CampaignFrame({
  artboard,
  index,
  tag,
}: {
  artboard: number;
  index: number;
  tag?: string;
}) {
  const src = `/assets/winter-drop/Artboard${artboard}.jpg`;

  return (
    <div className="frame">
      <Image
        src={src}
        alt={`kloofstreetnights campaign photography ${index + 1}`}
        fill
        sizes="(max-width: 768px) 50vw, 25vw"
      />
      <span className="tag">
        {tag ?? `ed.001 / ${String(index + 1).padStart(2, "0")}`}
      </span>
    </div>
  );
}

export function ImageGrid({
  artboards,
  columns = 4,
}: {
  artboards: readonly number[];
  columns?: number;
}) {
  return (
    <div
      className="grid-clothes"
      style={
        columns === 3
          ? { gridTemplateColumns: "repeat(3, 1fr)" }
          : undefined
      }
    >
      {artboards.map((artboard, index) => (
        <CampaignFrame key={artboard} artboard={artboard} index={index} />
      ))}
    </div>
  );
}
