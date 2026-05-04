import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ImageUpload } from "@/components/ImageUpload";

const DOMAINS = ["Fintech","Agritech","Healthtech","Edtech","Govtech","Open Source","Mobile","AI/ML","Cybersecurity","Blockchain","E-commerce","Other"] as const;
const STAGES = [{ k: "idea", l: "Idea" }, { k: "in_progress", l: "In Progress" }, { k: "launched", l: "Launched" }] as const;

export const Route = createFileRoute("/projects/new")({
  head: () => ({ meta: [{ title: "Share Your Project — Bantabaa" }] }),
  beforeLoad: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw redirect({ to: "/login" });
  },
  component: NewProjectPage,
});

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 60);
}

function NewProjectPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [domain, setDomain] = useState<typeof DOMAINS[number]>("Other");
  const [stage, setStage] = useState<typeof STAGES[number]["k"]>("in_progress");
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [lessons, setLessons] = useState("");
  const [stack, setStack] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [seeking, setSeeking] = useState(false);
  const [collabNote, setCollabNote] = useState("");
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const inputCls = "w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:border-[var(--kola)] focus:outline-none focus:ring-2 focus:ring-[var(--kola)]/30";

  const submit = async () => {
    if (!user) return;
    if (!name.trim() || !description.trim()) { toast.error("Name and description are required."); return; }
    setSaving(true);
    let slug = slugify(name);
    // Ensure unique slug
    const { data: existing } = await supabase.from("projects").select("slug").like("slug", `${slug}%`);
    if (existing && existing.find((e) => e.slug === slug)) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
    const { error } = await supabase.from("projects").insert({
      builder_id: user.id, slug, name: name.trim(), description: description.trim(),
      domain, stage, problem: problem.trim() || null, solution: solution.trim() || null,
      lessons: lessons.trim() || null,
      stack: stack.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 12),
      live_url: liveUrl.trim() || null, github_url: githubUrl.trim() || null,
      seeking_collab: seeking, collab_note: seeking ? collabNote.trim() || null : null,
      cover_url: coverUrl,
    });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Your project is now under the tree.");
    navigate({ to: "/projects/$slug", params: { slug } });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 md:py-14">
      <Link to="/projects" className="text-sm text-muted-foreground hover:text-foreground">← Back to projects</Link>
      <h1 className="mt-4 font-display text-3xl font-bold md:text-4xl">Share your project</h1>
      <p className="mt-2 text-muted-foreground">Tell the community what you are building.</p>

      <div className="mt-8 space-y-4">
        <Field label="Project name *"><input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label="One-line description *"><input className={inputCls} value={description} onChange={(e) => setDescription(e.target.value.slice(0, 160))} /></Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Domain">
            <select className={inputCls} value={domain} onChange={(e) => setDomain(e.target.value as typeof domain)}>
              {DOMAINS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </Field>
          <Field label="Stage">
            <select className={inputCls} value={stage} onChange={(e) => setStage(e.target.value as typeof stage)}>
              {STAGES.map((s) => <option key={s.k} value={s.k}>{s.l}</option>)}
            </select>
          </Field>
        </div>
        <Field label="What problem does it solve?"><textarea rows={3} className={inputCls + " resize-none"} value={problem} onChange={(e) => setProblem(e.target.value)} /></Field>
        <Field label="How does your solution work?"><textarea rows={3} className={inputCls + " resize-none"} value={solution} onChange={(e) => setSolution(e.target.value)} /></Field>
        <Field label="Lessons learned"><textarea rows={3} className={inputCls + " resize-none"} value={lessons} onChange={(e) => setLessons(e.target.value)} /></Field>
        <Field label="Tech stack (comma separated)"><input className={inputCls} value={stack} onChange={(e) => setStack(e.target.value)} placeholder="React, Node.js, PostgreSQL" /></Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Live URL"><input className={inputCls} value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} placeholder="https://" /></Field>
          <Field label="GitHub URL"><input className={inputCls} value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/" /></Field>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={seeking} onChange={(e) => setSeeking(e.target.checked)} /> Seeking collaborators
        </label>
        {seeking && <Field label="Who are you looking for?"><input className={inputCls} value={collabNote} onChange={(e) => setCollabNote(e.target.value)} placeholder="Front-end help, Wolof translations…" /></Field>}

        <div className="flex justify-end gap-2 pt-4">
          <Link to="/projects"><Button variant="outline">Cancel</Button></Link>
          <Button onClick={submit} disabled={saving} className="bg-[var(--kola)] text-[var(--kola-foreground)] hover:bg-[var(--kola)]/90">
            {saving ? "Sharing…" : "Share Project"}
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
