"use client";

import { useState, useRef, useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

interface UserMenuProps {
  user: User;
}

export function UserMenu({ user }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const displayName =
    user.user_metadata?.name ?? user.email?.split("@")[0] ?? "Account";
  const initials = displayName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isAdmin = user.app_metadata?.role === "admin";

  const items = [
    ...(isAdmin ? [{ label: "Admin panel", href: "/admin" }] : []),
    { label: "Dashboard", href: "/dashboard" },
    { label: "Profile", href: "/me/profile" },
    { label: "Settings", href: "/me/settings" },
    { label: "Billing", href: "/me/billing" },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => setOpen((p) => !p)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Open account menu"
      >
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-semibold text-inverse bg-accent"
          aria-hidden="true"
        >
          {initials}
        </div>
        <ChevronDown
          size={14}
          className={`text-prose-faint transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          className="absolute right-0 top-10 w-48 rounded-lg border py-1 z-50"
          style={{
            backgroundColor: "var(--color-elevated)",
            borderColor: "var(--border-default)",
            boxShadow: "0 24px 48px -16px rgba(0,0,0,0.5)",
          }}
          role="menu"
        >
          <div
            className="px-3 py-2 border-b"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            <p className="text-xs text-prose truncate">{displayName}</p>
            <p className="text-xs text-prose-faint truncate">{user.email}</p>
          </div>

          {items.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              role="menuitem"
              className="block px-3 py-2 text-sm text-prose-muted hover:text-prose hover:bg-subtle transition-colors duration-100"
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          ))}

          <div
            className="border-t mt-1 pt-1"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            <button
              role="menuitem"
              className="w-full text-left px-3 py-2 text-sm text-prose-faint hover:text-fail hover:bg-subtle transition-colors duration-100 cursor-pointer"
              onClick={signOut}
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
