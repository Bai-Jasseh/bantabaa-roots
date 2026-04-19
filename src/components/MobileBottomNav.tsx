import { Link, useLocation } from "@tanstack/react-router";
import { Home, Briefcase, Users, User, FolderGit2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/projects", label: "Projects", icon: FolderGit2 },
  { to: "/opportunities", label: "Opps", icon: Briefcase },
  { to: "/spaces", label: "Spaces", icon: Users },
  { to: "/profile/amina-jallow", label: "Profile", icon: User },
] as const;

export function MobileBottomNav() {
  const location = useLocation();
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);
          return (
            <li key={item.to} className="flex-1">
              <Link
                to={item.to}
                className={cn(
                  "flex min-h-[56px] flex-col items-center justify-center gap-0.5 px-2 py-2 text-[10px] font-medium tracking-wide uppercase transition-colors",
                  isActive ? "text-[var(--kola)]" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-5" strokeWidth={isActive ? 2.4 : 1.8} />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
