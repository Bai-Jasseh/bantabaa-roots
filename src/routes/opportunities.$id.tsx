import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TagPill } from "@/components/TagPill";
import { fetchOpportunityById } from "@/data/queries";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/opportunities/$id")({
  loader: async ({ params }) => {
    const op = await fetchOpportunityById(params.id);
    if (!op) throw notFound();
    return op;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title} at ${loaderData?.company} — Bantabaa` },
      { name: "description", content: `${loaderData?.type} · ${loaderData?.location} · ${loaderData?.compensation ?? ""}` },
    ],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-md py-32 text-center">
      <h1 className="font-display text-3xl">Opportunity not found</h1>
      <Link to="/opportunities" className="mt-4 inline-block text-[var(--kola)]">← All opportunities</Link>
    </div>
  ),
  errorComponent: ({ error }) => <div className="mx-auto max-w-md py-32 text-center text-muted-foreground">{error.message}</div>,
  component: OpportunityDetailPage,
});

function OpportunityDetailPage() {
  const op = Route.useLoaderData();
  const { user } = useAuth();
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState("");

  const apply = async () => {
    if (!user) { toast.error("Sign in to apply."); return; }
    setApplying(true);
    const { error } = await supabase.from("opportunity_applications").insert({
      opportunity_id: op.id, applicant_id: user.id, message: message.trim() || null,
    });
    setApplying(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Application sent.");
    setMessage("");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-16">
      <Link to="/opportunities" className="text-sm text-muted-foreground hover:text-foreground">← Back to opportunities</Link>

      <div className="mt-6 grid gap-8 md:grid-cols-3">
        <div className="space-y-8 md:col-span-2">
          <div className="flex items-start gap-4">
            <div className="flex size-14 items-center justify-center rounded-2xl text-white" style={{ backgroundColor: `oklch(0.45 0.08 ${op.logoHue ?? 60})` }}>
              <Building2 className="size-6" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">{op.title}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span>{op.company}</span>
                <span className="inline-flex items-center gap-1"><MapPin className="size-3.5" /> {op.location}</span>
                <TagPill variant="outlined">{op.locationType}</TagPill>
                <TagPill>{op.type}</TagPill>
              </div>
            </div>
          </div>

          <Section title="What you'll bring">
            <div className="flex flex-wrap gap-2">{op.tags.map((t: any) => <TagPill key={t}>{t}</TagPill>)}</div>
          </Section>

          {op.compensation && (
            <Section title="Compensation">
              <p className="font-medium text-foreground">{op.compensation}</p>
            </Section>
          )}

          <Section title="How to apply">
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4}
              placeholder={user ? "Optional — tell them why you're a fit." : "Sign in to apply."}
              disabled={!user}
              className="w-full rounded-md border border-border bg-background p-3 text-sm focus:border-[var(--kola)] focus:outline-none focus:ring-2 focus:ring-[var(--kola)]/30" />
            <Button onClick={apply} disabled={!user || applying} className="mt-4 h-11 bg-[var(--kola)] px-8 text-[var(--kola-foreground)] hover:bg-[var(--kola)]/90">
              {applying ? "Sending…" : "Apply now"}
            </Button>
          </Section>
        </div>

        <aside className="space-y-4 md:sticky md:top-24 md:self-start">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <p className="text-label text-muted-foreground">About {op.company}</p>
            <p className="mt-3 text-sm text-foreground/80">An organization hiring through Bantabaa.</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <p className="text-label text-muted-foreground">Posted</p>
            <p className="mt-2 text-sm text-foreground">{op.postedDays === 0 ? "Today" : `${op.postedDays} days ago`}</p>
            {op.deadlineDays !== undefined && <p className="mt-1 text-xs text-[var(--destructive)]">Closes in {op.deadlineDays}d</p>}
          </div>
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
