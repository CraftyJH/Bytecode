import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

async function updateProfile(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const name = formData.get("name") as string;

  const { error } = await supabase.auth.updateUser({
    data: { name },
  });

  if (error) {
    redirect(`/me/profile?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/me/profile?saved=1");
}

interface ProfilePageProps {
  searchParams: Promise<{ saved?: string; error?: string }>;
}

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/signin");

  const { saved, error } = await searchParams;
  const displayName = user.user_metadata?.name ?? "";
  const initials = displayName
    ? displayName.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)
    : (user.email?.[0] ?? "?").toUpperCase();

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-8">
        <p
          className="text-prose-faint text-xs mb-1"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          // profile
        </p>
        <h1 className="text-2xl font-semibold text-prose tracking-tight">
          Your profile
        </h1>
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

      <div className="space-y-6">
        {/* Avatar */}
        <Card padding="md">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-lg flex items-center justify-center text-xl font-semibold text-inverse bg-accent shrink-0"
              aria-hidden="true"
            >
              {initials}
            </div>
            <div>
              <p className="text-sm font-medium text-prose">{displayName || user.email}</p>
              <p className="text-xs text-prose-faint">{user.email}</p>
              <p className="text-xs text-prose-faint mt-0.5">
                Member since{" "}
                {new Date(user.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </Card>

        {/* Edit form */}
        <Card padding="lg">
          <h2 className="text-sm font-semibold text-prose mb-5 tracking-tight">
            Personal info
          </h2>
          <form action={updateProfile} className="flex flex-col gap-4">
            <Input
              label="Display name"
              name="name"
              type="text"
              defaultValue={displayName}
              autoComplete="name"
              placeholder="Your name"
            />
            <Input
              label="Email"
              name="email"
              type="email"
              defaultValue={user.email ?? ""}
              disabled
              hint="Email changes are not yet supported."
            />
            <div className="flex justify-end pt-1">
              <Button variant="primary" size="sm">
                Save changes
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
