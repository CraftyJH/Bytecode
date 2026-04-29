interface SectionHeaderProps {
  label: string;
  heading: string;
  subheading?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  label,
  heading,
  subheading,
  align = "left",
  className = "",
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "text-center" : "";

  return (
    <div className={`${alignClass} ${className}`}>
      <p
        className="text-prose-faint text-sm mb-3"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {`// ${label}`}
      </p>
      <h2 className="text-3xl font-semibold text-prose leading-tight tracking-tight">
        {heading}
      </h2>
      {subheading && (
        <p className="mt-4 text-lg text-prose-muted max-w-2xl leading-relaxed">
          {subheading}
        </p>
      )}
    </div>
  );
}
