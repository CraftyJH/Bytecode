type PillVariant = "free" | "premium" | "completed" | "locked" | "founding";

interface PillProps {
  variant: PillVariant;
  label?: string;
  className?: string;
}

const variantConfig: Record<
  PillVariant,
  { classes: string; defaultLabel: string; prefix?: string }
> = {
  free: {
    classes: "bg-subtle text-prose-muted",
    defaultLabel: "Free",
  },
  premium: {
    classes: "bg-accent-muted text-accent",
    defaultLabel: "Premium",
  },
  completed: {
    classes: "text-ok",
    defaultLabel: "Completed",
    prefix: "",
  },
  locked: {
    classes: "bg-subtle text-prose-faint",
    defaultLabel: "Locked",
  },
  founding: {
    classes: "bg-accent-muted text-accent",
    defaultLabel: "Founding Member",
    prefix: "⌜ ",
  },
};

export function Pill({ variant, label, className = "" }: PillProps) {
  const config = variantConfig[variant];
  const text = label ?? config.defaultLabel;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-medium tracking-wide ${config.classes} ${className}`}
      style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.02em" }}
    >
      {config.prefix}
      {text}
    </span>
  );
}
