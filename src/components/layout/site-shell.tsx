import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LogOut, Menu, Search, Shield, X } from "lucide-react";
import { useState } from "react";

import { TffLogo } from "@/components/tff/branding";
import { Button } from "@/components/ui/button";
import { useIsAdmin } from "@/hooks/use-tff-auth";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/tournaments", label: "Tournaments" },
  { to: "/teams", label: "Teams" },
  { to: "/h2h", label: "H2H Rivalry" },
  { to: "/poster", label: "Media Studio" },
  { to: "/rankings", label: "Rankings" },
  { to: "/champions", label: "Hall of Champions" },
  { to: "/about", label: "About TFF" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { session } = useIsAdmin();

  function submitSearch(event: React.FormEvent) {
    event.preventDefault();
    if (!query.trim()) return;
    setOpen(false);
    navigate({ to: "/search", search: { q: query.trim() } });
  }

  return (
    <header className="glass sticky top-0 z-50 border-b border-border/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="shrink-0">
          <TffLogo />
        </Link>

        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="label-caps rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "text-primary bg-primary/10" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <form onSubmit={submitSearch} className="hidden md:block">
            <label className="flex h-9 items-center gap-2 rounded-md border border-border bg-secondary/60 px-2.5">
              <Search className="size-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search TFF..."
                className="w-36 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </label>
          </form>

          {session && (
            <Button
              size="sm"
              variant="ghost"
              onClick={async () => {
                await supabase.auth.signOut();
                navigate({ to: "/", replace: true });
              }}
              aria-label="Sign out"
            >
              <LogOut className="size-4" />
            </Button>
          )}

          <Button
            size="icon"
            variant="ghost"
            className="lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-border/70 transition-[max-height] duration-300 lg:hidden",
          open ? "max-h-96" : "max-h-0",
        )}
      >
        <nav className="flex flex-col gap-1 p-4">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="label-caps rounded-md px-3 py-2.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "text-primary bg-primary/10" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
          <form onSubmit={submitSearch} className="mt-2">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search TFF..."
              className="h-10 w-full rounded-md border border-border bg-secondary/60 px-3 text-sm outline-none"
            />
          </form>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/70 bg-[var(--surface)]/60">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <TffLogo />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Triad Football Federation — a competitive eFootball tournament organization.
            Compete. Conquer. Create History.
          </p>
        </div>
        <div>
          <p className="label-caps mb-3 text-primary">Competitions</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/tournaments" className="hover:text-foreground">
                All Tournaments
              </Link>
            </li>
            <li>
              <Link to="/champions" className="hover:text-foreground">
                Hall of Champions
              </Link>
            </li>
            <li>
              <Link to="/rankings" className="hover:text-foreground">
                TFF Rankings
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="label-caps mb-3 text-primary">Organization</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/teams" className="hover:text-foreground">
                Team Database
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-foreground">
                About TFF
              </Link>
            </li>

          </ul>
        </div>
      </div>
      <div className="border-t border-border/70 px-4 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} TFF eFootball — Tournament Hub. Organized by TFF.
      </div>
    </footer>
  );
}

export function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const bare = pathname.startsWith("/admin") || pathname.startsWith("/auth");
  if (bare) return <>{children}</>;
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
