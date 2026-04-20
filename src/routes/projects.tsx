import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, X, ArrowRight, ExternalLink, Github } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/ProjectCard";
import { TagPill } from "@/components/TagPill";
import { Avatar } from "@/components/DeveloperCard";
import { CountUp } from "@/components/CountUp";
import { ReactionStrip } from "@/components/ReactionStrip";
import { SAMPLE_PROJECTS, DOMAINS } from "@/data/sample";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Bantabaa" },
      { name: "description", content: "What Gambian and West African developers are building. Browse projects across fintech, agritech, healthtech, edtech, govtech and open source." },
      { property: "og:title", content: "What We Are Building — Bantabaa" },
      { property: "og:description", content: "A gallery of projects by West African developers." },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const [domain, setDomain] = useState<string>("All");
  const [country, setCountry] = useState<string>("All");
  const [sort, setSort] = useState<"latest" | "discussed" | "appreciated">("latest");
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 320);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const featured = useMemo(() => SAMPLE_PROJECTS.find((p) => p.featured) ?? SAMPLE_PROJECTS[0], []);
  const list = useMemo(() => SAMPLE_PROJECTS
    .filter((p) => p.slug !== featured.slug)
    .filter((p) => domain === "All" || p.domain === domain)
    .filter((p) => country === "All" || (p.builder.location ?? "").includes(country))
    .filter((p) => query === "" || (p.name + " " + p.description + " " + p.stack.join(" ")).toLowerCase().includes(query.toLowerCase()))
    .slice()
    .sort((a, b) =>
      sort === "appreciated" ? b.appreciate - a.appreciate :
      sort === "discussed" ? b.discuss - a.discuss :
      (a.postedDays ?? 99) - (b.postedDays ?? 99),
    ), [domain, country, sort, query, featured.slug]);

  const filtersActive = domain !== "All" || country !== "All" || query !== "";
  const clearFilters = () => { setDomain("All"); setCountry("All"); setQuery(""); };

  return (
    <div>
      {/* Header */}
      <div className="mx-auto max-w-7xl px-4 pt-12 md:px-6 md:pt-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <p className="text-label text-[var(--kola)]">Showcase</p>
            <h1 className="mt-2 font-display font-bold text-foreground" style={{ fontSize: "clamp(2.25rem, 5vw, 3rem)", lineHeight: 1.05 }}>
              What We Are Building
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Projects by Gambian and West African developers solving real problems.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              <CountUp to={SAMPLE_PROJECTS.length * 23} className="font-display text-base font-bold text-[var(--kola)]" /> projects shared by developers across West Africa.
            </p>
          </motion.div>
          <Button
            onClick={() => setShareOpen(true)}
            className="h-11 w-full bg-[var(--kola)] text-[var(--kola-foreground)] hover:bg-[var(--kola)]/90 sm:w-auto"
          >
            <Plus className="size-4" /> Share Your Project
          </Button>
        </div>
      </div>

      {/* Sticky filter bar */}
      <div className={`sticky top-16 z-30 mt-8 -mx-0 transition-all ${scrolled ? "shadow-nav" : ""}`} style={{ backgroundColor: "var(--cream)", borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent" }}>
        <div className="mx-auto max-w-7xl space-y-3 px-4 py-3 md:px-6">
          <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
            <div className="flex min-w-max items-center gap-1.5">
              {(["All", ...DOMAINS] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDomain(d)}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
                    domain === d
                      ? "bg-[var(--kola)] text-[var(--kola-foreground)] shadow-sm"
                      : "border border-border bg-card text-foreground/80 hover:bg-secondary"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search projects, stacks, builders…"
                  className="w-64 rounded-full border border-border bg-card py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-[var(--kola)] focus:outline-none focus:ring-2 focus:ring-[var(--kola)]/30"
                />
              </div>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="rounded-full border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-[var(--kola)] focus:outline-none"
              >
                <option value="All">All countries</option>
                <option value="Gambia">Gambia</option>
                <option value="Senegal">Senegal</option>
                <option value="Ghana">Ghana</option>
                <option value="Sierra Leone">Sierra Leone</option>
              </select>
              {filtersActive && (
                <button onClick={clearFilters} className="text-xs font-medium text-muted-foreground hover:text-[var(--kola)]">
                  Clear filters
                </button>
              )}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">Sort:</span>
              {([["latest", "Latest"], ["discussed", "Most discussed"], ["appreciated", "Most appreciated"]] as const).map(([k, l]) => (
                <button
                  key={k}
                  onClick={() => setSort(k)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${sort === k ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Featured */}
      {!filtersActive && featured && (
        <div className="mx-auto max-w-7xl px-4 pt-8 md:px-6">
          <FeaturedProject project={featured} />
        </div>
      )}

      {/* Grid */}
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 md:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${domain}-${country}-${sort}-${query}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {list.map((p, i) => (
              <motion.div
                key={p.slug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.35, ease: "easeOut" }}
              >
                <ProjectCard project={p} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {list.length === 0 && (
          <div className="mt-12 rounded-3xl border border-dashed border-border bg-card p-12 text-center">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-[var(--kola)]/15 text-[var(--kola)]">🌳</div>
            <p className="font-display text-xl">Nothing here yet.</p>
            <p className="mt-1 text-muted-foreground">No projects match this filter. Try a different domain or be the first to build in this space.</p>
            <Button onClick={clearFilters} variant="outline" className="mt-4">Clear Filters</Button>
          </div>
        )}
      </div>

      <ShareProjectModal open={shareOpen} onClose={() => setShareOpen(false)} />
    </div>
  );
}

function FeaturedProject({ project }: { project: typeof SAMPLE_PROJECTS[number] }) {
  const color = `var(--domain-${project.domain.toLowerCase().replace(" ", "")})`;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="overflow-hidden rounded-3xl border border-border bg-[oklch(0.97_0.022_75)] shadow-soft md:flex"
      style={{ borderLeft: "4px solid var(--kola)" }}
    >
      <div
        className="relative aspect-[16/10] md:aspect-auto md:w-[55%]"
        style={{
          background: `linear-gradient(135deg, color-mix(in oklab, ${color} 60%, var(--baobab)) 0%, color-mix(in oklab, ${color} 30%, var(--background)) 100%)`,
        }}
      >
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage:
            "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.18) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(0,0,0,0.18) 0%, transparent 50%)",
        }} />
        <div className="absolute left-4 bottom-4">
          <TagPill variant="domain" domain={project.domain} />
        </div>
      </div>
      <div className="flex flex-col justify-center gap-4 p-8 md:w-[45%]">
        <p className="text-label text-[var(--kola)]">Featured Project</p>
        <h2 className="font-display text-3xl font-bold text-foreground">{project.name}</h2>
        <p className="line-clamp-3 text-base text-muted-foreground">{project.description}</p>
        <Link
          to="/profile/$handle"
          params={{ handle: project.builder.handle }}
          className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 hover:bg-secondary"
        >
          <Avatar name={project.builder.name} hue={project.builder.hue} />
          <div className="min-w-0">
            <div className="font-display font-semibold text-foreground">{project.builder.name}</div>
            <div className="text-xs text-muted-foreground">{project.builder.flag} {project.builder.location}</div>
          </div>
        </Link>
        <div className="flex flex-wrap gap-1.5">
          {project.stack.map((t) => <TagPill key={t} variant="outlined">{t}</TagPill>)}
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/projects/$slug" params={{ slug: project.slug }}>
            <Button className="bg-[var(--kola)] text-[var(--kola-foreground)] hover:bg-[var(--kola)]/90">
              View Project <ArrowRight className="size-4" />
            </Button>
          </Link>
          <Link to="/profile/$handle" params={{ handle: project.builder.handle }}>
            <Button variant="outline">View Builder Profile</Button>
          </Link>
        </div>
        <div className="border-t border-border pt-3">
          <ReactionStrip appreciate={project.appreciate} discuss={project.discuss} />
        </div>
      </div>
    </motion.div>
  );
}

const STEPS = ["Basics", "Story", "Tech & Links", "Preview"] as const;

function ShareProjectModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");

  if (!open) return null;

  const submit = () => {
    toast.success("Your project is now under the tree. The community can see it.");
    onClose();
    setTimeout(() => { setStep(0); setName(""); setTagline(""); }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm md:items-center" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[640px] rounded-t-[20px] bg-card p-6 shadow-warm md:rounded-[20px] md:p-10"
      >
        <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-secondary" aria-label="Close">
          <X className="size-4" />
        </button>
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <span
              key={s}
              className={`size-2 rounded-full transition-colors ${i === step ? "bg-[var(--kola)]" : i < step ? "bg-[var(--kola)]/40" : "bg-border"}`}
            />
          ))}
          <span className="ml-2 text-xs text-muted-foreground">Step {step + 1} of {STEPS.length} · {STEPS[step]}</span>
        </div>

        <div className="mt-6">
          {step === 0 && (
            <div className="space-y-4">
              <h3 className="font-display text-2xl font-semibold">Tell us about your project</h3>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Project name" className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:border-[var(--kola)] focus:outline-none focus:ring-2 focus:ring-[var(--kola)]/30" />
              <div>
                <input value={tagline} onChange={(e) => setTagline(e.target.value.slice(0, 120))} placeholder="One-line description" className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:border-[var(--kola)] focus:outline-none focus:ring-2 focus:ring-[var(--kola)]/30" />
                <p className="mt-1 text-right text-xs text-muted-foreground">{tagline.length}/120</p>
              </div>
              <select className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm">
                <option>Choose a domain</option>
                {DOMAINS.map((d) => <option key={d}>{d}</option>)}
              </select>
              <div className="flex flex-wrap gap-2">
                {(["Idea", "In Progress", "Launched"] as const).map((s) => (
                  <button key={s} className="rounded-full border border-border px-3.5 py-1.5 text-sm hover:bg-secondary">{s}</button>
                ))}
              </div>
            </div>
          )}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-display text-2xl font-semibold">Tell the story behind it</h3>
              <textarea rows={3} placeholder="What problem does it solve?" className="w-full rounded-md border border-border bg-background p-3 text-sm focus:border-[var(--kola)] focus:outline-none focus:ring-2 focus:ring-[var(--kola)]/30" />
              <textarea rows={3} placeholder="How does your solution work?" className="w-full rounded-md border border-border bg-background p-3 text-sm focus:border-[var(--kola)] focus:outline-none focus:ring-2 focus:ring-[var(--kola)]/30" />
              <textarea rows={3} placeholder="What did you learn building it?" className="w-full rounded-md border border-border bg-background p-3 text-sm focus:border-[var(--kola)] focus:outline-none focus:ring-2 focus:ring-[var(--kola)]/30" />
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-display text-2xl font-semibold">The details</h3>
              <input placeholder="Tech stack (comma separated)" className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm" />
              <input placeholder="Live demo URL (optional)" className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm" />
              <input placeholder="GitHub URL (optional)" className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm" />
              <div className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-border text-sm text-muted-foreground">
                Drop a cover image (16:9) or click to upload
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" /> Seeking collaborators
              </label>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-display text-2xl font-semibold">Here is how it will look</h3>
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
                <div className="aspect-[16/9] bg-gradient-to-br from-[var(--baobab)] to-[var(--kola)]" />
                <div className="space-y-2 p-4">
                  <h4 className="font-display text-lg font-semibold">{name || "Your project name"}</h4>
                  <p className="text-sm text-muted-foreground">{tagline || "Your one-line description will appear here."}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <Button variant="ghost" onClick={() => step > 0 ? setStep(step - 1) : onClose()}>
            {step === 0 ? "Cancel" : "Back"}
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep(step + 1)} className="bg-[var(--kola)] text-[var(--kola-foreground)] hover:bg-[var(--kola)]/90">
              Continue <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button onClick={submit} className="bg-[var(--kola)] text-[var(--kola-foreground)] hover:bg-[var(--kola)]/90">
              Share with the Community
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// Silence unused import warnings — kept for potential future links inside modal
void ExternalLink; void Github;
