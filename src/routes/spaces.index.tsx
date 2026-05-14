import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Code, Smartphone, BarChart3, Shield, GitBranch,
  BookOpen, TrendingUp, Award, MapPin, Check,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import { CountUp } from "@/components/CountUp";
import { fetchSpaces, fetchMyMemberships, type SpaceRow } from "@/data/queries";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/spaces/")({
  head: () => ({
    meta: [
      { title: "Find Your People — Spaces — Bantabaa" },
      { name: "description", content: "Topic spaces where Gambian and West African developers ask, share, debate, and grow together." },
      { property: "og:title", content: "Community Spaces — Bantabaa" },
      { property: "og:description", content: "Find your people. Join the conversation." },
    ],
  }),
  loader: () => fetchSpaces(),
  errorComponent: ({ error }) => <div className="mx-auto max-w-md py-32 text-center text-muted-foreground">{error.message}</div>,
  component: SpacesPage,
});

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  code: Code, smartphone: Smartphone, barchart: BarChart3, shield: Shield,
  gitbranch: GitBranch, bookopen: BookOpen, trendingup: TrendingUp,
  award: Award, mappin: MapPin,
};

function SpacesPage() {
  const spaces = Route.useLoaderData();
  const { user } = useAuth();
  const [memberships, setMemberships] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) { setMemberships(new Set()); return; }
    fetchMyMemberships(user.id).then(setMemberships);
  }, [user]);

  const groups = ["Domain", "Stage", "Country"] as const;
  const totalSpaces = spaces.filter((s: any) => !s.coming_soon).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
      <p className="text-label text-[var(--kola)]">Gather</p>
      <h1 className="mt-2 font-display text-4xl font-bold leading-[1.05] text-foreground md:text-5xl">
        Find Your People.<br />Join the Conversation.
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Topic spaces where Gambian and West African developers ask, share, debate, and grow together.
      </p>

      <div className="mt-8 flex flex-wrap gap-x-10 gap-y-4 rounded-2xl border border-border bg-card px-6 py-5 shadow-soft">
        <Stat value={totalSpaces} label="Spaces Active" />
        <Stat value={memberships.size} label="Your Memberships" />
        <Stat value={spaces.length} label="Total Spaces" />
      </div>

      {groups.map((g) => (
        <section key={g} className="mt-14">
          <div className="section-divider"><span className="section-label">By {g}</span></div>
          <div className="mt-5 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3">
            {spaces.filter((s: any) => s.category === g).map((s: any, i: number) => (
              <SpaceCard key={s.slug} space={s} delay={i * 0.08} joined={memberships.has(s.id)}
                onJoinChange={(v) => {
                  setMemberships((prev) => {
                    const next = new Set(prev);
                    if (v) next.add(s.id); else next.delete(s.id);
                    return next;
                  });
                }} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <CountUp to={value} className="font-display text-3xl font-bold text-[var(--kola)]" />
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function SpaceCard({ space, delay, joined, onJoinChange }: { space: SpaceRow; delay: number; joined: boolean; onJoinChange: (v: boolean) => void }) {
  const reduce = useReducedMotion();
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const Icon = ICON_MAP[space.icon] ?? Code;
  const soon = space.coming_soon;

  const toggleJoin = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) { toast.error("Sign in to join."); return; }
    if (busy) return;
    setBusy(true);
    if (joined) {
      await supabase.from("space_members").delete().eq("user_id", user.id).eq("space_id", space.id);
      onJoinChange(false);
    } else {
      const { error } = await supabase.from("space_members").insert({ user_id: user.id, space_id: space.id });
      if (!error) { onJoinChange(true); toast.success(`Joined ${space.name}.`); }
    }
    setBusy(false);
  };

  const card = (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={`group relative flex h-full flex-col overflow-hidden rounded-[20px] border border-border bg-card shadow-soft transition-all duration-[250ms] ease-out ${soon ? "opacity-60" : "hover:-translate-y-[3px] hover:shadow-warm"}`}>
      <div className={`relative h-20 space-grad-${space.gradient} flex items-center justify-center`}>
        <Icon className="size-8 text-white drop-shadow-md" />
        {soon && <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-medium text-foreground">Coming Soon</span>}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold text-foreground">{space.name}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{space.blurb}</p>
        <div className="mt-auto flex items-center justify-end pt-4">
          {!soon && (
            <button type="button" onClick={toggleJoin} disabled={busy}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${joined ? "bg-[var(--savanna)] text-[var(--savanna-foreground)]" : "bg-[var(--kola)] text-[var(--kola-foreground)] hover:bg-[var(--kola)]/90"}`}>
              {joined && <Check className="size-3.5" />}{joined ? "Joined" : "Join"}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );

  if (soon) return card;
  return <Link to="/spaces/$slug" params={{ slug: space.slug }} className="block">{card}</Link>;
}
