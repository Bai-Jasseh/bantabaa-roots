import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OpportunityCard } from "@/components/OpportunityCard";
import { SAMPLE_OPPORTUNITIES } from "@/data/sample";
import type { OpportunityType } from "@/components/OpportunityCard";

export const Route = createFileRoute("/opportunities")({
  head: () => ({
    meta: [
      { title: "Opportunities — Bantabaa" },
      { name: "description", content: "Jobs, contracts, grants, and mentorship — built for West African developers." },
      { property: "og:title", content: "Opportunities — Bantabaa" },
      { property: "og:description", content: "Jobs, contracts, grants, and mentorship — built for West African developers." },
    ],
  }),
  component: OpportunitiesPage,
});

const TABS: { key: OpportunityType | "All"; label: string }[] = [
  { key: "All", label: "All" },
  { key: "Job", label: "Jobs" },
  { key: "Contract", label: "Contracts" },
  { key: "Grant", label: "Grants & Fellowships" },
  { key: "Mentorship", label: "Mentorship" },
];

function OpportunitiesPage() {
  const [tab, setTab] = useState<typeof TABS[number]["key"]>("All");
  const list = SAMPLE_OPPORTUNITIES.filter((o) => tab === "All" || o.type === tab);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-label text-[var(--kola)]">Find your next move</p>
          <h1 className="mt-2 font-display text-4xl font-bold text-foreground md:text-5xl">Opportunities</h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Jobs, contracts, grants, and mentorship — built for West African developers.
          </p>
        </div>
        <Link to="/for-companies">
          <Button variant="outline" className="h-11">
            <Plus className="size-4" /> Post an opportunity
          </Button>
        </Link>
      </div>

      <div className="mt-8 -mx-4 overflow-x-auto px-4">
        <div className="flex min-w-max gap-1 border-b border-border">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative px-4 py-3 text-sm font-medium transition-colors ${
                tab === t.key ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
              {tab === t.key && (
                <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-[var(--kola)]" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        {["All locations", "Remote", "Gambia", "West Africa", "Global", "Junior", "Mid", "Senior"].map((f) => (
          <button key={f} className="rounded-full border border-border bg-card px-3 py-1 text-muted-foreground hover:bg-secondary">
            {f}
          </button>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        {list.map((o) => <OpportunityCard key={o.id} op={o} />)}
        {list.length === 0 && (
          <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
            <p className="font-display text-xl">No openings right now.</p>
            <p className="mt-1 text-muted-foreground">Check back soon — the tree is always growing.</p>
          </div>
        )}
      </div>

      <div className="sticky bottom-20 mt-12 rounded-2xl border border-[var(--kola)]/30 bg-[var(--baobab)] p-5 text-[var(--baobab-foreground)] shadow-warm md:bottom-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium">Hiring African developer talent? Post an opportunity on Bantabaa.</p>
          <Link to="/for-companies">
            <Button className="bg-[var(--kola)] text-[var(--kola-foreground)] hover:bg-[var(--kola)]/90">
              Post now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
