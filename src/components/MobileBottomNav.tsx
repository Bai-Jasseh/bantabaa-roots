import { Link, useLocation } from "@tanstack/react-router";
import { Home, Layers, Briefcase, MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

type Item = { to: string; label: string; icon: typeof Home; exact?: boolean };
const ITEMS: Item[] = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/projects", label: "Projects", icon: Layers },
  { to: "/opportunities", label: "Opps", icon: Briefcase },
  { to: "/spaces", label: "Spaces", icon: MessageCircle },
  { to: "/profile/amina-jallow", label: "Profile", icon: User },
];

const tap = (e: React.MouseEvent<HTMLAnchorElement>) => {
  // Subtle press feedback. Fail silently when unsupported.
  try {
    if ("vibrate" in navigator) navigator.vibrate(8);
  } catch {}
  const el = e.currentTarget.querySelector("[data-icon]") as HTMLElement | null;
  if (el) {
    el.style.transform = "scale(0.85)";
    setTimeout(() => {
      el.style.transform = "";
    }, 140);
  }
};

export function MobileBottomNav() {
  const location = useLocation();
  return (
    <nav
      aria-label="Primary"
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 md:hidden",
        "border-t border-border/80",
        "bg-background/85 supports-[backdrop-filter]:bg-background/70 backdrop-blur-xl",
        "pb-[env(safe-area-inset-bottom)]",
      )}
      style={{ minHeight: "calc(64px + env(safe-area-inset-bottom))" }}
    >
      <ul className="mx-auto flex h-16 max-w-md items-stretch justify-around px-1">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);
          return (
            <li key={item.to} className="flex-1">
              <Link
                to={item.to}
                onClick={tap}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group relative flex h-full min-h-[56px] flex-col items-center justify-center gap-1 px-2 text-[11px] font-medium transition-colors",
                  "tap-highlight-transparent",
                  isActive ? "text-[var(--kola)]" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex size-9 items-center justify-center rounded-full transition-colors",
                    isActive && "bg-[var(--kola)]/12",
                  )}
                >
                  <Icon
                    data-icon
                    className="size-[22px] transition-transform duration-150 ease-out"
                    strokeWidth={isActive ? 2.4 : 1.9}
                  />
                </span>
                <span className="leading-none">{item.label}</span>
                {isActive && (
                  <span
                    aria-hidden
                    className="absolute -top-px left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-[var(--kola)]"
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
