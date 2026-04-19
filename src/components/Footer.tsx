import { Link } from "@tanstack/react-router";
import { Github, Twitter, Linkedin } from "lucide-react";
import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Where West African developers gather. Build your identity, share your work, and find your place under the tree.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a href="#" aria-label="GitHub" className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                <Github className="size-4" />
              </a>
              <a href="#" aria-label="Twitter" className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                <Twitter className="size-4" />
              </a>
              <a href="#" aria-label="LinkedIn" className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                <Linkedin className="size-4" />
              </a>
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
              <li><a href="#" className="text-foreground/80 hover:text-foreground">Privacy</a></li>
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
