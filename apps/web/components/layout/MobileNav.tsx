"use client";

import { useState, useEffect } from "react";
import { Menu, X, Download } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const NAV_LINKS = [
  { href: "/curriculum", label: "Curriculum" },
  { href: "/pricing", label: "Pricing" },
  { href: "/why-bytecode", label: "Why Bytecode?" },
  { href: "/forum", label: "Forum" },
  { href: "/get-the-app", label: "Get the app", icon: <Download size={14} /> },
];

interface MobileNavProps {
  user?: User | null;
}

export function MobileNav({ user }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  const displayName =
    user?.user_metadata?.name ?? user?.email?.split("@")[0] ?? null;

  return (
    <>
      {/* Hamburger button — mobile only */}
      <button
        className="md:hidden flex items-center justify-center w-8 h-8 text-prose-muted hover:text-prose transition-colors duration-100 cursor-pointer"
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={open}
      >
        <Menu size={20} />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-72 flex flex-col border-l transition-transform duration-200 md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          backgroundColor: "var(--bg-elevated)",
          borderColor: "var(--border-subtle)",
        }}
        aria-modal="true"
        role="dialog"
        aria-label="Navigation menu"
      >
        {/* Drawer header */}
        <div
          className="h-14 flex items-center justify-between px-5 border-b shrink-0"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <span
            className="text-prose font-semibold tracking-tight text-lg"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Bytecode
          </span>
          <button
            className="text-prose-muted hover:text-prose transition-colors duration-100 cursor-pointer"
            onClick={() => setOpen(false)}
            aria-label="Close navigation menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-0.5 list-none m-0 p-0">
            {NAV_LINKS.map(({ href, label, icon }) => (
              <li key={href}>
                <a
                  href={href}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm text-prose-muted hover:text-prose hover:bg-subtle transition-colors duration-100"
                  onClick={() => setOpen(false)}
                >
                  {icon && <span className="text-prose-faint">{icon}</span>}
                  {label}
                </a>
              </li>
            ))}
          </ul>

          {/* User section */}
          {user ? (
            <>
              <div
                className="my-4 border-t"
                style={{ borderColor: "var(--border-subtle)" }}
              />
              <div className="px-3 mb-3">
                <p className="text-xs text-prose truncate font-medium">{displayName}</p>
                <p className="text-xs text-prose-faint truncate">{user.email}</p>
              </div>
              <ul className="space-y-0.5 list-none m-0 p-0">
                {[
                  { href: "/dashboard", label: "Dashboard" },
                  { href: "/me/profile", label: "Profile" },
                  { href: "/me/settings", label: "Settings" },
                  { href: "/me/billing", label: "Billing" },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <a
                      href={href}
                      className="block px-3 py-2.5 rounded-md text-sm text-prose-muted hover:text-prose hover:bg-subtle transition-colors duration-100"
                      onClick={() => setOpen(false)}
                    >
                      {label}
                    </a>
                  </li>
                ))}
                <li>
                  <button
                    className="w-full text-left px-3 py-2.5 rounded-md text-sm text-prose-faint hover:text-fail hover:bg-subtle transition-colors duration-100 cursor-pointer"
                    onClick={signOut}
                  >
                    Sign out
                  </button>
                </li>
              </ul>
            </>
          ) : (
            <>
              <div
                className="my-4 border-t"
                style={{ borderColor: "var(--border-subtle)" }}
              />
              <div className="px-3 space-y-2">
                <a
                  href="/signin"
                  className="block w-full text-center px-4 py-2.5 rounded-md text-sm text-prose-muted border hover:text-prose transition-colors duration-100"
                  style={{ borderColor: "var(--border-emphasis)" }}
                  onClick={() => setOpen(false)}
                >
                  Sign in
                </a>
                <a
                  href="/signup"
                  className="block w-full text-center px-4 py-2.5 rounded-md text-sm font-medium bg-accent text-inverse hover:bg-accent-warm transition-colors duration-100"
                  onClick={() => setOpen(false)}
                >
                  Start free
                </a>
              </div>
            </>
          )}
        </nav>
      </div>
    </>
  );
}
