import Image from "next/image";
import { currentEdition } from "@/lib/editions";

export function CampaignFrame({
  artboard,
  editionName,
  tag,
}: {
  artboard: number;
  editionName: string;
  tag?: string;
}) {
  const src = `/assets/winter-drop/Artboard${artboard}.jpg`;

  return (
    <div className="frame">
      <Image
        src={src}
        alt={`${editionName} campaign photography`}
        fill
        sizes="(max-width: 768px) 50vw, 25vw"
      />
      <span className="tag">
        {tag ?? `ed.001 / ${String(artboard).padStart(2, "0")}`}
      </span>
    </div>
  );
}

export function ImageGrid({
  artboards,
  columns = 4,
  editionName = currentEdition.name,
}: {
  artboards: readonly number[];
  columns?: number;
  editionName?: string;
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
      {artboards.map((artboard) => (
        <CampaignFrame
          key={artboard}
          artboard={artboard}
          editionName={editionName}
        />
      ))}
    </div>
  );
}
