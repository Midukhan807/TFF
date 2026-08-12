import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { PublicShell } from "../components/layout/site-shell";
import { Toaster } from "../components/ui/sonner";
import appCss from "../styles.css?url";
import { supabase } from "../integrations/supabase/client";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-8xl text-primary">404</h1>
        <h2 className="mt-4 text-2xl">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Triad Football Federation (TFF) | Triad Champions League & eFootball Hub" },
      {
        name: "description",
        content:
          "Official website of the Triad Football Federation (TFF eFootball) & Triad Champions League (TCL). Follow competitive eFootball tournaments, live fixtures, standings, team power rankings & Hall of Champions.",
      },
      {
        name: "keywords",
        content:
          "Triad Football Federation, Triad Champions League, TFF, TFF eFootball, Triad Football, eFootball tournaments, TCL, TCL Season 7, TFF rankings, eFootball league",
      },
      { name: "author", content: "Triad Football Federation" },
      { name: "robots", content: "index, follow" },
      { name: "google-site-verification", content: "googled6272ab66f432fba" },

      // Open Graph / Facebook
      { property: "og:site_name", content: "Triad Football Federation (TFF)" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Triad Football Federation (TFF) | Triad Champions League & eFootball Hub" },
      {
        property: "og:description",
        content: "Compete. Conquer. Create History. Official home of the Triad Football Federation (TFF) and Triad Champions League (TCL).",
      },

      // Twitter Cards
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Triad Football Federation (TFF) | Triad Champions League" },
      {
        name: "twitter:description",
        content: "Official eFootball tournament hub for Triad Football Federation (TFF) and Triad Champions League (TCL).",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Barlow:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SportsOrganization",
          "name": "Triad Football Federation",
          "alternateName": ["TFF", "TFF eFootball", "Triad Champions League", "TCL"],
          "url": "https://tff-tournament-hub.pages.dev",
          "description": "Official website of the Triad Football Federation (TFF eFootball) and Triad Champions League (TCL). Follow eFootball competitions, live fixtures, standings, team power rankings, and Hall of Champions.",
          "sport": "eFootball",
          "keywords": "Triad Football Federation, Triad Champions League, TFF, TFF eFootball, Triad Football",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => data.subscription.unsubscribe();
  }, [router, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <PublicShell>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </PublicShell>
      <Toaster />
    </QueryClientProvider>
  );
}
