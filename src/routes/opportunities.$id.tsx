import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Building2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TagPill } from "@/components/TagPill";
import { OpportunityCard } from "@/components/OpportunityCard";
import { SAMPLE_OPPORTUNITIES } from "@/data/sample";

export const Route = createFileRoute("/opportunities/$id")({
  loader: ({ params }) => {
    const op = SAMPLE_OPPORTUNITIES.find((o) => o.id === params.id);
    if (!op) throw notFound();
    return { op };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.op.title} at ${loaderData?.op.company} — Bantabaa` },
      { name: "description", content: `${loaderData?.op.type} · ${loaderData?.op.location} · ${loaderData?.op.compensation ?? ""}` },
      { property: "og:title", content: `${loaderData?.op.title} — Bantabaa` },
      { property: "og:description", content: `${loaderData?.op.company} · ${loaderData?.op.location}` },
    ],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-md py-32 text-center">
      <h1 className="font-display text-3xl">Opportunity not found</h1>
      <Link to="/opportunities" className="mt-4 inline-block text-[var(--kola)]">← All opportunities</Link>
    </div>
  ),
  component: OpportunityDetailPage,
});

function OpportunityDetailPage() {
  const { op } = Route.useLoaderData() as { op: typeof SAMPLE_OPPORTUNITIES[number] };
  const related = SAMPLE_OPPORTUNITIES.filter((o) => o.id !== op.id).slice(0, 2);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-16">
      <Link to="/opportunities" className="text-sm text-muted-foreground hover:text-foreground">← Back to opportunities</Link>

      <div className="mt-6 grid gap-8 md:grid-cols-3">
        <div className="space-y-8 md:col-span-2">
          <div className="flex items-start gap-4">
            <div
              className="flex size-14 items-center justify-center rounded-2xl text-white"
              style={{ backgroundColor: `oklch(0.45 0.08 ${op.logoHue ?? 60})` }}
            >
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

          <Section title="About the role">
            We are looking for a builder who can ship — not just code. You will work alongside a small product team to grow a product that already serves real people across West Africa. Comfort with ambiguity, a bias for shipping, and care for the user's reality matter as much as your stack.
          </Section>

          <Section title="What you'll bring">
            <div className="flex flex-wrap gap-2">
              {op.tags.map((t) => <TagPill key={t}>{t}</TagPill>)}
              <TagPill>3+ years experience</TagPill>
              <TagPill>Strong written communication</TagPill>
            </div>
          </Section>

          <Section title="Compensation & benefits">
            <ul className="space-y-2 text-foreground/80">
              <li>· Compensation: <span className="font-medium text-foreground">{op.compensation ?? "Competitive"}</span></li>
              <li>· Remote-friendly with quarterly team meetups</li>
              <li>· Health stipend and learning budget</li>
              <li>· Equity for permanent hires</li>
            </ul>
          </Section>

          <Section title="How to apply">
            <p>Send a short note about a project you've shipped you're proud of. We read every application personally.</p>
            <Button className="mt-4 h-11 bg-[var(--kola)] px-8 text-[var(--kola-foreground)] hover:bg-[var(--kola)]/90">
              Apply now
            </Button>
          </Section>
        </div>

        <aside className="space-y-4 md:sticky md:top-24 md:self-start">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <p className="text-label text-muted-foreground">About {op.company}</p>
            <p className="mt-3 text-sm text-foreground/80">
              A growing African team building infrastructure for the next decade of digital commerce on the continent.
            </p>
            <Button variant="outline" className="mt-4 w-full">View company</Button>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <p className="text-label text-muted-foreground">Posted</p>
            <p className="mt-2 text-sm text-foreground">{op.postedDays === 0 ? "Today" : `${op.postedDays} days ago`}</p>
          </div>
        </aside>
      </div>

      <section className="mt-16">
        <h2 className="font-display text-2xl font-semibold">Related opportunities</h2>
        <div className="mt-4 space-y-3">
          {related.map((o) => <OpportunityCard key={o.id} op={o} />)}
        </div>
      </section>
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
