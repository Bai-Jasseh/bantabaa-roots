import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUp, ArrowDown, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/DeveloperCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Tables } from "@/integrations/supabase/types";

type Reply = Tables<"discussion_replies"> & { author: Tables<"profiles"> | null; score: number };

async function loadDiscussion(id: string) {
  const { data: discussion, error } = await supabase.from("discussions").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  if (!discussion) return null;
  const { data: space } = await supabase.from("spaces").select("*").eq("id", discussion.space_id).maybeSingle();
  const { data: author } = await supabase.from("profiles").select("*").eq("id", discussion.author_id).maybeSingle();
  const { data: replies } = await supabase
    .from("discussion_replies")
    .select("*")
    .eq("discussion_id", id)
    .order("created_at", { ascending: true });
  const replyList = replies ?? [];
  const authorIds = Array.from(new Set(replyList.map((r) => r.author_id)));
  const profiles = authorIds.length
    ? (await supabase.from("profiles").select("*").in("id", authorIds)).data ?? []
    : [];
  const profileById = new Map(profiles.map((p) => [p.id, p]));
  const replyIds = replyList.map((r) => r.id);
  const { data: votes } = replyIds.length
    ? await supabase.from("discussion_votes").select("reply_id, vote").in("reply_id", replyIds)
    : { data: [] as { reply_id: string | null; vote: string }[] };
  const score = new Map<string, number>();
  (votes ?? []).forEach((v) => {
    if (!v.reply_id) return;
    score.set(v.reply_id, (score.get(v.reply_id) ?? 0) + (v.vote === "up" ? 1 : -1));
  });
  const repliesEnriched: Reply[] = replyList.map((r) => ({
    ...r,
    author: profileById.get(r.author_id) ?? null,
    score: score.get(r.id) ?? 0,
  }));
  // discussion score
  const { data: dvotes } = await supabase.from("discussion_votes").select("vote").eq("discussion_id", id);
  const discussionScore = (dvotes ?? []).reduce((acc, v) => acc + (v.vote === "up" ? 1 : -1), 0);
  return { discussion, space, author, replies: repliesEnriched, discussionScore };
}

export const Route = createFileRoute("/discussions/$id")({
  loader: async ({ params }) => {
    const data = await loadDiscussion(params.id);
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.discussion.title ?? "Discussion"} — Bantabaa` },
      { name: "description", content: loaderData?.discussion.body?.slice(0, 160) ?? "Community discussion." },
    ],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-md py-32 text-center">
      <h1 className="font-display text-3xl">Discussion not found</h1>
      <Link to="/spaces" className="mt-4 inline-block text-[var(--kola)]">← Back to spaces</Link>
    </div>
  ),
  errorComponent: ({ error }) => <div className="mx-auto max-w-md py-32 text-center text-muted-foreground">{error.message}</div>,
  component: DiscussionDetailPage,
});

function DiscussionDetailPage() {
  const { discussion, space, author, replies, discussionScore } = Route.useLoaderData();
  const { user } = useAuth();
  const router = useRouter();
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [myVotes, setMyVotes] = useState<Record<string, "up" | "down">>({});

  useEffect(() => {
    if (!user) { setMyVotes({}); return; }
    (async () => {
      const ids = replies.map((r) => r.id);
      const { data: rVotes } = ids.length
        ? await supabase.from("discussion_votes").select("reply_id, vote").eq("user_id", user.id).in("reply_id", ids)
        : { data: [] as { reply_id: string | null; vote: string }[] };
      const { data: dVotes } = await supabase.from("discussion_votes").select("vote").eq("user_id", user.id).eq("discussion_id", discussion.id).maybeSingle();
      const map: Record<string, "up" | "down"> = {};
      (rVotes ?? []).forEach((v) => { if (v.reply_id) map[v.reply_id] = v.vote as "up" | "down"; });
      if (dVotes) map[discussion.id] = dVotes.vote as "up" | "down";
      setMyVotes(map);
    })();
  }, [user, discussion.id, replies]);

  const voteOn = async (target: { discussionId?: string; replyId?: string }, dir: "up" | "down") => {
    if (!user) { toast.error("Sign in to vote."); return; }
    const key = target.discussionId ?? target.replyId!;
    const current = myVotes[key];
    if (current === dir) {
      // toggle off
      const q = supabase.from("discussion_votes").delete().eq("user_id", user.id);
      const { error } = target.discussionId
        ? await q.eq("discussion_id", target.discussionId).is("reply_id", null)
        : await q.eq("reply_id", target.replyId!).is("discussion_id", null);
      if (error) { toast.error(error.message); return; }
    } else {
      // delete any existing then insert
      const del = supabase.from("discussion_votes").delete().eq("user_id", user.id);
      if (target.discussionId) await del.eq("discussion_id", target.discussionId).is("reply_id", null);
      else await del.eq("reply_id", target.replyId!).is("discussion_id", null);
      const { error } = await supabase.from("discussion_votes").insert({
        user_id: user.id,
        discussion_id: target.discussionId ?? null,
        reply_id: target.replyId ?? null,
        vote: dir,
      });
      if (error) { toast.error(error.message); return; }
    }
    router.invalidate();
  };

  const submitReply = async () => {
    if (!user) { toast.error("Sign in to reply."); return; }
    if (!body.trim()) return;
    setBusy(true);
    const { error } = await supabase.from("discussion_replies").insert({
      discussion_id: discussion.id, author_id: user.id, body: body.trim(),
    });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    setBody("");
    toast.success("Reply posted.");
    router.invalidate();
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      {space && (
        <Link to="/spaces/$slug" params={{ slug: space.slug }} className="text-sm text-muted-foreground hover:text-foreground">
          ← {space.name}
        </Link>
      )}

      <article className="mt-4 flex gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft">
        <div className="flex w-10 shrink-0 flex-col items-center gap-1">
          <button onClick={() => voteOn({ discussionId: discussion.id }, "up")}
            className={`rounded-md p-1 hover:bg-secondary ${myVotes[discussion.id] === "up" ? "text-[var(--kola)]" : "text-muted-foreground"}`}>
            <ArrowUp className="size-4" />
          </button>
          <span className="text-sm font-semibold tabular-nums">{discussionScore}</span>
          <button onClick={() => voteOn({ discussionId: discussion.id }, "down")}
            className={`rounded-md p-1 hover:bg-secondary ${myVotes[discussion.id] === "down" ? "text-[var(--destructive)]" : "text-muted-foreground"}`}>
            <ArrowDown className="size-4" />
          </button>
        </div>
        <div className="min-w-0 flex-1">
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium">{discussion.type}</span>
          <h1 className="mt-2 font-display text-2xl font-bold leading-tight">{discussion.title}</h1>
          {discussion.body && <p className="mt-3 whitespace-pre-wrap text-base text-foreground/85">{discussion.body}</p>}
          {author && (
            <Link to="/profile/$handle" params={{ handle: author.handle }} className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <span className="scale-50 origin-left"><Avatar name={author.full_name} hue={author.avatar_hue ?? 30} /></span>
              <span className="-ml-3">{author.full_name}</span>
            </Link>
          )}
        </div>
      </article>

      <h2 className="mt-10 flex items-center gap-2 font-display text-xl font-semibold">
        <MessageCircle className="size-5 text-[var(--kola)]" /> {replies.length} {replies.length === 1 ? "Reply" : "Replies"}
      </h2>

      <div className="mt-4 space-y-3">
        {replies.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-muted-foreground">
            No replies yet. Be the first to respond.
          </div>
        ) : replies.map((r) => (
          <article key={r.id} className="flex gap-4 rounded-2xl border border-border bg-card p-5">
            <div className="flex w-10 shrink-0 flex-col items-center gap-1">
              <button onClick={() => voteOn({ replyId: r.id }, "up")}
                className={`rounded-md p-1 hover:bg-secondary ${myVotes[r.id] === "up" ? "text-[var(--kola)]" : "text-muted-foreground"}`}>
                <ArrowUp className="size-4" />
              </button>
              <span className="text-sm font-semibold tabular-nums">{r.score}</span>
              <button onClick={() => voteOn({ replyId: r.id }, "down")}
                className={`rounded-md p-1 hover:bg-secondary ${myVotes[r.id] === "down" ? "text-[var(--destructive)]" : "text-muted-foreground"}`}>
                <ArrowDown className="size-4" />
              </button>
            </div>
            <div className="min-w-0 flex-1">
              <p className="whitespace-pre-wrap text-sm text-foreground/90">{r.body}</p>
              {r.author && (
                <Link to="/profile/$handle" params={{ handle: r.author.handle }} className="mt-3 inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
                  <span className="scale-[0.4] origin-left"><Avatar name={r.author.full_name} hue={r.author.avatar_hue ?? 30} /></span>
                  <span className="-ml-4">{r.author.full_name}</span>
                  <span>· {new Date(r.created_at).toLocaleDateString()}</span>
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-soft">
        <h3 className="font-display text-lg font-semibold">Add a reply</h3>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          placeholder={user ? "Share your thoughts…" : "Sign in to reply."}
          disabled={!user}
          className="mt-3 w-full resize-none rounded-md border border-border bg-background p-3 text-sm focus:border-[var(--kola)] focus:outline-none focus:ring-2 focus:ring-[var(--kola)]/30 disabled:opacity-60"
        />
        <div className="mt-3 flex justify-end">
          {user ? (
            <Button onClick={submitReply} disabled={busy || !body.trim()}
              className="bg-[var(--kola)] text-[var(--kola-foreground)] hover:bg-[var(--kola)]/90">
              {busy ? "Posting…" : "Post reply"}
            </Button>
          ) : (
            <Link to="/login"><Button variant="outline">Sign in</Button></Link>
          )}
        </div>
      </div>
    </div>
  );
}
