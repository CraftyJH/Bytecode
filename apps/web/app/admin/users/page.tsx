import { createAdminClient } from "@/lib/supabase/admin";
import { UsersTable } from "./UsersTable";

export default async function AdminUsersPage() {
  const admin = createAdminClient();
  const { data } = await admin.auth.admin.listUsers({ perPage: 1000 });
  const users = (data?.users ?? []).map((u) => ({
    id: u.id,
    email: u.email,
    name: (u.user_metadata?.name as string | undefined) ?? undefined,
    plan: (u.app_metadata?.plan as string | undefined) ?? "free",
    role: (u.app_metadata?.role as string | undefined) ?? "",
    streakDisabled: Boolean(u.app_metadata?.streak_disabled),
    createdAt: u.created_at,
  }));

  // Sort newest first
  users.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="px-4 py-6 sm:px-8 sm:py-10">
      <div className="mb-8">
        <p
          className="text-prose-faint text-xs mb-1"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          // users
        </p>
        <h1 className="text-2xl font-semibold text-prose tracking-tight">
          Users
        </h1>
      </div>

      <UsersTable users={users} />
    </div>
  );
}
