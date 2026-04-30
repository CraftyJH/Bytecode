import { Button } from "@/components/ui/Button";
import { Plus, Search } from "lucide-react";

export default function ForumLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ paddingTop: "56px" }}>
      {/* Forum sub-header */}
      <div
        className="border-b px-6 lg:px-10 py-4 flex items-center gap-4"
        style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--color-elevated)" }}
      >
        <a
          href="/forum"
          className="text-sm font-semibold text-prose tracking-tight mr-2 hover:text-accent transition-colors"
        >
          Forum
        </a>

        {/* Search */}
        <form action="/forum/search" method="GET" className="flex-1 max-w-sm">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-prose-faint pointer-events-none" />
            <input
              name="q"
              type="search"
              placeholder="Search threads…"
              className="w-full pl-8 pr-3 py-1.5 rounded-md border text-sm text-prose-muted placeholder:text-prose-faint focus:outline-none transition-colors"
              style={{ backgroundColor: "var(--color-base)", borderColor: "var(--border-subtle)" }}
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-2">
          <a href="/forum/rules" className="text-xs text-prose-faint hover:text-prose transition-colors hidden sm:block">
            Rules
          </a>
          <Button as="a" href="/forum/new" variant="primary" size="sm" className="gap-1.5">
            <Plus size={13} /> New thread
          </Button>
        </div>
      </div>

      {children}
    </div>
  );
}
