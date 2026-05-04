"use client";

import { useState, useTransition } from "react";
import { Search, Loader2 } from "lucide-react";

interface AdminUser {
  id: string;
  email: string | undefined;
  name: string | undefined;
  plan: string;
  role: string;
  streakDisabled: boolean;
  createdAt: string;
}

interface UsersTableProps {
  users: AdminUser[];
}

export function UsersTable({ users }: UsersTableProps) {
  const [query, setQuery] = useState("");
  const [pending, startTransition] = useTransition();
  const [localUsers, setLocalUsers] = useState(users);

  const filtered = query
    ? localUsers.filter(
        (u) =>
          u.email?.toLowerCase().includes(query.toLowerCase()) ||
          u.name?.toLowerCase().includes(query.toLowerCase()),
      )
    : localUsers;

  async function togglePremium(userId: string, currentPlan: string) {
    const newPlan = currentPlan === "premium" ? "free" : "premium";
    startTransition(async () => {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field: "plan", value: newPlan }),
      });
      if (res.ok) {
        setLocalUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, plan: newPlan } : u)),
        );
      }
    });
  }

  async function toggleAdmin(userId: string, currentRole: string) {
    const newRole = currentRole === "admin" ? "" : "admin";
    startTransition(async () => {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field: "role", value: newRole }),
      });
      if (res.ok) {
        setLocalUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
        );
      }
    });
  }

  async function toggleStreak(userId: string, disabled: boolean) {
    const next = !disabled;
    startTransition(async () => {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field: "streak_disabled", value: next }),
      });
      if (res.ok) {
        setLocalUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, streakDisabled: next } : u)),
        );
      }
    });
  }

  return (
    <div>
      {/* Search */}
      <div className="relative mb-5">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-prose-faint"
        />
        <input
          type="text"
          placeholder="Search by email or name…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-sm pl-8 pr-3 py-2 rounded-md border text-sm text-prose placeholder:text-prose-faint bg-transparent focus:outline-none focus:ring-1"
          style={{
            borderColor: "var(--border-emphasis)",
            // @ts-expect-error css variable
            "--tw-ring-color": "var(--accent)",
          }}
        />
      </div>

      <div
        className="rounded-xl border overflow-x-auto"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <table className="w-full min-w-[600px]">
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
              <th className="text-left px-4 py-2.5 text-xs font-medium text-prose-faint hidden md:table-cell">
                Name
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-prose-faint">
                Plan
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-prose-faint hidden lg:table-cell">
                Role
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-prose-faint hidden lg:table-cell">
                Joined
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-prose-faint hidden xl:table-cell">
                Streak
              </th>
              <th className="text-right px-4 py-2.5 text-xs font-medium text-prose-faint">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-sm text-prose-faint text-center italic"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr
                  key={u.id}
                  className="border-b last:border-0 hover:bg-subtle/50 transition-colors"
                  style={{ borderColor: "var(--border-subtle)" }}
                >
                  <td className="px-4 py-3 text-sm text-prose max-w-[200px] truncate">
                    {u.email ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-prose-muted hidden md:table-cell">
                    {u.name ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-sm font-medium ${
                        u.plan === "premium"
                          ? "text-accent bg-accent/10"
                          : "text-prose-faint bg-subtle"
                      }`}
                    >
                      {u.plan === "premium" ? "Premium" : "Free"}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {u.role === "admin" && (
                      <span className="text-xs px-1.5 py-0.5 rounded-sm font-medium text-orange-400 bg-orange-400/10">
                        Admin
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-prose-faint hidden lg:table-cell">
                    {new Date(u.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 hidden xl:table-cell">
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-sm font-medium ${
                        u.streakDisabled ? "text-warn bg-warn/10" : "text-ok bg-ok/10"
                      }`}
                    >
                      {u.streakDisabled ? "Disabled" : "Enabled"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => togglePremium(u.id, u.plan)}
                        disabled={pending}
                        className="text-xs px-2 py-1 rounded border text-prose-muted hover:text-prose transition-colors duration-100 disabled:opacity-50 cursor-pointer"
                        style={{ borderColor: "var(--border-emphasis)" }}
                      >
                        {pending ? (
                          <Loader2 size={10} className="animate-spin" />
                        ) : u.plan === "premium" ? (
                          "Revoke premium"
                        ) : (
                          "Grant premium"
                        )}
                      </button>
                      <button
                        onClick={() => toggleAdmin(u.id, u.role)}
                        disabled={pending}
                        className="text-xs px-2 py-1 rounded border text-prose-muted hover:text-prose transition-colors duration-100 disabled:opacity-50 cursor-pointer"
                        style={{ borderColor: "var(--border-emphasis)" }}
                      >
                        {u.role === "admin" ? "Revoke admin" : "Grant admin"}
                      </button>
                      <button
                        onClick={() => toggleStreak(u.id, u.streakDisabled)}
                        disabled={pending}
                        className="text-xs px-2 py-1 rounded border text-prose-muted hover:text-prose transition-colors duration-100 disabled:opacity-50 cursor-pointer"
                        style={{ borderColor: "var(--border-emphasis)" }}
                      >
                        {u.streakDisabled ? "Enable streak" : "Disable streak"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-prose-faint">
        {filtered.length} of {localUsers.length} users
      </p>
    </div>
  );
}
