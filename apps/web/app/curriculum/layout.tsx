import { Navbar } from "@/components/layout/Navbar";
import { createClient } from "@/lib/supabase/server";

export default async function CurriculumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user = null;
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
  ) {
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      user = data.user;
    } catch {
      /* no auth configured */
    }
  }

  return (
    <>
      <Navbar user={user} />
      {children}
    </>
  );
}
