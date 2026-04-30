import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NewThreadForm } from "@/components/forum/NewThreadForm";
import { Suspense } from "react";

export default async function NewThreadPage() {
  // Require auth to post
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
  ) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/signin?next=/forum/new");
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-8">
        <nav
          className="mb-2 flex items-center gap-1.5 text-xs text-prose-faint"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <a href="/forum" className="hover:text-prose-muted transition-colors">forum</a>
          <span>/</span>
          <span className="text-prose-muted">new thread</span>
        </nav>
        <h1 className="text-2xl font-semibold text-prose tracking-tight">New thread</h1>
        <p className="text-sm text-prose-muted mt-1">
          Be specific. A clear question gets a clear answer.
        </p>
      </div>

      <Suspense>
        <NewThreadForm />
      </Suspense>
    </div>
  );
}
