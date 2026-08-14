export function Reveal({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={["rv", className].filter(Boolean).join(" ")} style={style}>
      {children}
    </div>
  );
}
