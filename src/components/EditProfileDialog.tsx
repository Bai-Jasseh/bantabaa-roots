import { useState, useEffect, type ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

const OPEN_TO = [
  { key: "work", label: "Work" },
  { key: "freelance", label: "Freelance" },
  { key: "collaboration", label: "Collaboration" },
  { key: "mentoring", label: "Mentoring" },
] as const;

export function EditProfileDialog({
  profile,
  open,
  onOpenChange,
  onSaved,
  trigger,
}: {
  profile: Profile;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSaved: () => void | Promise<void>;
  trigger?: ReactNode;
}) {
  const [name, setName] = useState(profile.full_name);
  const [title, setTitle] = useState(profile.title ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [country, setCountry] = useState(profile.country ?? "");
  const [city, setCity] = useState(profile.city ?? "");
  const [skills, setSkills] = useState<string>((profile.skills ?? []).join(", "));
  const [languages, setLanguages] = useState<string>((profile.languages ?? []).join(", "));
  const [openTo, setOpenTo] = useState<string[]>((profile.open_to ?? []).filter((x) => x !== "not_available"));
  const [github, setGithub] = useState(profile.github_url ?? "");
  const [twitter, setTwitter] = useState(profile.twitter_url ?? "");
  const [linkedin, setLinkedin] = useState(profile.linkedin_url ?? "");
  const [website, setWebsite] = useState(profile.website_url ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setName(profile.full_name); setTitle(profile.title ?? ""); setBio(profile.bio ?? "");
      setCountry(profile.country ?? ""); setCity(profile.city ?? "");
      setSkills((profile.skills ?? []).join(", "));
      setLanguages((profile.languages ?? []).join(", "));
      setOpenTo((profile.open_to ?? []).filter((x) => x !== "not_available"));
      setGithub(profile.github_url ?? ""); setTwitter(profile.twitter_url ?? "");
      setLinkedin(profile.linkedin_url ?? ""); setWebsite(profile.website_url ?? "");
    }
  }, [open, profile]);

  const toggle = (k: string) => setOpenTo((arr) => (arr.includes(k) ? arr.filter((x) => x !== k) : [...arr, k]));

  const save = async () => {
    if (!name.trim()) { toast.error("Name is required."); return; }
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      full_name: name.trim(),
      title: title.trim() || null,
      bio: bio.trim() || null,
      country: country.trim() || null,
      city: city.trim() || null,
      skills: skills.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 30),
      languages: languages.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 15),
      open_to: openTo.length > 0 ? openTo as ("work"|"freelance"|"collaboration"|"mentoring")[] : null,
      github_url: github.trim() || null,
      twitter_url: twitter.trim() || null,
      linkedin_url: linkedin.trim() || null,
      website_url: website.trim() || null,
    }).eq("id", profile.id);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Profile saved.");
    onOpenChange(false);
    await onSaved();
  };

  const inputCls = "w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-[var(--kola)] focus:outline-none focus:ring-2 focus:ring-[var(--kola)]/30";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger}
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Edit your profile</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <Field label="Full name"><input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} /></Field>
          <Field label="Title"><input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Full Stack Developer" /></Field>
          <Field label="Bio"><textarea rows={4} className={inputCls + " resize-none"} value={bio} onChange={(e) => setBio(e.target.value)} /></Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Country"><input className={inputCls} value={country} onChange={(e) => setCountry(e.target.value)} /></Field>
            <Field label="City"><input className={inputCls} value={city} onChange={(e) => setCity(e.target.value)} /></Field>
          </div>
          <Field label="Skills (comma separated)"><input className={inputCls} value={skills} onChange={(e) => setSkills(e.target.value)} /></Field>
          <Field label="Languages (comma separated)"><input className={inputCls} value={languages} onChange={(e) => setLanguages(e.target.value)} /></Field>
          <Field label="Open to">
            <div className="flex flex-wrap gap-2">
              {OPEN_TO.map((o) => {
                const on = openTo.includes(o.key);
                return (
                  <button key={o.key} type="button" onClick={() => toggle(o.key)}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium ${on ? "bg-[var(--kola)] text-[var(--kola-foreground)]" : "border border-border bg-background hover:bg-secondary"}`}>
                    {o.label}
                  </button>
                );
              })}
            </div>
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="GitHub URL"><input className={inputCls} value={github} onChange={(e) => setGithub(e.target.value)} placeholder="https://github.com/you" /></Field>
            <Field label="Twitter URL"><input className={inputCls} value={twitter} onChange={(e) => setTwitter(e.target.value)} /></Field>
            <Field label="LinkedIn URL"><input className={inputCls} value={linkedin} onChange={(e) => setLinkedin(e.target.value)} /></Field>
            <Field label="Website"><input className={inputCls} value={website} onChange={(e) => setWebsite(e.target.value)} /></Field>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
          <Button onClick={save} disabled={saving} className="bg-[var(--kola)] text-[var(--kola-foreground)] hover:bg-[var(--kola)]/90">
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}
