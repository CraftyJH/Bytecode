export function Footer() {
  const year = new Date().getFullYear();

  const links = [
    { href: "/curriculum", label: "Curriculum" },
    { href: "/pricing", label: "Pricing" },
    { href: "/why-bytecode", label: "Why Bytecode?" },
    { href: "/forum", label: "Forum" },
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
  ];

  return (
    <footer
      className="border-t mt-auto"
      style={{ borderColor: "var(--border-subtle)" }}
    >
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        {/* Wordmark + copy */}
        <div>
          <p
            className="text-prose font-semibold mb-1"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Bytecode
          </p>
          <p className="text-xs text-prose-faint">
            © {year} Bytecode. Java and Kotlin, mastered.
          </p>
        </div>

        {/* Links */}
        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 list-none m-0 p-0">
            {links.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  className="text-xs text-prose-faint hover:text-prose-muted transition-colors duration-100"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
