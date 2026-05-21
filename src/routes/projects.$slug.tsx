import { createFileRoute, Link, notFound, useRouter, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ExternalLink, Github, MessageCircle, Users, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TagPill } from "@/components/TagPill";
import { Avatar } from "@/components/DeveloperCard";
import { ReactionStrip } from "@/components/ReactionStrip";
import { fetchProjectBySlug } from "@/data/queries";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/projects/$slug")({
  loader: async ({ params }) => {
    const result = await fetchProjectBySlug(params.slug);
    if (!result) throw notFound();
    return result;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.project.name ?? "Project"} — Bantabaa` },
      { name: "description", content: loaderData?.project.description ?? "" },
      { property: "og:title", content: `${loaderData?.project.name} on Bantabaa` },
      { property: "og:description", content: loaderData?.project.description ?? "" },
    ],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-md py-32 text-center">
      <h1 className="font-display text-3xl">Project not found</h1>
      <Link to="/projects" className="mt-4 inline-block text-[var(--kola)]">← All projects</Link>
    </div>
  ),
  errorComponent: ({ error }) => <div className="mx-auto max-w-md py-32 text-center text-muted-foreground">{error.message}</div>,
  component: ProjectDetailPage,
});

function ProjectDetailPage() {
  const { row, project } = Route.useLoaderData();
  const { user } = useAuth();
  const router = useRouter();
  const navigate = useNavigate();
  const [reply, setReply] = useState("");
  const [posting, setPosting] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const isOwner = !!user && user.id === row.builder_id;

  const loadComments = async () => {
    const { data } = await supabase.from("project_comments").select("*").eq("project_id", row.id).order("created_at", { ascending: false });
    const list = data ?? [];
    const authorIds = Array.from(new Set(list.map((c: any) => c.author_id)));
    const profiles = authorIds.length
      ? (await supabase.from("profiles").select("id, full_name, handle, avatar_hue, avatar_url").in("id", authorIds)).data ?? []
      : [];
    const pmap = new Map(profiles.map((p: any) => [p.id, p]));
    setComments(list.map((c: any) => ({ ...c, author: pmap.get(c.author_id) ?? null })));
  };

  useEffect(() => { loadComments(); /* eslint-disable-next-line */ }, [row.id]);

  const remove = async () => {
    if (!isOwner) return;
    if (!confirm("Delete this project? This cannot be undone.")) return;
    const { error } = await supabase.from("projects").delete().eq("id", row.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Project deleted.");
    navigate({ to: "/projects" });
  };

  const removeComment = async (id: string) => {
    if (!confirm("Delete this comment?")) return;
    const { error } = await supabase.from("project_comments").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    setComments((cs) => cs.filter((c) => c.id !== id));
  };

  const post = async () => {
    if (!user) { toast.error("Sign in to comment."); return; }
    if (!reply.trim()) return;
    setPosting(true);
    const { error } = await supabase.from("project_comments").insert({
      project_id: row.id, author_id: user.id, body: reply.trim(),
    });
    setPosting(false);
    if (error) { toast.error(error.message); return; }
    setReply("");
    toast.success("Comment posted.");
    loadComments();
    router.invalidate();
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-16">
      <Link to="/projects" className="text-sm text-muted-foreground hover:text-foreground">← Back to projects</Link>
      <div className="mt-6 aspect-[21/9] w-full overflow-hidden rounded-3xl"
        style={row.cover_url ? undefined : { background: `linear-gradient(135deg, var(--baobab) 0%, var(--kola) 100%)` }}>
        {row.cover_url && <img src={row.cover_url} alt="" className="h-full w-full object-cover" />}
      </div>

      <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <TagPill variant="domain" domain={project.domain} />
          <h1 className="mt-3 font-display text-4xl font-bold text-foreground md:text-5xl">{project.name}</h1>
          <p className="mt-2 text-lg text-muted-foreground">{project.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <ReactionStrip projectId={row.id} appreciate={project.appreciate} discuss={project.discuss} />
          {isOwner && (
            <>
              <Button asChild variant="outline" size="sm">
                <Link to="/projects/$slug/edit" params={{ slug: row.slug }}><Pencil className="size-4" /> Edit</Link>
              </Button>
              <Button onClick={remove} variant="outline" size="sm" className="text-[var(--destructive)] hover:bg-[var(--destructive)]/10">
                <Trash2 className="size-4" /> Delete
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-10">
          {row.problem && <Section title="What problem does this solve?">{row.problem}</Section>}
          {row.solution && <Section title="The solution">{row.solution}</Section>}
          <Section title="Tech stack">
            <div className="flex flex-wrap gap-2">{project.stack.map((t: any) => <TagPill key={t}>{t}</TagPill>)}</div>
          </Section>
          {row.lessons && <Section title="Lessons learned">{row.lessons}</Section>}

          <Section title="Discussion">
            <div className="rounded-2xl border border-border bg-card p-5">
              <textarea value={reply} onChange={(e) => setReply(e.target.value)}
                placeholder={user ? "Share your thoughts under the tree…" : "Sign in to share your thoughts."}
                rows={3} disabled={!user}
                className="w-full resize-none rounded-md border border-border bg-background p-3 text-sm focus:border-[var(--kola)] focus:outline-none focus:ring-2 focus:ring-[var(--kola)]/30" />
              <div className="mt-3 flex justify-end">
                <Button onClick={post} disabled={!user || posting || !reply.trim()} className="bg-[var(--kola)] text-[var(--kola-foreground)] hover:bg-[var(--kola)]/90">
                  <MessageCircle className="size-4" /> {posting ? "Posting…" : "Post"}
                </Button>
              </div>
            </div>
            <p className="mt-6 text-center text-sm text-muted-foreground">Be the first to start the conversation.</p>
          </Section>
        </div>

        <aside className="space-y-4 md:sticky md:top-24 md:self-start">
          {project.builder.handle && (
            <Link to="/profile/$handle" params={{ handle: project.builder.handle }} className="block rounded-2xl border border-border bg-card p-5 shadow-soft hover:shadow-warm">
              <p className="text-label text-muted-foreground">Builder</p>
              <div className="mt-3 flex items-center gap-3">
                <Avatar name={project.builder.name} hue={project.builder.hue} />
                <div>
                  <div className="font-display font-semibold text-foreground">{project.builder.name}</div>
                  <div className="text-sm text-muted-foreground">View profile →</div>
                </div>
              </div>
            </Link>
          )}
          {(row.live_url || row.github_url) && (
            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <p className="text-label text-muted-foreground">Links</p>
              <div className="mt-3 space-y-2">
                {row.live_url && <a href={row.live_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm hover:bg-secondary"><ExternalLink className="size-4" /> Live demo</a>}
                {row.github_url && <a href={row.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm hover:bg-secondary"><Github className="size-4" /> GitHub repo</a>}
              </div>
            </div>
          )}
          {row.seeking_collab && (
            <div className="rounded-2xl border border-[var(--kola)]/30 bg-[var(--kola)]/5 p-5">
              <p className="font-display text-lg font-semibold text-foreground"><Users className="mr-1 inline size-4" /> Looking for collaborators</p>
              {row.collab_note && <p className="mt-1 text-sm text-muted-foreground">{row.collab_note}</p>}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-2xl font-semibold text-foreground">{title}</h2>
      <div className="mt-3 text-base leading-relaxed text-foreground/80">{children}</div>
    </section>
  );
}
