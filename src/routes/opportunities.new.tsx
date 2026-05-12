import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const TYPES = ["Job", "Contract", "Grant", "Mentorship"] as const;
const LOC_TYPES = ["Remote", "Hybrid", "On-site"] as const;
const EXP = ["Junior", "Mid", "Senior", "Any"] as const;

export const Route = createFileRoute("/opportunities/new")({
  head: () => ({ meta: [{ title: "Post an Opportunity — Bantabaa" }] }),
  component: NewOpportunityPage,
});

function NewOpportunityPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      toast.error("Please sign in to post an opportunity.");
      navigate({ to: "/login" });
    }
  }, [user, loading, navigate]);

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [type, setType] = useState<typeof TYPES[number]>("Job");
  const [location, setLocation] = useState("Remote");
  const [locationType, setLocationType] = useState<typeof LOC_TYPES[number]>("Remote");
  const [tags, setTags] = useState("");
  const [compensation, setCompensation] = useState("");
  const [experience, setExperience] = useState<typeof EXP[number]>("Mid");
  const [applyUrl, setApplyUrl] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const inputCls = "w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:border-[var(--kola)] focus:outline-none focus:ring-2 focus:ring-[var(--kola)]/30";

  const submit = async () => {
    if (!user) return;
    if (!title.trim() || !company.trim()) { toast.error("Title and company are required."); return; }
    setSaving(true);
    const { data, error } = await supabase.from("opportunities").insert({
      title: title.trim(), company: company.trim(), type, location, location_type: locationType,
      tags: tags.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 12),
      compensation: compensation.trim() || null, experience, apply_url: applyUrl.trim() || null,
      deadline: deadline ? new Date(deadline).toISOString() : null,
      description: description.trim() || null, posted_by: user.id,
    }).select("id").single();
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Opportunity posted.");
    navigate({ to: "/opportunities/$id", params: { id: data.id } });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 md:py-14">
      <Link to="/opportunities" className="text-sm text-muted-foreground hover:text-foreground">← Back to opportunities</Link>
      <h1 className="mt-4 font-display text-3xl font-bold md:text-4xl">Post an opportunity</h1>
      <p className="mt-2 text-muted-foreground">Reach West African developers directly.</p>

      <div className="mt-8 space-y-4">
        <Field label="Title *"><input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
        <Field label="Company / Organization *"><input className={inputCls} value={company} onChange={(e) => setCompany(e.target.value)} /></Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Type">
            <select className={inputCls} value={type} onChange={(e) => setType(e.target.value as typeof type)}>
              {TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Experience">
            <select className={inputCls} value={experience} onChange={(e) => setExperience(e.target.value as typeof experience)}>
              {EXP.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Location"><input className={inputCls} value={location} onChange={(e) => setLocation(e.target.value)} /></Field>
          <Field label="Location type">
            <select className={inputCls} value={locationType} onChange={(e) => setLocationType(e.target.value as typeof locationType)}>
              {LOC_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Compensation"><input className={inputCls} value={compensation} onChange={(e) => setCompensation(e.target.value)} placeholder="$60k–90k, Volunteer, etc." /></Field>
        <Field label="Tags (comma separated)"><input className={inputCls} value={tags} onChange={(e) => setTags(e.target.value)} placeholder="React, TypeScript" /></Field>
        <Field label="Apply URL"><input className={inputCls} value={applyUrl} onChange={(e) => setApplyUrl(e.target.value)} placeholder="https://" /></Field>
        <Field label="Deadline"><input type="date" className={inputCls} value={deadline} onChange={(e) => setDeadline(e.target.value)} /></Field>
        <Field label="Description"><textarea rows={5} className={inputCls + " resize-none"} value={description} onChange={(e) => setDescription(e.target.value)} /></Field>

        <div className="flex justify-end gap-2 pt-4">
          <Link to="/opportunities"><Button variant="outline">Cancel</Button></Link>
          <Button onClick={submit} disabled={saving} className="bg-[var(--kola)] text-[var(--kola-foreground)] hover:bg-[var(--kola)]/90">
            {saving ? "Posting…" : "Post Opportunity"}
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
