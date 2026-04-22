import { Outlet, Link, createRootRoute, HeadContent, Scripts, ScriptOnce } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { InstallPrompt } from "@/components/InstallPrompt";
import { Toaster } from "@/components/ui/sonner";

const themeScript = `(function(){try{var t=localStorage.getItem("bantabaa-theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark");}}catch(e){}})();`;

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 font-display text-2xl font-semibold text-foreground">Lost under the canopy</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for has wandered off. Let's get you back to the gathering.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex h-10 items-center justify-center rounded-md bg-[var(--kola)] px-5 text-sm font-medium text-[var(--kola-foreground)] transition-colors hover:bg-[var(--kola)]/90"
          >
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#FAF6F0", media: "(prefers-color-scheme: light)" },
      { name: "theme-color", content: "#0F0A08", media: "(prefers-color-scheme: dark)" },
      { name: "color-scheme", content: "light dark" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "apple-mobile-web-app-title", content: "Bantabaa" },
      { name: "format-detection", content: "telephone=no" },
      { title: "Bantabaa — Where West African developers gather" },
      { name: "description", content: "The professional home for West African developers. Build your identity, share your work, find your opportunity." },
      { name: "author", content: "Bantabaa" },
      { property: "og:title", content: "Bantabaa — Where West African developers gather" },
      { property: "og:description", content: "Build your identity, share your work, find your opportunity. Built natively for Gambian and West African developers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "icon", href: "/icon-192.png" },
      { rel: "apple-touch-icon", href: "/icon-192.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=DM+Sans:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ScriptOnce>{themeScript}</ScriptOnce>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navigation />
      <main className="flex-1 pb-[calc(64px+env(safe-area-inset-bottom))] md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
      <InstallPrompt />
      <Toaster />
    </div>
  );
}
