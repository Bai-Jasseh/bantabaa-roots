import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectCard, type Project } from "@/components/ProjectCard";
import { fetchProjectsWithBuilders } from "@/data/queries";

const DOMAINS = ["Fintech", "Agritech", "Healthtech", "Edtech", "Govtech", "Open Source", "Other"] as const;

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Bantabaa" },
      { name: "description", content: "What Gambian and West African developers are building." },
      { property: "og:title", content: "What We Are Building — Bantabaa" },
      { property: "og:description", content: "A gallery of projects by West African developers." },
    ],
  }),
  loader: () => fetchProjectsWithBuilders(),
  errorComponent: ({ error }) => <div className="mx-auto max-w-md py-32 text-center text-muted-foreground">{error.message}</div>,
  component: ProjectsPage,
});

function ProjectsPage() {
  const data = Route.useLoaderData();
  const [domain, setDomain] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 320);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const projects: (Project & { id: string })[] = useMemo(
    () => data.map((d) => ({ ...d.project, id: d.row.id })),
    [data]
  );

  const list = useMemo(() => projects
    .filter((p) => domain === "All" || p.domain === domain)
    .filter((p) => query === "" || (p.name + " " + p.description + " " + p.stack.join(" ")).toLowerCase().includes(query.toLowerCase())),
    [projects, domain, query]);

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 pt-12 md:px-6 md:pt-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-label text-[var(--kola)]">Showcase</p>
            <h1 className="mt-2 font-display font-bold text-foreground" style={{ fontSize: "clamp(2.25rem, 5vw, 3rem)", lineHeight: 1.05 }}>
              What We Are Building
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">Projects by Gambian and West African developers solving real problems.</p>
          </div>
          <Link to="/projects/new">
            <Button className="h-11 w-full bg-[var(--kola)] text-[var(--kola-foreground)] hover:bg-[var(--kola)]/90 sm:w-auto">
              <Plus className="size-4" /> Share Your Project
            </Button>
          </Link>
        </div>
      </div>

      <div className={`sticky top-16 z-30 mt-8 transition-all ${scrolled ? "shadow-nav" : ""}`} style={{ backgroundColor: "var(--cream)", borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent" }}>
        <div className="mx-auto max-w-7xl space-y-3 px-4 py-3 md:px-6">
          <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
            <div className="flex min-w-max items-center gap-1.5">
              {(["All", ...DOMAINS] as const).map((d) => (
                <button key={d} onClick={() => setDomain(d)}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${domain === d ? "bg-[var(--kola)] text-[var(--kola-foreground)] shadow-sm" : "border border-border bg-card text-foreground/80 hover:bg-secondary"}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search projects, stacks, builders…"
                className="w-64 rounded-full border border-border bg-card py-2 pl-9 pr-4 text-sm" />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 md:px-6">
        {list.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-dashed border-border bg-card p-12 text-center">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-[var(--kola)]/15 text-[var(--kola)]">🌳</div>
            <p className="font-display text-xl">{projects.length === 0 ? "No projects yet under the tree." : "Nothing matches that filter."}</p>
            <p className="mt-1 text-muted-foreground">{projects.length === 0 ? "Be the first to share." : "Try a different domain or search."}</p>
            <Link to="/projects/new"><Button className="mt-4 bg-[var(--kola)] text-[var(--kola-foreground)] hover:bg-[var(--kola)]/90"><Plus className="size-4" /> Share Your Project</Button></Link>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={`${domain}-${query}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((p, i) => (
                <motion.div key={p.slug} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, duration: 0.35 }}>
                  <ProjectCard project={p} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

export function ProjectsListSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-12">
      <Skeleton className="h-12 w-1/2" />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-72" />)}
      </div>
    </div>
  );
}
