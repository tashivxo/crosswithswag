import Image from "next/image";
import { currentEdition } from "@/lib/editions";

export function CampaignFrame({
  artboard,
  editionName,
  tag,
  sizes = "(max-width: 768px) 50vw, 25vw",
}: {
  artboard: number;
  editionName: string;
  tag?: string;
  sizes?: string;
}) {
  const src = `/assets/winter-drop/Artboard${artboard}.jpg`;

  return (
    <div className="frame">
      <Image
        src={src}
        alt={`${editionName} campaign photography`}
        fill
        sizes={sizes}
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
  variant = "clothes",
  editionName = currentEdition.name,
}: {
  artboards: readonly number[];
  columns?: number;
  variant?: "clothes" | "campaign";
  editionName?: string;
}) {
  const gridClass = variant === "campaign" ? "grid-campaign" : "grid-clothes";
  const imageSizes =
    variant === "campaign"
      ? "(max-width: 560px) 100vw, 33vw"
      : "(max-width: 768px) 50vw, 25vw";

  return (
    <div
      className={gridClass}
      style={
        variant === "clothes" && columns === 3
          ? { gridTemplateColumns: "repeat(3, 1fr)" }
          : undefined
      }
    >
      {artboards.map((artboard) => (
        <CampaignFrame
          key={artboard}
          artboard={artboard}
          editionName={editionName}
          sizes={imageSizes}
        />
      ))}
    </div>
  );
}
