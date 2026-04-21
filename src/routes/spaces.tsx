import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Code, Smartphone, BarChart3, Shield, GitBranch,
  BookOpen, TrendingUp, Award, MapPin, Check,
} from "lucide-react";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CountUp } from "@/components/CountUp";
import { SAMPLE_SPACES, type Space, type SpaceIcon } from "@/data/sample";

export const Route = createFileRoute("/spaces")({
  head: () => ({
    meta: [
      { title: "Find Your People — Spaces — Bantabaa" },
      { name: "description", content: "Topic spaces where Gambian and West African developers ask, share, debate, and grow together. Pull up a chair under the tree." },
      { property: "og:title", content: "Community Spaces — Bantabaa" },
      { property: "og:description", content: "Find your people. Join the conversation." },
    ],
  }),
  component: SpacesPage,
});

const ICON_MAP: Record<SpaceIcon, React.ComponentType<{ className?: string }>> = {
  code: Code, smartphone: Smartphone, barchart: BarChart3, shield: Shield,
  gitbranch: GitBranch, bookopen: BookOpen, trendingup: TrendingUp,
  award: Award, mappin: MapPin,
};

function SpacesPage() {
  const groups = ["Domain", "Stage", "Country"] as const;
  const totalSpaces = SAMPLE_SPACES.filter((s) => !s.comingSoon).length;
  const totalMembers = SAMPLE_SPACES.reduce((acc, s) => acc + s.members, 0);
  const totalPosts = SAMPLE_SPACES.reduce((acc, s) => acc + s.posts, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
      <p className="text-label text-[var(--kola)]">Gather</p>
      <h1 className="mt-2 font-display text-4xl font-bold leading-[1.05] text-foreground md:text-5xl">
        Find Your People.<br />Join the Conversation.
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Topic spaces where Gambian and West African developers ask, share, debate, and grow together.
        Pull up a chair under the tree.
      </p>

      {/* Stats strip */}
      <div className="mt-8 flex flex-wrap gap-x-10 gap-y-4 rounded-2xl border border-border bg-card px-6 py-5 shadow-soft">
        <Stat value={totalSpaces} label="Spaces Active" />
        <Stat value={totalMembers} label="Members" />
        <Stat value={totalPosts} label="Discussions This Week" />
      </div>

      {groups.map((g) => (
        <section key={g} className="mt-14">
          <div className="section-divider">
            <span className="section-label">By {g}</span>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3">
            {SAMPLE_SPACES.filter((s) => s.category === g).map((s, i) => (
              <SpaceCard key={s.slug} space={s} delay={i * 0.08} />
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

function SpaceCard({ space, delay }: { space: Space; delay: number }) {
  const reduce = useReducedMotion();
  const [joined, setJoined] = useState(false);
  const Icon = ICON_MAP[space.icon];
  const soon = space.comingSoon;

  const card = (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={`group relative flex h-full flex-col overflow-hidden rounded-[20px] border border-border bg-card shadow-soft transition-all duration-[250ms] ease-out ${
        soon ? "opacity-60" : "hover:-translate-y-[3px] hover:shadow-warm"
      }`}
    >
      {/* Colored banner */}
      <div className={`relative h-20 space-grad-${space.gradient} flex items-center justify-center`}>
        <Icon className="size-8 text-white drop-shadow-md" />
        {soon && (
          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-medium text-foreground">
            Coming Soon
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold text-foreground">{space.name}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{space.blurb}</p>

        {!soon && (
          <div className="mt-4 flex items-center gap-2 text-[13px] text-muted-foreground">
            <span>{space.members.toLocaleString()} members</span>
            <span>·</span>
            <span>{space.posts} this week</span>
            {space.active > 0 && (
              <>
                <span>·</span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-[var(--savanna)]" />
                  {space.active} active
                </span>
              </>
            )}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between pt-4">
          {!soon && space.memberHues && space.memberHues.length > 0 ? (
            <div className="flex">
              {space.memberHues.slice(0, 3).map((hue, idx) => (
                <div
                  key={idx}
                  className="size-6 rounded-full ring-2 ring-[var(--kola)]"
                  style={{ backgroundColor: `oklch(0.5 0.08 ${hue})`, marginLeft: idx === 0 ? 0 : -8 }}
                  aria-hidden
                />
              ))}
              {space.members > 3 && (
                <span className="ml-2 self-center text-xs text-muted-foreground">
                  +{(space.members - 3).toLocaleString()}
                </span>
              )}
            </div>
          ) : <span />}

          {!soon && (
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); setJoined((v) => !v); }}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                joined
                  ? "bg-[var(--savanna)] text-[var(--savanna-foreground)]"
                  : "bg-[var(--kola)] text-[var(--kola-foreground)] hover:bg-[var(--kola)]/90"
              }`}
            >
              {joined && <Check className="size-3.5" />}
              {joined ? "Joined" : "Join"}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );

  if (soon) return card;
  return (
    <Link to="/spaces/$slug" params={{ slug: space.slug }} className="block">
      {card}
    </Link>
  );
}
