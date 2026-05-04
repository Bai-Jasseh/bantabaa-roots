import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Search as SearchIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DeveloperCard } from "@/components/DeveloperCard";
import { ProjectCard } from "@/components/ProjectCard";
import { OpportunityCard } from "@/components/OpportunityCard";
import { SearchBar } from "@/components/SearchBar";
import { profileToDeveloper, projectRowToProject, opportunityRowToOpportunity } from "@/data/queries";
import type { Tables } from "@/integrations/supabase/types";

const searchSchema = z.object({ q: z.string().optional() });

export const Route = createFileRoute("/search")({
  validateSearch: searchSchema,
  head: ({ match }: { match: { search: { q?: string } } }) => ({
    meta: [
      { title: search.q ? `Search: ${search.q} — Bantabaa` : "Search — Bantabaa" },
      { name: "description", content: "Search developers, projects, and opportunities across Bantabaa." },
    ],
  }),
  component: SearchPage,
});

type ProfileRow = Tables<"profiles">;
type ProjectRow = Tables<"projects">;
type OpportunityRow = Tables<"opportunities">;

function SearchPage() {
  const { q } = Route.useSearch();
  const query = (q ?? "").trim();
  const [loading, setLoading] = useState(false);
  const [devs, setDevs] = useState<ProfileRow[]>([]);
  const [projects, setProjects] = useState<{ row: ProjectRow; builder: ProfileRow | null }[]>([]);
  const [opps, setOpps] = useState<OpportunityRow[]>([]);

  useEffect(() => {
    if (!query) { setDevs([]); setProjects([]); setOpps([]); return; }
    let cancelled = false;
    setLoading(true);
    (async () => {
      const like = `%${query}%`;
      const [pRes, projRes, oRes] = await Promise.all([
        supabase.from("profiles")
          .select("*")
          .or(`full_name.ilike.${like},handle.ilike.${like},title.ilike.${like},bio.ilike.${like},country.ilike.${like},city.ilike.${like}`)
          .limit(30),
        supabase.from("projects")
          .select("*")
          .or(`name.ilike.${like},description.ilike.${like},problem.ilike.${like},solution.ilike.${like}`)
          .limit(30),
        supabase.from("opportunities")
          .select("*")
          .or(`title.ilike.${like},company.ilike.${like},description.ilike.${like},location.ilike.${like}`)
          .limit(30),
      ]);
      if (cancelled) return;

      const projectRows = projRes.data ?? [];
      const builderIds = Array.from(new Set(projectRows.map((p) => p.builder_id)));
      const buildersData = builderIds.length
        ? (await supabase.from("profiles").select("*").in("id", builderIds)).data ?? []
        : [];
      const byId = new Map(buildersData.map((b) => [b.id, b]));

      setDevs(pRes.data ?? []);
      setProjects(projectRows.map((row) => ({ row, builder: byId.get(row.builder_id) ?? null })));
      setOpps(oRes.data ?? []);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [query]);

  const total = devs.length + projects.length + opps.length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
      <h1 className="font-display text-3xl font-bold md:text-4xl">Search</h1>
      <p className="mt-1 text-muted-foreground">Find developers, projects, and opportunities.</p>

      <div className="mt-6 max-w-xl">
        <SearchBar autoFocus />
      </div>

      {!query && (
        <div className="mt-16 rounded-2xl border border-dashed border-border p-12 text-center">
          <SearchIcon className="mx-auto size-8 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">Type something to search the gathering.</p>
        </div>
      )}

      {query && (
        <div className="mt-8">
          <p className="text-sm text-muted-foreground">
            {loading ? "Searching…" : `${total} result${total === 1 ? "" : "s"} for `}
            {!loading && <span className="font-semibold text-foreground">"{query}"</span>}
          </p>

          {!loading && total === 0 && (
            <div className="mt-10 rounded-2xl border border-dashed border-border p-12 text-center">
              <p className="text-sm text-muted-foreground">Nothing matched. Try a different word.</p>
            </div>
          )}

          {devs.length > 0 && (
            <section className="mt-10">
              <h2 className="font-display text-xl font-semibold">Developers</h2>
              <div className="mt-4 flex flex-wrap gap-4">
                {devs.map((p) => <DeveloperCard key={p.id} dev={profileToDeveloper(p)} />)}
              </div>
            </section>
          )}

          {projects.length > 0 && (
            <section className="mt-10">
              <h2 className="font-display text-xl font-semibold">Projects</h2>
              <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map(({ row, builder }) => (
                  <ProjectCard key={row.id} project={projectRowToProject(row, builder, 0, 0)} />
                ))}
              </div>
            </section>
          )}

          {opps.length > 0 && (
            <section className="mt-10">
              <h2 className="font-display text-xl font-semibold">Opportunities</h2>
              <div className="mt-4 grid gap-4">
                {opps.map((o) => <OpportunityCard key={o.id} opp={opportunityRowToOpportunity(o)} />)}
              </div>
            </section>
          )}
        </div>
      )}

      <div className="mt-12">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Back home</Link>
      </div>
    </div>
  );
}
