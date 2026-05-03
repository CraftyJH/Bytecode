import { createAdminClient } from "@/lib/supabase/admin";
import { Users, Star, TrendingUp, Calendar } from "lucide-react";
import { Card } from "@/components/ui/Card";

export default async function AdminOverviewPage() {
  const admin = createAdminClient();
  const { data } = await admin.auth.admin.listUsers({ perPage: 1000 });
  const users = data?.users ?? [];

  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const totalUsers = users.length;
  const premiumUsers = users.filter(
    (u) => u.app_metadata?.plan === "premium",
  ).length;
  const signupsThisWeek = users.filter(
    (u) => new Date(u.created_at) > oneWeekAgo,
  ).length;
  const signupsThisMonth = users.filter(
    (u) => new Date(u.created_at) > oneMonthAgo,
  ).length;

  const stats = [
    { label: "Total users", value: totalUsers, icon: Users },
    { label: "Premium users", value: premiumUsers, icon: Star },
    { label: "Signups (7d)", value: signupsThisWeek, icon: TrendingUp },
    { label: "Signups (30d)", value: signupsThisMonth, icon: Calendar },
  ];

  // Recent 10 signups
  const recent = [...users]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10);

  return (
    <div className="px-8 py-10">
      <div className="mb-8">
        <p
          className="text-prose-faint text-xs mb-1"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          // overview
        </p>
        <h1 className="text-2xl font-semibold text-prose tracking-tight">
          Dashboard
        </h1>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label} padding="md">
            <div className="flex items-center gap-2.5 mb-3">
              <Icon size={14} className="text-prose-faint shrink-0" />
              <p className="text-xs text-prose-muted">{label}</p>
            </div>
            <p className="text-3xl font-semibold text-prose tracking-tight">
              {value}
            </p>
          </Card>
        ))}
      </div>

      {/* Recent signups */}
      <div>
        <p
          className="text-prose-faint text-xs mb-4"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          // recent signups
        </p>
        <div
          className="rounded-xl border overflow-hidden"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <table className="w-full">
            <thead>
              <tr
                className="border-b"
                style={{
                  backgroundColor: "var(--bg-elevated)",
                  borderColor: "var(--border-subtle)",
                }}
              >
                <th className="text-left px-4 py-2.5 text-xs font-medium text-prose-faint">
                  Email
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-prose-faint">
                  Plan
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-prose-faint">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody>
              {recent.map((u) => (
                <tr
                  key={u.id}
                  className="border-b last:border-0"
                  style={{ borderColor: "var(--border-subtle)" }}
                >
                  <td className="px-4 py-2.5 text-sm text-prose">
                    {u.email}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-sm font-medium ${
                        u.app_metadata?.plan === "premium"
                          ? "text-accent bg-accent/10"
                          : "text-prose-faint bg-subtle"
                      }`}
                    >
                      {u.app_metadata?.plan === "premium" ? "Premium" : "Free"}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-prose-faint">
                    {new Date(u.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
