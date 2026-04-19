import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ExternalLink, Github, MessageCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TagPill } from "@/components/TagPill";
import { Avatar } from "@/components/DeveloperCard";
import { ReactionStrip } from "@/components/ReactionStrip";
import { SAMPLE_PROJECTS } from "@/data/sample";

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }) => {
    const project = SAMPLE_PROJECTS.find((p) => p.slug === params.slug);
    if (!project) throw notFound();
    return { project };
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
  component: ProjectDetailPage,
});

function ProjectDetailPage() {
  const { project } = Route.useLoaderData();
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-16">
      <Link to="/projects" className="text-sm text-muted-foreground hover:text-foreground">← Back to projects</Link>

      <div
        className="mt-6 aspect-[21/9] w-full overflow-hidden rounded-3xl"
        style={{ background: `linear-gradient(135deg, var(--baobab) 0%, var(--kola) 100%)` }}
      />

      <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <TagPill variant="domain" domain={project.domain} />
          <h1 className="mt-3 font-display text-4xl font-bold text-foreground md:text-5xl">{project.name}</h1>
          <p className="mt-2 text-lg text-muted-foreground">{project.description}</p>
        </div>
        <ReactionStrip appreciate={project.appreciate} discuss={project.discuss} />
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-10">
          <Section title="What problem does this solve?">
            Across West Africa, the people most affected by a problem are often the last to get the tools to fix it. {project.name} starts with that audience first — the trader, the farmer, the patient, the student — and works backwards to a piece of software that respects their context: low-bandwidth, offline-first, and in their language where it matters.
          </Section>
          <Section title="The solution">
            A focused product that does one thing well, built natively for mobile and integrated with the local rails — mobile money, USSD, SMS, and the messaging tools people already use every day. No friction, no aspirational onboarding, no patronizing UX.
          </Section>
          <Section title="Tech stack">
            <div className="flex flex-wrap gap-2">
              {project.stack.map((t: string) => <TagPill key={t}>{t}</TagPill>)}
            </div>
          </Section>
          <Section title="Lessons learned">
            Ship small. Listen harder than you build. Field-test in the dust, not in the office. The best feature decisions came from sitting with users, not from sprint planning.
          </Section>

          {/* Discussion */}
          <Section title="Discussion">
            <div className="rounded-2xl border border-border bg-card p-5">
              <textarea
                placeholder="Share your thoughts under the tree…"
                rows={3}
                className="w-full resize-none rounded-md border border-border bg-background p-3 text-sm focus:border-[var(--kola)] focus:outline-none focus:ring-2 focus:ring-[var(--kola)]/30"
              />
              <div className="mt-3 flex justify-end">
                <Button className="bg-[var(--kola)] text-[var(--kola-foreground)] hover:bg-[var(--kola)]/90">
                  <MessageCircle className="size-4" /> Post
                </Button>
              </div>
            </div>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Be the first to start the conversation.
            </p>
          </Section>
        </div>

        <aside className="space-y-4 md:sticky md:top-24 md:self-start">
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
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <p className="text-label text-muted-foreground">Links</p>
            <div className="mt-3 space-y-2">
              <a href="#" className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm hover:bg-secondary">
                <ExternalLink className="size-4" /> Live demo
              </a>
              <a href="#" className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm hover:bg-secondary">
                <Github className="size-4" /> GitHub repo
              </a>
            </div>
          </div>
          <div className="rounded-2xl border border-[var(--kola)]/30 bg-[var(--kola)]/5 p-5">
            <p className="font-display text-lg font-semibold text-foreground">
              <Users className="mr-1 inline size-4" /> Looking for collaborators
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Front-end help, accessibility review, and Wolof translations welcome.
            </p>
            <Button className="mt-3 w-full bg-[var(--kola)] text-[var(--kola-foreground)] hover:bg-[var(--kola)]/90">
              Reach out
            </Button>
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
