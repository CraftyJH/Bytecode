import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { fetchBackendUserState, resolvePlanState } from "@/lib/user-state";

async function changePassword(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const password = formData.get("password") as string;
  const confirm = formData.get("confirm") as string;

  if (password !== confirm) {
    redirect("/me/settings?error=Passwords+do+not+match&tab=security");
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(`/me/settings?error=${encodeURIComponent(error.message)}&tab=security`);
  }

  redirect("/me/settings?saved=1&tab=security");
}

interface SettingsPageProps {
  searchParams: Promise<{ tab?: string; saved?: string; error?: string }>;
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!user) redirect("/signin");

  const backendUser = await fetchBackendUserState(session?.access_token);
  const plan = resolvePlanState(user, backendUser);

  const { tab = "account", saved, error } = await searchParams;

  const tabs = [
    { id: "account", label: "Account" },
    { id: "security", label: "Security" },
    { id: "notifications", label: "Notifications" },
    { id: "billing", label: "Billing" },
  ];

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-8">
        <p
          className="text-prose-faint text-xs mb-1"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          // settings
        </p>
        <h1 className="text-2xl font-semibold text-prose tracking-tight">
          Settings
        </h1>
      </div>

      {/* Tab nav */}
      <div
        className="flex gap-1 border-b mb-8"
        style={{ borderColor: "var(--border-subtle)" }}
        role="tablist"
      >
        {tabs.map(({ id, label }) => (
          <a
            key={id}
            href={`/me/settings?tab=${id}`}
            role="tab"
            aria-selected={tab === id}
            className={`px-4 py-2.5 text-sm border-b-2 -mb-px transition-colors duration-100 ${
              tab === id
                ? "border-accent text-prose font-medium"
                : "border-transparent text-prose-muted hover:text-prose"
            }`}
          >
            {label}
          </a>
        ))}
      </div>

      {saved && (
        <div
          className="mb-6 px-4 py-3 rounded-md text-sm text-ok border"
          style={{ backgroundColor: "rgba(111,168,111,0.08)", borderColor: "rgba(111,168,111,0.25)" }}
          role="status"
        >
          Changes saved.
        </div>
      )}
      {error && (
        <div
          className="mb-6 px-4 py-3 rounded-md text-sm text-fail border"
          style={{ backgroundColor: "rgba(199,123,123,0.08)", borderColor: "rgba(199,123,123,0.25)" }}
          role="alert"
        >
          {decodeURIComponent(error)}
        </div>
      )}

      {/* Account tab */}
      {tab === "account" && (
        <Card padding="lg">
          <h2 className="text-sm font-semibold text-prose mb-5 tracking-tight">Account details</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b"
              style={{ borderColor: "var(--border-subtle)" }}>
              <span className="text-xs text-prose-muted">Email</span>
              <span className="text-xs text-prose">{user.email}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b"
              style={{ borderColor: "var(--border-subtle)" }}>
              <span className="text-xs text-prose-muted">Plan</span>
              <span className="flex items-center gap-2">
                <Pill variant={plan.isPremium ? "premium" : "free"} label={plan.label} />
                {plan.isAdmin && <Pill variant="premium" label="Admin" />}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-xs text-prose-muted">Member since</span>
              <span className="text-xs text-prose">
                {new Date(user.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
          <div className="mt-6 pt-5 border-t" style={{ borderColor: "var(--border-subtle)" }}>
            <h3 className="text-xs font-semibold text-fail mb-2">Danger zone</h3>
            <p className="text-xs text-prose-faint mb-3">
              Permanently delete your account and all data. This cannot be undone.
            </p>
            <Button variant="ghost" size="sm" className="text-fail hover:text-fail">
              Delete account
            </Button>
          </div>
        </Card>
      )}

      {/* Security tab */}
      {tab === "security" && (
        <Card padding="lg">
          <h2 className="text-sm font-semibold text-prose mb-5 tracking-tight">Change password</h2>
          <form action={changePassword} className="flex flex-col gap-4">
            <Input
              label="New password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              minLength={8}
              hint="At least 8 characters."
            />
            <Input
              label="Confirm new password"
              name="confirm"
              type="password"
              required
              autoComplete="new-password"
            />
            <div className="flex justify-end pt-1">
              <Button variant="primary" size="sm">Update password</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Notifications tab */}
      {tab === "notifications" && (
        <Card padding="lg">
          <p
            className="text-prose-faint text-xs mb-2"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            // coming in sprint 6
          </p>
          <h2 className="text-sm font-semibold text-prose mb-2 tracking-tight">Notification preferences</h2>
          <p className="text-sm text-prose-muted">
            Email preferences (forum replies, weekly summary) will be configurable here once the forum launches.
          </p>
        </Card>
      )}

      {/* Billing tab */}
      {tab === "billing" && (
        <Card padding="lg">
          <p
            className="text-prose-faint text-xs mb-2"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            // coming in sprint 5
          </p>
          <h2 className="text-sm font-semibold text-prose mb-2 tracking-tight">Billing &amp; subscription</h2>
          <p className="text-sm text-prose-muted mb-5">
            {plan.isPremium
              ? "You are on Premium access. You can use all tracks, capstones, and certificates."
              : "You are on the Free plan. Upgrade to Premium for full Java + Kotlin tracks, capstones, and certificates."}
          </p>
          {!plan.isPremium && (
            <Button as="a" href="/pricing" variant="primary" size="sm">
              View pricing
            </Button>
          )}
        </Card>
      )}
    </div>
  );
}
