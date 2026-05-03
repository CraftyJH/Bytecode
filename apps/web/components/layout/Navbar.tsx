import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/Button";
import { UserMenu } from "@/components/layout/UserMenu";
import { MobileNav } from "@/components/layout/MobileNav";

interface NavbarProps {
  user?: User | null;
}

export function Navbar({ user }: NavbarProps) {
  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: "rgba(11, 11, 15, 0.85)",
        backdropFilter: "blur(12px)",
        borderColor: "var(--border-subtle)",
      }}
    >
      <nav
        className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Wordmark */}
        <a
          href={user ? "/dashboard" : "/"}
          className="text-prose font-semibold tracking-tight text-lg hover:text-accent transition-colors duration-100"
          style={{ fontFamily: "var(--font-display)" }}
          aria-label="Bytecode home"
        >
          Bytecode
        </a>

        {/* Nav links — hidden on mobile */}
        <ul className="hidden md:flex items-center gap-6 list-none m-0 p-0">
          {[
            { href: "/curriculum", label: "Curriculum" },
            { href: "/blog", label: "Blog" },
            { href: "/pricing", label: "Pricing" },
            { href: "/why-bytecode", label: "Why Bytecode?" },
            { href: "/forum", label: "Forum" },
          ].map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                className="text-sm text-prose-muted hover:text-prose transition-colors duration-100"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Auth actions — hidden on mobile (handled by MobileNav drawer) */}
          {user ? (
            <UserMenu user={user} />
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Button as="a" href="/signin" variant="ghost" size="sm">
                Sign in
              </Button>
              <Button as="a" href="/signup" variant="primary" size="sm">
                Start free
              </Button>
            </div>
          )}

          {/* Mobile hamburger */}
          <MobileNav user={user} />
        </div>
      </nav>
    </header>
  );
}
