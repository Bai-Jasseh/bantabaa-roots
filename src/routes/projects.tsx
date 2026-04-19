import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/ProjectCard";
import { TagPill } from "@/components/TagPill";
import { SAMPLE_PROJECTS, DOMAINS } from "@/data/sample";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Bantabaa" },
      { name: "description", content: "What Gambian and West African developers are building. Browse projects across fintech, agritech, healthtech, edtech, and govtech." },
      { property: "og:title", content: "Projects — Bantabaa" },
      { property: "og:description", content: "What Gambian developers are building." },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const [domain, setDomain] = useState<string>("All");
  const [sort, setSort] = useState<"latest" | "discussed" | "appreciated">("latest");
  const list = SAMPLE_PROJECTS
    .filter((p) => domain === "All" || p.domain === domain)
    .slice()
    .sort((a, b) =>
      sort === "appreciated" ? b.appreciate - a.appreciate :
      sort === "discussed" ? b.discuss - a.discuss : 0,
    );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-label text-[var(--kola)]">Showcase</p>
          <h1 className="mt-2 font-display text-4xl font-bold text-foreground md:text-5xl">Projects</h1>
          <p className="mt-2 max-w-xl text-muted-foreground">What Gambian developers are building.</p>
        </div>
        <Link to="/onboarding">
          <Button className="h-11 bg-[var(--kola)] text-[var(--kola-foreground)] hover:bg-[var(--kola)]/90">
            <Plus className="size-4" /> Share your project
          </Button>
        </Link>
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {["All", ...DOMAINS].map((d) => (
            <button
              key={d}
              onClick={() => setDomain(d)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                domain === d
                  ? "bg-[var(--baobab)] text-[var(--baobab-foreground)]"
                  : "border border-border bg-card text-foreground/80 hover:bg-secondary"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search projects, stacks, builders…"
              className="w-full rounded-full border border-border bg-card py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-[var(--kola)] focus:outline-none focus:ring-2 focus:ring-[var(--kola)]/30"
            />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">Sort:</span>
            {([["latest", "Latest"], ["discussed", "Most discussed"], ["appreciated", "Most appreciated"]] as const).map(([k, l]) => (
              <button
                key={k}
                onClick={() => setSort(k)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium ${sort === k ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => <ProjectCard key={p.slug} project={p} />)}
      </div>

      {list.length === 0 && (
        <div className="mt-16 rounded-3xl border border-dashed border-border bg-card p-12 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-[var(--kola)]/15 text-[var(--kola)]">🌳</div>
          <p className="font-display text-xl">Nothing here yet.</p>
          <p className="mt-1 text-muted-foreground">Be the first to share something under the tree.</p>
          <div className="mt-4 flex justify-center gap-2">
            <TagPill>Try removing filters</TagPill>
          </div>
        </div>
      )}
    </div>
  );
}
