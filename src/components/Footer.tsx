import { Link } from "@tanstack/react-router";
import { Github, Twitter, Linkedin } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-3 max-w-sm font-display text-base italic text-foreground/85">
              Built under the tree. For the builders.
            </p>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Where West African developers gather. Build your identity, share your work, and find your place under the tree.
            </p>

            {/* Newsletter */}
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-6 max-w-md"
              aria-label="Newsletter signup"
            >
              <label htmlFor="footer-email" className="text-label text-muted-foreground">
                Get updates on what the community is building.
              </label>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                <input
                  id="footer-email"
                  type="email"
                  required
                  placeholder="you@yourcraft.dev"
                  className="flex-1 rounded-md border border-border bg-card px-4 py-2.5 text-sm text-foreground shadow-sm focus:border-[var(--kola)] focus:outline-none focus:ring-2 focus:ring-[var(--kola)]/30"
                />
                <Button
                  type="submit"
                  className="h-10 bg-[var(--kola)] px-5 text-[var(--kola-foreground)] hover:bg-[var(--kola)]/90"
                >
                  Subscribe
                </Button>
              </div>
            </form>

            <div className="mt-6 flex items-center gap-3">
              {[
                { href: "#", label: "GitHub", Icon: Github },
                { href: "#", label: "Twitter / X", Icon: Twitter },
                { href: "#", label: "LinkedIn", Icon: Linkedin },
              ].map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="rounded-md p-2 text-muted-foreground transition-colors hover:text-[var(--kola)]"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-label text-muted-foreground">Community</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/projects" className="text-foreground/80 hover:text-foreground">Projects</Link></li>
              <li><Link to="/spaces" className="text-foreground/80 hover:text-foreground">Spaces</Link></li>
              <li><Link to="/opportunities" className="text-foreground/80 hover:text-foreground">Opportunities</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-label text-muted-foreground">Bantabaa</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/about" className="text-foreground/80 hover:text-foreground">About</Link></li>
              <li><Link to="/for-companies" className="text-foreground/80 hover:text-foreground">For companies</Link></li>
              <li><Link to="/terms" className="text-foreground/80 hover:text-foreground">Terms</Link></li>
              <li><Link to="/privacy" className="text-foreground/80 hover:text-foreground">Privacy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Bantabaa. Built under the tree, with care.</p>
          <p>Banjul · Serrekunda · Dakar · Accra · Freetown · Lagos</p>
        </div>
      </div>
    </footer>
  );
}
