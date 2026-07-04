type BleedDisplayProps = {
  children: string;
  className?: string;
};

export function BleedDisplay({ children, className }: BleedDisplayProps) {
  return (
    <div
      aria-hidden="true"
      data-bleed-display
      className={["display bleed-word", className].filter(Boolean).join(" ")}
    >
      {children}
    </div>
  );
}
