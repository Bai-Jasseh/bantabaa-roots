import { createFileRoute, Link } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SAMPLE_SPACES } from "@/data/sample";

export const Route = createFileRoute("/spaces")({
  head: () => ({
    meta: [
      { title: "Spaces — Bantabaa" },
      { name: "description", content: "Find your people. Join the conversation. Spaces by domain, stage, and country across the West African developer community." },
      { property: "og:title", content: "Community Spaces — Bantabaa" },
      { property: "og:description", content: "Find your people. Join the conversation." },
    ],
  }),
  component: SpacesPage,
});

function SpacesPage() {
  const groups = ["Domain", "Stage", "Country"] as const;
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
      <p className="text-label text-[var(--kola)]">Gather</p>
      <h1 className="mt-2 font-display text-4xl font-bold text-foreground md:text-5xl">Spaces</h1>
      <p className="mt-2 max-w-xl text-muted-foreground">Find your people. Join the conversation.</p>

      {groups.map((g) => (
        <section key={g} className="mt-12">
          <h2 className="font-display text-2xl font-semibold text-foreground">By {g}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SAMPLE_SPACES.filter((s) => s.category === g).map((s) => {
              const soon = "comingSoon" in s && s.comingSoon;
              const Card = (
                <div className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-warm">
                  <div className="flex items-start justify-between">
                    <div className="text-3xl">{s.emoji}</div>
                    {soon && <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">Coming soon</span>}
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground">{s.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{s.blurb}</p>
                  </div>
                  <div className="mt-auto flex items-center justify-between text-sm">
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <Users className="size-3.5" /> {s.members.toLocaleString()} members
                    </span>
                    <Button size="sm" variant={soon ? "ghost" : "outline"} disabled={soon}>
                      {soon ? "Soon" : "Join"}
                    </Button>
                  </div>
                </div>
              );
              return soon ? (
                <div key={s.slug} className="opacity-70">{Card}</div>
              ) : (
                <Link key={s.slug} to="/spaces/$slug" params={{ slug: s.slug }} className="block">{Card}</Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
