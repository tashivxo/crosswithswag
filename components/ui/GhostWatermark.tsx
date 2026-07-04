type GhostWatermarkProps = {
  text: string;
  className?: string;
};

export function GhostWatermark({ text, className }: GhostWatermarkProps) {
  return (
    <div
      aria-hidden="true"
      data-ghost-layer
      className={["ghost-layer", className].filter(Boolean).join(" ")}
    >
      {text}
    </div>
  );
}
