/** Material Symbols Rounded glyph. Decorative by default; pass `label` for icon-only meaning. */
export default function Symbol({ name, fill = false, size = 24, label, className = "" }: {
  name: string; fill?: boolean; size?: number; label?: string; className?: string;
}) {
  return (
    <span
      className={`msr ${fill ? "fill" : ""} ${className}`}
      style={{ fontSize: size }}
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label}
    >
      {name}
    </span>
  );
}
