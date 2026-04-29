interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
  style?: React.CSSProperties;
}

const paddingClasses = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({ children, className = "", padding = "lg", style }: CardProps) {
  return (
    <div
      className={`bg-elevated rounded-lg border ${paddingClasses[padding]} ${className}`}
      style={{ borderColor: "var(--border-subtle)", ...style }}
    >
      {children}
    </div>
  );
}
