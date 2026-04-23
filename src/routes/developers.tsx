import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { DeveloperCard } from "@/components/DeveloperCard";
import { fetchAllProfiles, profileToDeveloper } from "@/data/queries";

export const Route = createFileRoute("/developers")({
  head: () => ({
    meta: [
      { title: "Developers — Bantabaa" },
      { name: "description", content: "Browse Gambian and West African developers. Find collaborators, mentors, and teammates." },
      { property: "og:title", content: "Developers — Bantabaa" },
      { property: "og:description", content: "Browse the Bantabaa developer directory." },
    ],
  }),
  loader: () => fetchAllProfiles(),
  errorComponent: ({ error }) => <div className="mx-auto max-w-md py-32 text-center text-muted-foreground">{error.message}</div>,
  component: DevelopersPage,
});

function DevelopersPage() {
  const profiles = Route.useLoaderData();
  const [query, setQuery] = useState("");
  const [openTo, setOpenTo] = useState<string>("All");

  const developers = useMemo(() => profiles.map(profileToDeveloper), [profiles]);
  const filtered = useMemo(() => developers
    .filter((d) => query === "" || (d.name + " " + d.title + " " + d.location + " " + d.skills.join(" ")).toLowerCase().includes(query.toLowerCase()))
    .filter((d) => openTo === "All" || d.openTo === openTo),
    [developers, query, openTo]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
      <p className="text-label text-[var(--kola)]">Directory</p>
      <h1 className="mt-2 font-display text-4xl font-bold text-foreground md:text-5xl">Meet the Developers</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
        Browse builders from across West Africa. Find collaborators, mentors, and teammates.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, skill, location…"
            className="w-72 rounded-full border border-border bg-card py-2 pl-9 pr-4 text-sm focus:border-[var(--kola)] focus:outline-none focus:ring-2 focus:ring-[var(--kola)]/30" />
        </div>
        <div className="flex flex-wrap gap-1">
          {["All", "Work", "Freelance", "Collaboration", "Mentoring"].map((o) => (
            <button key={o} onClick={() => setOpenTo(o)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${openTo === o ? "bg-[var(--kola)] text-[var(--kola-foreground)]" : "border border-border bg-card text-muted-foreground hover:bg-secondary"}`}>
              {o === "All" ? "All" : `Open to ${o}`}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10">
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
            <p className="font-display text-xl">{developers.length === 0 ? "No developers yet." : "No developers match that filter."}</p>
            <p className="mt-1 text-muted-foreground">{developers.length === 0 ? "Be the first to join." : "Try a different search."}</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4">
            {filtered.map((d) => <DeveloperCard key={d.handle} dev={d} />)}
          </div>
        )}
      </div>
    </div>
  );
}
