import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowUp, MessageCircle, Pin } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/DeveloperCard";
import {
  Code, Smartphone, BarChart3, Shield, GitBranch,
  BookOpen, TrendingUp, Award, MapPin,
} from "lucide-react";
import { fetchSpaceBySlug, fetchDiscussionsForSpace, fetchMyMemberships } from "@/data/queries";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/spaces/$slug")({
  loader: async ({ params }) => {
    const space = await fetchSpaceBySlug(params.slug);
    if (!space) throw notFound();
    const discussions = await fetchDiscussionsForSpace(space.id);
    return { space, discussions };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.space.name} — Spaces — Bantabaa` },
      { name: "description", content: loaderData?.space.blurb ?? "" },
    ],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-md py-32 text-center">
      <h1 className="font-display text-3xl">Space not found</h1>
      <Link to="/spaces" className="mt-4 inline-block text-[var(--kola)]">← All spaces</Link>
    </div>
  ),
  errorComponent: ({ error }) => <div className="mx-auto max-w-md py-32 text-center text-muted-foreground">{error.message}</div>,
  component: SpaceDetailPage,
});

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  code: Code, smartphone: Smartphone, barchart: BarChart3, shield: Shield,
  gitbranch: GitBranch, bookopen: BookOpen, trendingup: TrendingUp,
  award: Award, mappin: MapPin,
};

const POST_TONE: Record<string, string> = {
  Question: "bg-[color-mix(in_oklab,var(--domain-fintech)_14%,transparent)] text-[var(--domain-fintech)]",
  Resource: "bg-[color-mix(in_oklab,var(--savanna)_14%,transparent)] text-[var(--savanna)]",
  Win: "bg-[color-mix(in_oklab,var(--kola)_18%,transparent)] text-[var(--kola)]",
  Debate: "bg-[color-mix(in_oklab,var(--destructive)_14%,transparent)] text-[var(--destructive)]",
  Announcement: "bg-[color-mix(in_oklab,var(--domain-edtech)_14%,transparent)] text-[var(--domain-edtech)]",
};

function SpaceDetailPage() {
  const { space, discussions } = Route.useLoaderData();
  const { user } = useAuth();
  const router = useRouter();
  const Icon = ICON_MAP[space.icon] ?? Code;
  const [joined, setJoined] = useState(false);
  const [busy, setBusy] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newType, setNewType] = useState<"Question" | "Resource" | "Win" | "Debate" | "Announcement">("Question");

  useEffect(() => {
    if (!user) { setJoined(false); return; }
    fetchMyMemberships(user.id).then((set) => setJoined(set.has(space.id)));
  }, [user, space.id]);

  const toggleJoin = async () => {
    if (!user) { toast.error("Sign in to join."); return; }
    if (busy) return;
    setBusy(true);
    if (joined) {
      await supabase.from("space_members").delete().eq("user_id", user.id).eq("space_id", space.id);
      setJoined(false);
    } else {
      const { error } = await supabase.from("space_members").insert({ user_id: user.id, space_id: space.id });
      if (!error) { setJoined(true); toast.success(`Joined ${space.name}.`); }
    }
    setBusy(false);
  };

  const submitDiscussion = async () => {
    if (!user) { toast.error("Sign in to post."); return; }
    if (!newTitle.trim()) { toast.error("Title is required."); return; }
    setBusy(true);
    const { error } = await supabase.from("discussions").insert({
      space_id: space.id, author_id: user.id, title: newTitle.trim(), body: newBody.trim() || null, type: newType,
    });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Discussion posted.");
    setNewTitle(""); setNewBody(""); setShowNew(false);
    router.invalidate();
  };

  const vote = async (discussionId: string) => {
    if (!user) { toast.error("Sign in to vote."); return; }
    await supabase.from("discussion_votes").upsert(
      { user_id: user.id, discussion_id: discussionId, vote: "up" },
      { onConflict: "user_id,discussion_id" } as never
    );
    router.invalidate();
  };

  return (
    <div>
      <div className={`relative h-32 space-grad-${space.gradient} md:h-40`}>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
          <Icon className="size-10 md:size-12 drop-shadow-lg" />
          <h1 className="mt-2 font-display text-2xl font-bold drop-shadow-lg md:text-4xl">{space.name}</h1>
          <p className="mt-1 text-sm text-white/90">{discussions.length} discussion{discussions.length === 1 ? "" : "s"}</p>
        </div>
        <button onClick={toggleJoin} disabled={busy}
          className={`absolute right-4 top-4 rounded-full px-4 py-2 text-sm font-medium shadow-soft ${joined ? "bg-[var(--savanna)] text-[var(--savanna-foreground)]" : "bg-white text-foreground hover:bg-white/90"}`}>
          {joined ? "✓ Joined" : "Join Space"}
        </button>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6 md:px-6">
        <Link to="/spaces" className="text-sm text-muted-foreground hover:text-foreground">← All spaces</Link>

        {space.blurb && <p className="mt-4 text-base text-muted-foreground">{space.blurb}</p>}

        <div className="mt-8 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Discussions</h2>
          <Button onClick={() => setShowNew((v) => !v)} className="bg-[var(--kola)] text-[var(--kola-foreground)] hover:bg-[var(--kola)]/90">
            {showNew ? "Cancel" : "Start a Discussion"}
          </Button>
        </div>

        {showNew && (
          <div className="mt-4 rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className="space-y-3">
              <select value={newType} onChange={(e) => setNewType(e.target.value as typeof newType)}
                className="rounded-md border border-border bg-background px-3 py-2 text-sm">
                <option>Question</option><option>Resource</option><option>Win</option><option>Debate</option><option>Announcement</option>
              </select>
              <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Discussion title"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-[var(--kola)] focus:outline-none focus:ring-2 focus:ring-[var(--kola)]/30" />
              <textarea value={newBody} onChange={(e) => setNewBody(e.target.value)} rows={4} placeholder="Add context (optional)"
                className="w-full rounded-md border border-border bg-background p-3 text-sm focus:border-[var(--kola)] focus:outline-none focus:ring-2 focus:ring-[var(--kola)]/30 resize-none" />
              <div className="flex justify-end">
                <Button onClick={submitDiscussion} disabled={busy} className="bg-[var(--kola)] text-[var(--kola-foreground)] hover:bg-[var(--kola)]/90">Post</Button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 space-y-3">
          {discussions.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
              <p className="font-display text-xl">No discussions yet.</p>
              <p className="mt-1 text-muted-foreground">Be the first to start one.</p>
            </div>
          ) : discussions.map((d) => (
            <article key={d.row.id}
              className={`flex gap-4 rounded-2xl border bg-card p-5 shadow-soft transition-all hover:shadow-warm ${d.row.pinned ? "border-[var(--kola)]/40 bg-[color-mix(in_oklab,var(--kola)_4%,var(--card))]" : "border-border"}`}>
              <div className="flex w-10 shrink-0 flex-col items-center gap-1">
                <button onClick={() => vote(d.row.id)} className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-[var(--kola)]">
                  <ArrowUp className="size-4" />
                </button>
                <span className="text-sm font-semibold tabular-nums">{d.upvotes}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${POST_TONE[d.row.type]}`}>{d.row.type}</span>
                  {d.row.pinned && <Pin className="size-3.5 text-[var(--kola)]" />}
                </div>
                <h3 className="mt-2 font-display text-lg font-semibold leading-tight text-foreground">{d.row.title}</h3>
                {d.row.body && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{d.row.body}</p>}
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  {d.author && (
                    <Link to="/profile/$handle" params={{ handle: d.author.handle }} className="inline-flex items-center gap-1.5 hover:text-foreground">
                      <span className="scale-50 origin-left"><Avatar name={d.author.full_name} hue={d.author.avatar_hue ?? 30} /></span>
                      <span className="-ml-3">{d.author.full_name}</span>
                    </Link>
                  )}
                  <span className="inline-flex items-center gap-1"><MessageCircle className="size-3.5" /> {d.replies}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
