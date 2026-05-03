import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { LayoutDashboard, Users, Shield, BookOpen } from "lucide-react";

export const metadata = { title: "Admin — Bytecode" };

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/blog", label: "Blog", icon: BookOpen },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/signin");

  const adminClient = createAdminClient();
  const {
    data: { user: freshUser },
  } = await adminClient.auth.admin.getUserById(user.id);

  if (freshUser?.app_metadata?.role !== "admin") redirect("/");

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Mobile top bar */}
      <header
        className="lg:hidden border-b shrink-0"
        style={{
          backgroundColor: "var(--bg-elevated)",
          borderColor: "var(--border-subtle)",
        }}
      >
        <div className="flex items-center gap-2 px-4 h-12 border-b" style={{ borderColor: "var(--border-subtle)" }}>
          <Shield size={14} className="text-accent" />
          <span
            className="text-sm font-semibold text-prose tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Admin
          </span>
          <a
            href="/dashboard"
            className="ml-auto text-xs text-prose-faint hover:text-prose-muted transition-colors duration-100"
          >
            ← App
          </a>
        </div>
        <nav className="flex px-2 py-1.5 gap-1 overflow-x-auto">
          {NAV.map(({ href, label, icon: Icon }) => (
            <a
              key={href}
              href={href}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm text-prose-muted hover:text-prose hover:bg-subtle transition-colors duration-100 whitespace-nowrap shrink-0"
            >
              <Icon size={13} className="shrink-0" />
              {label}
            </a>
          ))}
        </nav>
      </header>

      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex w-56 shrink-0 border-r flex-col"
        style={{
          backgroundColor: "var(--bg-elevated)",
          borderColor: "var(--border-subtle)",
        }}
      >
        <div
          className="h-14 flex items-center gap-2 px-4 border-b"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <Shield size={16} className="text-accent" />
          <span
            className="text-sm font-semibold text-prose tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Admin
          </span>
        </div>

        <nav className="flex-1 py-3 px-2">
          <ul className="space-y-0.5 list-none m-0 p-0">
            {NAV.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <a
                  href={href}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-prose-muted hover:text-prose hover:bg-subtle transition-colors duration-100"
                >
                  <Icon size={14} className="shrink-0" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div
          className="p-4 border-t"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <a
            href="/dashboard"
            className="text-xs text-prose-faint hover:text-prose-muted transition-colors duration-100"
          >
            ← Back to app
          </a>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
