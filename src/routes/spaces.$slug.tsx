import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUp, ArrowDown, MessageCircle, Bookmark, Eye, Pin, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/DeveloperCard";
import {
  Code, Smartphone, BarChart3, Shield, GitBranch,
  BookOpen, TrendingUp, Award, MapPin,
} from "lucide-react";
import { SAMPLE_SPACES, type SpaceIcon } from "@/data/sample";

export const Route = createFileRoute("/spaces/$slug")({
  loader: ({ params }) => {
    const space = SAMPLE_SPACES.find((s) => s.slug === params.slug);
    if (!space) throw notFound();
    return { space };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.space.name} — Spaces — Bantabaa` },
      { name: "description", content: loaderData?.space.blurb ?? "" },
      { property: "og:title", content: `${loaderData?.space.name} on Bantabaa` },
      { property: "og:description", content: loaderData?.space.blurb ?? "" },
    ],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-md py-32 text-center">
      <h1 className="font-display text-3xl">Space not found</h1>
      <Link to="/spaces" className="mt-4 inline-block text-[var(--kola)]">← All spaces</Link>
    </div>
  ),
  component: SpaceDetailPage,
});

const ICON_MAP: Record<SpaceIcon, React.ComponentType<{ className?: string }>> = {
  code: Code, smartphone: Smartphone, barchart: BarChart3, shield: Shield,
  gitbranch: GitBranch, bookopen: BookOpen, trendingup: TrendingUp,
  award: Award, mappin: MapPin,
};

const POST_TYPES = ["All", "Questions", "Resources", "Wins", "Debates", "Announcements"] as const;
const POST_TONE: Record<string, string> = {
  Question: "bg-[color-mix(in_oklab,var(--domain-fintech)_14%,transparent)] text-[var(--domain-fintech)]",
  Resource: "bg-[color-mix(in_oklab,var(--savanna)_14%,transparent)] text-[var(--savanna)]",
  Win: "bg-[color-mix(in_oklab,var(--kola)_18%,transparent)] text-[var(--kola)]",
  Debate: "bg-[color-mix(in_oklab,var(--destructive)_14%,transparent)] text-[var(--destructive)]",
  Announcement: "bg-[color-mix(in_oklab,var(--domain-edtech)_14%,transparent)] text-[var(--domain-edtech)]",
};

const SAMPLE_THREADS = [
  { id: "1", type: "Announcement", title: "Welcome — read this before posting", author: "Bantabaa Team", hue: 30, replies: 18, upvotes: 64, views: 412, time: "3d", pinned: true },
  { id: "2", type: "Question", title: "What's the right way to handle XOF currency in Postgres?", author: "Fatou Ndiaye", hue: 145, replies: 12, upvotes: 28, views: 184, time: "2h" },
  { id: "3", type: "Win", title: "We just shipped USSD payments to 200+ merchants in Banjul 🎉", author: "Lamin Ceesay", hue: 60, replies: 21, upvotes: 96, views: 532, time: "5h" },
  { id: "4", type: "Resource", title: "Free guide: deploying Flutter apps to low-end Android in West Africa", author: "Isatou Bah", hue: 25, replies: 4, upvotes: 33, views: 217, time: "1d" },
  { id: "5", type: "Debate", title: "Hot take: REST is still the right default for African fintech", author: "Amina Jallow", hue: 30, replies: 47, upvotes: 14, views: 891, time: "2d" },
];

function SpaceDetailPage() {
  const { space } = Route.useLoaderData() as { space: typeof SAMPLE_SPACES[number] };
  const Icon = ICON_MAP[space.icon as SpaceIcon];
  const [tab, setTab] = useState<"Discussions" | "Resources" | "Members" | "About">("Discussions");
  const [filter, setFilter] = useState<typeof POST_TYPES[number]>("All");
  const [joined, setJoined] = useState(false);

  return (
    <div>
      {/* Banner header */}
      <div className={`relative h-32 space-grad-${space.gradient} md:h-40`}>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
          <Icon className="size-10 md:size-12 drop-shadow-lg" />
          <h1 className="mt-2 font-display text-2xl font-bold drop-shadow-lg md:text-4xl">{space.name}</h1>
          <p className="mt-1 text-sm text-white/90">
            {space.members.toLocaleString()} members · {space.posts} posts this week
          </p>
        </div>
        <button
          onClick={() => setJoined((v) => !v)}
          className={`absolute right-4 top-4 rounded-full px-4 py-2 text-sm font-medium shadow-soft cursor-pointer ${
            joined ? "bg-[var(--savanna)] text-[var(--savanna-foreground)]" : "bg-white text-foreground hover:bg-white/90"
          }`}
        >
          {joined ? "✓ Joined" : "Join Space"}
        </button>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <Link to="/spaces" className="text-sm text-muted-foreground hover:text-foreground">← All spaces</Link>

        {/* Tab nav */}
        <div className="mt-6 flex gap-1 overflow-x-auto border-b border-border">
          {(["Discussions", "Resources", "Members", "About"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors cursor-pointer ${
                tab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
              {tab === t && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-[var(--kola)]" />
              )}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_300px]">
          {/* Main */}
          <div>
            {tab === "Discussions" && (
              <DiscussionsTab filter={filter} setFilter={setFilter} />
            )}
            {tab === "Resources" && <EmptyTab title="No resources shared yet." sub="Share a link or guide that helped you build." cta="Share a resource" />}
            {tab === "Members" && <MembersTab />}
            {tab === "About" && <AboutTab spaceName={space.name} blurb={space.blurb} />}
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <SidebarCard title="Trending discussions">
                <ul className="space-y-3 text-sm">
                  {SAMPLE_THREADS.slice(0, 3).map((t) => (
                    <li key={t.id} className="flex items-start justify-between gap-3">
                      <span className="line-clamp-2 text-foreground/90 hover:text-[var(--kola)] cursor-pointer">{t.title}</span>
                      <span className="shrink-0 text-xs text-muted-foreground">{t.replies}</span>
                    </li>
                  ))}
                </ul>
              </SidebarCard>
              <SidebarCard title="Who's active">
                <div className="flex flex-wrap gap-1">
                  {[30, 145, 60, 250, 25, 290, 145, 30].map((hue, i) => (
                    <div
                      key={i}
                      className="size-7 rounded-full ring-2 ring-card"
                      style={{ backgroundColor: `oklch(0.5 0.08 ${hue})` }}
                    />
                  ))}
                </div>
                <p className="mt-3 text-xs text-muted-foreground">+{space.active} active in last 24h</p>
              </SidebarCard>
              <SidebarCard title="Space rules">
                <ol className="space-y-1.5 text-sm text-muted-foreground">
                  <li>1. Be kind. Always.</li>
                  <li>2. No spam, no recruiting bait.</li>
                  <li>3. Share context with your questions.</li>
                </ol>
              </SidebarCard>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function DiscussionsTab({ filter, setFilter }: { filter: typeof POST_TYPES[number]; setFilter: (f: typeof POST_TYPES[number]) => void }) {
  const filtered = filter === "All" ? SAMPLE_THREADS : SAMPLE_THREADS.filter((t) => t.type + "s" === filter || t.type === filter.replace(/s$/, ""));
  const sorted = [...filtered].sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned));

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {POST_TYPES.map((p) => (
            <button
              key={p}
              onClick={() => setFilter(p)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                filter === p
                  ? "bg-[var(--kola)] text-[var(--kola-foreground)]"
                  : "border border-border bg-background text-muted-foreground hover:bg-secondary"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <Button className="bg-[var(--kola)] text-[var(--kola-foreground)] hover:bg-[var(--kola)]/90">Start a Discussion</Button>
      </div>

      <div className="mt-6 space-y-3">
        {sorted.map((t) => (
          <article
            key={t.id}
            className={`flex gap-4 rounded-2xl border bg-card p-5 shadow-soft transition-all hover:shadow-warm ${
              t.pinned ? "border-[var(--kola)]/40 bg-[color-mix(in_oklab,var(--kola)_4%,var(--card))]" : "border-border"
            }`}
          >
            {/* Vote column */}
            <div className="flex w-10 shrink-0 flex-col items-center gap-1">
              <button className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-[var(--kola)] cursor-pointer">
                <ArrowUp className="size-4" />
              </button>
              <span className="text-sm font-semibold tabular-nums">{t.upvotes}</span>
              <button className="rounded-md p-1 text-muted-foreground hover:bg-secondary cursor-pointer">
                <ArrowDown className="size-4" />
              </button>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${POST_TONE[t.type]}`}>{t.type}</span>
                {t.pinned && <Pin className="size-3.5 text-[var(--kola)]" />}
              </div>
              <h3 className="mt-2 font-display text-lg font-semibold leading-tight text-foreground hover:text-[var(--kola)] cursor-pointer">{t.title}</h3>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <span className="scale-50 origin-left"><Avatar name={t.author} hue={t.hue} /></span>
                  <span className="-ml-3">{t.author}</span>
                </span>
                <span>· {t.time} ago</span>
                <span className="inline-flex items-center gap-1"><MessageCircle className="size-3.5" /> {t.replies}</span>
                <span className="inline-flex items-center gap-1"><Eye className="size-3.5" /> {t.views}</span>
              </div>
            </div>
            <button className="self-start text-muted-foreground hover:text-foreground cursor-pointer" aria-label="Bookmark">
              <Bookmark className="size-4" />
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}

function MembersTab() {
  const members = [
    { name: "Amina Jallow", title: "Full Stack Dev · Banjul", hue: 30, helpful: 47 },
    { name: "Lamin Ceesay", title: "Mobile Dev · Serrekunda", hue: 60, helpful: 32 },
    { name: "Fatou Ndiaye", title: "Data Engineer · Dakar", hue: 145, helpful: 28 },
    { name: "Kwame Asare", title: "DevOps · Accra", hue: 250, helpful: 21 },
    { name: "Isatou Bah", title: "Designer & Front-end", hue: 25, helpful: 19 },
    { name: "Ibrahim Koroma", title: "Backend · Freetown", hue: 290, helpful: 15 },
  ];
  return (
    <div>
      <p className="section-label">Most Helpful This Month</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {members.slice(0, 3).map((m) => (
          <div key={m.name} className="rounded-2xl border border-[var(--kola)]/30 bg-[color-mix(in_oklab,var(--kola)_5%,var(--card))] p-4">
            <div className="flex items-center gap-3">
              <Avatar name={m.name} hue={m.hue} />
              <div>
                <div className="font-display font-semibold">{m.name}</div>
                <div className="text-xs text-muted-foreground">{m.helpful} helpful answers</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="section-label mt-8">All Members</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {members.map((m) => (
          <div key={m.name} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
            <Avatar name={m.name} hue={m.hue} />
            <div className="min-w-0 flex-1">
              <div className="font-display font-semibold">{m.name}</div>
              <div className="truncate text-xs text-muted-foreground">{m.title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AboutTab({ spaceName, blurb }: { spaceName: string; blurb: string }) {
  return (
    <div className="prose-warm space-y-8">
      <div>
        <p className="section-label">About this space</p>
        <p className="mt-3 text-lg leading-[1.8] text-foreground/90">{blurb} A place for developers across West Africa to ask questions, share what they're building, and grow together.</p>
      </div>
      <div>
        <p className="section-label">Space rules</p>
        <ol className="mt-3 space-y-2.5 text-base text-foreground/90">
          {["Be kind. Always.", "No spam or low-effort recruiting.", "Share context with your questions.", "Credit others' work.", "English, French, Wolof, Mandinka — all welcome."].map((r, i) => (
            <li key={r} className="flex gap-3">
              <span className="font-display font-bold text-[var(--kola)]">{i + 1}.</span>
              <span>{r}</span>
            </li>
          ))}
        </ol>
      </div>
      <div>
        <p className="section-label">Moderators</p>
        <div className="mt-3 flex flex-wrap gap-3">
          {[{ name: "Amina Jallow", hue: 30 }, { name: "Kwame Asare", hue: 250 }].map((m) => (
            <div key={m.name} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 pr-5">
              <Avatar name={m.name} hue={m.hue} />
              <div>
                <div className="font-display font-semibold">{m.name}</div>
                <div className="text-xs text-[var(--savanna)]">Moderator</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmptyTab({ title, sub, cta }: { title: string; sub: string; cta: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-card/50 p-12 text-center">
      <h3 className="font-display text-2xl font-semibold">{title}</h3>
      <p className="mt-2 text-muted-foreground">{sub}</p>
      <Button className="mt-6 bg-[var(--kola)] text-[var(--kola-foreground)] hover:bg-[var(--kola)]/90">{cta}</Button>
    </div>
  );
}

function SidebarCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
      <p className="section-label">{title}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}
