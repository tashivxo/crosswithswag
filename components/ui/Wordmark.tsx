type WordmarkProps = {
  className?: string;
  label?: string;
};

export function Wordmark({ className, label = "swag." }: WordmarkProps) {
  return (
    <div
      aria-label={label}
      role="img"
      className={["wordmark", className].filter(Boolean).join(" ")}
    />
  );
}
