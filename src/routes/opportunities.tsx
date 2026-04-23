import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OpportunityCard, type Opportunity, type OpportunityType } from "@/components/OpportunityCard";
import { CountUp } from "@/components/CountUp";
import { fetchOpportunities, fetchMySavedOpps } from "@/data/queries";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/opportunities")({
  head: () => ({
    meta: [
      { title: "Opportunities — Bantabaa" },
      { name: "description", content: "Jobs, contracts, grants, and mentorship — built for West African developers." },
      { property: "og:title", content: "Your Next Opportunity Is Under the Tree — Bantabaa" },
      { property: "og:description", content: "Curated opportunities for West African developers." },
    ],
  }),
  loader: () => fetchOpportunities(),
  errorComponent: ({ error }) => <div className="mx-auto max-w-md py-32 text-center text-muted-foreground">{error.message}</div>,
  component: OpportunitiesPage,
});

const TABS: { key: OpportunityType | "All"; label: string }[] = [
  { key: "All", label: "All" }, { key: "Job", label: "Jobs" }, { key: "Contract", label: "Contracts" },
  { key: "Grant", label: "Grants & Fellowships" }, { key: "Mentorship", label: "Mentorship" },
];
const LOCATIONS = ["All", "Remote", "Gambia", "West Africa", "Global"];
const EXPERIENCE = ["All", "Junior", "Mid", "Senior"] as const;
const COMPENSATION = ["All", "Paid", "Volunteer"] as const;

function OpportunitiesPage() {
  const opportunities = Route.useLoaderData();
  const { user } = useAuth();
  const [savedSet, setSavedSet] = useState<Set<string>>(new Set());
  const [tab, setTab] = useState<typeof TABS[number]["key"]>("All");
  const [location, setLocation] = useState("All");
  const [experience, setExperience] = useState<(typeof EXPERIENCE)[number]>("All");
  const [comp, setComp] = useState<(typeof COMPENSATION)[number]>("All");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 240);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!user) { setSavedSet(new Set()); return; }
    fetchMySavedOpps(user.id).then(setSavedSet);
  }, [user]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: opportunities.length };
    opportunities.forEach((o) => { c[o.type] = (c[o.type] ?? 0) + 1; });
    return c;
  }, [opportunities]);

  const filtered: Opportunity[] = useMemo(() => opportunities
    .filter((o) => tab === "All" || o.type === tab)
    .filter((o) => location === "All" || o.location.includes(location) || (location === "Remote" && o.locationType === "Remote"))
    .filter((o) => experience === "All" || o.experience === experience)
    .filter((o) => {
      if (comp === "All") return true;
      const isVolunteer = (o.compensation ?? "").toLowerCase().includes("volunteer");
      return comp === "Volunteer" ? isVolunteer : !isVolunteer;
    }), [opportunities, tab, location, experience, comp]);

  const featured = filtered.find((o) => o.featured);
  const regular = filtered.filter((o) => o !== featured);
  const useGrid = tab === "Job" || tab === "Contract";

  const activeFilters: { label: string; clear: () => void }[] = [];
  if (location !== "All") activeFilters.push({ label: location, clear: () => setLocation("All") });
  if (experience !== "All") activeFilters.push({ label: experience, clear: () => setExperience("All") });
  if (comp !== "All") activeFilters.push({ label: comp, clear: () => setComp("All") });

  return (
    <div>
      <div className="mx-auto max-w-6xl px-4 pt-12 md:px-6 md:pt-16">
        <div className="max-w-3xl">
          <p className="text-label text-[var(--kola)]">Opportunities</p>
          <h1 className="mt-2 font-display font-bold text-foreground" style={{ fontSize: "clamp(2.25rem, 5vw, 3rem)", lineHeight: 1.05 }}>
            Your Next Opportunity Is Under the Tree.
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Jobs, contracts, grants, and mentorship built for West African developers.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#listings"><Button className="h-11 bg-[var(--kola)] text-[var(--kola-foreground)] hover:bg-[var(--kola)]/90">Find Opportunity</Button></a>
            <Link to="/opportunities/new"><Button variant="outline" className="h-11"><Plus className="size-4" /> Post an Opportunity</Button></Link>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-3 gap-4 rounded-2xl border border-border bg-[var(--cream)] p-6 dark:bg-card">
          <Stat value={opportunities.length} label="Opportunities Active" />
          <Stat value={new Set(opportunities.map((o) => o.company)).size} label="Companies Hiring" />
          <Stat value={savedSet.size} label="You've Saved" />
        </div>
      </div>

      <div id="listings" className={`sticky top-16 z-30 mt-10 transition-all ${scrolled ? "shadow-nav" : ""}`} style={{ backgroundColor: "var(--cream)", borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent" }}>
        <div className="mx-auto max-w-6xl px-4 py-3 md:px-6">
          <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
            <div className="flex min-w-max items-center gap-1.5">
              {TABS.map((t) => (
                <button key={t.key} onClick={() => setTab(t.key)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${tab === t.key ? "bg-[var(--baobab)] text-[var(--baobab-foreground)] shadow-sm" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
                  {t.label}
                  <span className={`rounded-full px-2 py-0.5 text-[11px] ${tab === t.key ? "bg-white/15 text-white" : "bg-[var(--kola)]/15 text-[var(--kola)]"}`}>{counts[t.key] ?? 0}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
            <FilterGroup label="Location" options={LOCATIONS} value={location} onChange={setLocation} />
            <FilterGroup label="Level" options={[...EXPERIENCE]} value={experience} onChange={(v) => setExperience(v as typeof experience)} />
            <FilterGroup label="Pay" options={[...COMPENSATION]} value={comp} onChange={(v) => setComp(v as typeof comp)} />
          </div>
          {activeFilters.length > 0 && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {activeFilters.map((f) => (
                <button key={f.label} onClick={f.clear} className="inline-flex items-center gap-1 rounded-full bg-[var(--kola)]/15 px-2.5 py-1 text-xs font-medium text-[var(--kola)] hover:bg-[var(--kola)]/25">
                  {f.label} <X className="size-3" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        {opportunities.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
            <p className="font-display text-xl">No opportunities posted yet.</p>
            <p className="mt-1 text-muted-foreground">Be the first to share something with the community.</p>
            <Link to="/opportunities/new"><Button className="mt-4 bg-[var(--kola)] text-[var(--kola-foreground)] hover:bg-[var(--kola)]/90"><Plus className="size-4" /> Post an Opportunity</Button></Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
            <p className="font-display text-xl">Nothing matches these filters.</p>
            <Button onClick={() => { setLocation("All"); setExperience("All"); setComp("All"); }} variant="outline" className="mt-4">Clear Filters</Button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={`${tab}-${location}-${experience}-${comp}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="space-y-4">
              {featured && <OpportunityCard op={featured} featured initialSaved={savedSet.has(featured.id)} />}
              <div className={useGrid ? "grid gap-4 md:grid-cols-2" : "space-y-4"}>
                {regular.map((o) => <OpportunityCard key={o.id} op={o} initialSaved={savedSet.has(o.id)} />)}
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <div className="sticky bottom-20 mx-4 mb-10 rounded-2xl border border-[var(--kola)]/30 bg-[var(--baobab)] p-5 text-[var(--baobab-foreground)] shadow-warm md:bottom-6 md:mx-auto md:max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium">Hiring African developer talent? Post an opportunity on Bantabaa.</p>
          <Link to="/opportunities/new"><Button className="bg-[var(--kola)] text-[var(--kola-foreground)] hover:bg-[var(--kola)]/90">Post now <ArrowRight className="size-4" /></Button></Link>
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <CountUp to={value} className="block font-display text-3xl font-bold text-[var(--kola)] md:text-4xl" />
      <p className="mt-1 text-xs text-muted-foreground md:text-sm">{label}</p>
    </div>
  );
}

function FilterGroup({ label, options, value, onChange }: { label: string; options: readonly string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}:</span>
      <div className="flex flex-wrap gap-1">
        {options.map((o) => (
          <button key={o} onClick={() => onChange(o)}
            className={`rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-200 ${value === o ? "bg-[var(--kola)] text-[var(--kola-foreground)]" : "border border-border bg-card text-muted-foreground hover:bg-secondary"}`}>
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
