import { createFileRoute, Link, useNavigate, redirect, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ImageUpload } from "@/components/ImageUpload";

const DOMAINS = ["Fintech","Agritech","Healthtech","Edtech","Govtech","Open Source","Mobile","AI/ML","Cybersecurity","Blockchain","E-commerce","Other"] as const;
const STAGES = [{ k: "idea", l: "Idea" }, { k: "in_progress", l: "In Progress" }, { k: "launched", l: "Launched" }] as const;

export const Route = createFileRoute("/projects/$slug/edit")({
  head: () => ({ meta: [{ title: "Edit Project — Bantabaa" }] }),
  beforeLoad: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw redirect({ to: "/login" });
  },
  loader: async ({ params }) => {
    const { data } = await supabase.from("projects").select("*").eq("slug", params.slug).maybeSingle();
    if (!data) throw notFound();
    return data;
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-md py-32 text-center">
      <h1 className="font-display text-3xl">Project not found</h1>
      <Link to="/projects" className="mt-4 inline-block text-[var(--kola)]">← All projects</Link>
    </div>
  ),
  errorComponent: ({ error }) => <div className="mx-auto max-w-md py-32 text-center text-muted-foreground">{error.message}</div>,
  component: EditProjectPage,
});

function EditProjectPage() {
  const row = Route.useLoaderData();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [name, setName] = useState(row.name);
  const [description, setDescription] = useState(row.description);
  const [domain, setDomain] = useState<any>(row.domain);
  const [stage, setStage] = useState<any>(row.stage);
  const [problem, setProblem] = useState(row.problem ?? "");
  const [solution, setSolution] = useState(row.solution ?? "");
  const [lessons, setLessons] = useState(row.lessons ?? "");
  const [stack, setStack] = useState((row.stack ?? []).join(", "));
  const [liveUrl, setLiveUrl] = useState(row.live_url ?? "");
  const [githubUrl, setGithubUrl] = useState(row.github_url ?? "");
  const [seeking, setSeeking] = useState(row.seeking_collab);
  const [collabNote, setCollabNote] = useState(row.collab_note ?? "");
  const [coverUrl, setCoverUrl] = useState<string | null>(row.cover_url);
  const [saving, setSaving] = useState(false);

  const inputCls = "w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:border-[var(--kola)] focus:outline-none focus:ring-2 focus:ring-[var(--kola)]/30";

  if (user && user.id !== row.builder_id) {
    return <div className="mx-auto max-w-md py-32 text-center text-muted-foreground">You can only edit your own projects.</div>;
  }

  const submit = async () => {
    if (!user) return;
    if (!name.trim() || !description.trim()) { toast.error("Name and description are required."); return; }
    setSaving(true);
    const { error } = await supabase.from("projects").update({
      name: name.trim(), description: description.trim(), domain, stage,
      problem: problem.trim() || null, solution: solution.trim() || null, lessons: lessons.trim() || null,
      stack: stack.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 12),
      live_url: liveUrl.trim() || null, github_url: githubUrl.trim() || null,
      seeking_collab: seeking, collab_note: seeking ? collabNote.trim() || null : null,
      cover_url: coverUrl,
    }).eq("id", row.id);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Project updated.");
    navigate({ to: "/projects/$slug", params: { slug: row.slug } });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 md:py-14">
      <Link to="/projects/$slug" params={{ slug: row.slug }} className="text-sm text-muted-foreground hover:text-foreground">← Back to project</Link>
      <h1 className="mt-4 font-display text-3xl font-bold md:text-4xl">Edit project</h1>

      <div className="mt-8 space-y-4">
        <Field label="Project name *"><input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label="One-line description *"><input className={inputCls} value={description} onChange={(e) => setDescription(e.target.value.slice(0, 160))} /></Field>
        <ImageUpload bucket="project-covers" value={coverUrl} onChange={setCoverUrl} shape="rect" label="Cover image (optional)" />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Domain">
            <select className={inputCls} value={domain} onChange={(e) => setDomain(e.target.value)}>
              {DOMAINS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </Field>
          <Field label="Stage">
            <select className={inputCls} value={stage} onChange={(e) => setStage(e.target.value)}>
              {STAGES.map((s) => <option key={s.k} value={s.k}>{s.l}</option>)}
            </select>
          </Field>
        </div>
        <Field label="What problem does it solve?"><textarea rows={3} className={inputCls + " resize-none"} value={problem} onChange={(e) => setProblem(e.target.value)} /></Field>
        <Field label="How does your solution work?"><textarea rows={3} className={inputCls + " resize-none"} value={solution} onChange={(e) => setSolution(e.target.value)} /></Field>
        <Field label="Lessons learned"><textarea rows={3} className={inputCls + " resize-none"} value={lessons} onChange={(e) => setLessons(e.target.value)} /></Field>
        <Field label="Tech stack (comma separated)"><input className={inputCls} value={stack} onChange={(e) => setStack(e.target.value)} /></Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Live URL"><input className={inputCls} value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} /></Field>
          <Field label="GitHub URL"><input className={inputCls} value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} /></Field>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={seeking} onChange={(e) => setSeeking(e.target.checked)} /> Seeking collaborators
        </label>
        {seeking && <Field label="Who are you looking for?"><input className={inputCls} value={collabNote} onChange={(e) => setCollabNote(e.target.value)} /></Field>}

        <div className="flex justify-end gap-2 pt-4">
          <Link to="/projects/$slug" params={{ slug: row.slug }}><Button variant="outline">Cancel</Button></Link>
          <Button onClick={submit} disabled={saving} className="bg-[var(--kola)] text-[var(--kola-foreground)] hover:bg-[var(--kola)]/90">
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}
