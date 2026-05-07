import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, LogOut, Plus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { SearchBar } from "@/components/SearchBar";
import { NotificationsBell } from "@/components/NotificationsBell";

const NAV_LINKS = [
  { to: "/developers", label: "Developers" },
  { to: "/projects", label: "Projects" },
  { to: "/opportunities", label: "Opportunities" },
  { to: "/spaces", label: "Community" },
  { to: "/for-companies", label: "For Companies" },
] as const;

const POST_LINKS = [
  { to: "/projects/new", label: "Post a project" },
  { to: "/opportunities/new", label: "Post an opportunity" },
] as const;

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 pt-[env(safe-area-inset-top)]",
        scrolled
          ? "border-b border-border bg-background/85 shadow-nav backdrop-blur-md supports-[backdrop-filter]:bg-background/70"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center" aria-label="Bantabaa home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="nav-link rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
              activeProps={{ "data-active": "true", className: "text-foreground" } as never}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden lg:block w-64"><SearchBar /></div>
          <ThemeToggle />
          <NotificationsBell />
          {user ? (
            <>
              {profile?.handle && (
                <Link to="/profile/$handle" params={{ handle: profile.handle }} className="hidden md:block">
                  <Button variant="ghost" className="h-9">My Profile</Button>
                </Link>
              )}
              <Button variant="ghost" size="icon" className="hidden md:inline-flex" onClick={signOut} aria-label="Sign out">
                <LogOut className="size-4" />
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="hidden md:block">
                <Button variant="ghost" className="h-9 text-foreground">Log in</Button>
              </Link>
              <Link to="/onboarding" className="hidden md:block">
                <Button className="h-9 bg-[var(--kola)] text-[var(--kola-foreground)] hover:bg-[var(--kola)]/90">
                  Join Bantabaa
                </Button>
              </Link>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="flex flex-col gap-1 px-4 py-4">
            <div className="px-1 pb-2"><SearchBar /></div>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-base font-medium text-foreground hover:bg-secondary"
              >
                {link.label}
              </Link>
            ))}
            <div className="my-2 border-t border-border" />
            {POST_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-base font-medium text-[var(--kola)] hover:bg-secondary"
              >
                + {link.label}
              </Link>
            ))}
            <Link to="/onboarding" onClick={() => setOpen(false)}>
              <Button className="mt-2 h-11 w-full bg-[var(--kola)] text-[var(--kola-foreground)] hover:bg-[var(--kola)]/90">
                Join Bantabaa
              </Button>
            </Link>
            <p className="mt-4 px-3 pb-2 text-xs italic text-muted-foreground">
              Where West African developers gather.
            </p>
          </nav>
        </div>
      )}
    </header>
  );
}
