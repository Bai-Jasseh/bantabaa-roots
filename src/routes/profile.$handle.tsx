import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Github, Twitter, Linkedin, Globe, MessageSquare, MapPin, GraduationCap, Award, Heart, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TagPill } from "@/components/TagPill";
import { BrandBadge } from "@/components/BrandBadge";
import { ProjectCard } from "@/components/ProjectCard";
import { Avatar } from "@/components/DeveloperCard";
import { SAMPLE_DEVELOPERS, SAMPLE_PROJECTS } from "@/data/sample";

export const Route = createFileRoute("/profile/$handle")({
  loader: ({ params }) => {
    const dev = SAMPLE_DEVELOPERS.find((d) => d.handle === params.handle);
    if (!dev) throw notFound();
    return { dev };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.dev.name ?? "Developer"} — Bantabaa` },
      { name: "description", content: `${loaderData?.dev.name} · ${loaderData?.dev.title} based in ${loaderData?.dev.location}. See their work, skills, and projects on Bantabaa.` },
      { property: "og:title", content: `${loaderData?.dev.name ?? "Developer"} on Bantabaa` },
      { property: "og:description", content: `${loaderData?.dev.title} · ${loaderData?.dev.location}` },
    ],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-md py-32 text-center">
      <h1 className="font-display text-3xl">Profile not found</h1>
      <p className="mt-2 text-muted-foreground">This developer hasn't joined the gathering yet.</p>
      <Link to="/" className="mt-6 inline-block text-[var(--kola)]">← Back home</Link>
    </div>
  ),
  component: ProfilePage,
});

function ProfilePage() {
  const { dev } = Route.useLoaderData() as { dev: typeof SAMPLE_DEVELOPERS[number] };
  const projects = SAMPLE_PROJECTS.filter((p) => p.builder.handle === dev.handle);
  const otherProjects = SAMPLE_PROJECTS.filter((p) => p.builder.handle !== dev.handle).slice(0, 2);
  const featured = projects[0] ?? SAMPLE_PROJECTS[0];

  const skillGroups = [
    { label: "Languages", items: dev.skills.filter((s) => ["TypeScript", "Python", "Go", "Dart", "JavaScript"].includes(s)) },
    { label: "Frameworks", items: dev.skills.filter((s) => ["React", "Flutter", "FastAPI", "Next.js"].includes(s)) },
    { label: "Tools & Infra", items: dev.skills.filter((s) => ["PostgreSQL", "AWS", "Firebase", "Terraform", "Kubernetes"].includes(s)) },
  ].filter((g) => g.items.length > 0);

  return (
    <div className="bg-background">
      {/* Header */}
      <section className="bg-gradient-warm dark:bg-card border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
          <div className="flex flex-col gap-6 md:flex-row md:items-end">
            <div className="scale-[1.6] origin-top-left md:scale-[2]">
              <Avatar name={dev.name} hue={dev.avatarHue} />
            </div>
            <div className="flex-1 md:pl-12">
              <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">{dev.name}</h1>
              <p className="mt-2 text-lg text-foreground/80">{dev.title}</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-4" /> {dev.flag} {dev.location}
                </span>
                <span>· English, Wolof, Mandinka</span>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {dev.openTo && <BrandBadge tone="kola">🌿 Open to {dev.openTo}</BrandBadge>}
                <a href="#" aria-label="GitHub" className="rounded-md border border-border bg-card p-2 text-foreground/70 hover:text-foreground"><Github className="size-4" /></a>
                <a href="#" aria-label="Twitter" className="rounded-md border border-border bg-card p-2 text-foreground/70 hover:text-foreground"><Twitter className="size-4" /></a>
                <a href="#" aria-label="LinkedIn" className="rounded-md border border-border bg-card p-2 text-foreground/70 hover:text-foreground"><Linkedin className="size-4" /></a>
                <a href="#" aria-label="Website" className="rounded-md border border-border bg-card p-2 text-foreground/70 hover:text-foreground"><Globe className="size-4" /></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3 md:px-6">
        <div className="space-y-12 md:col-span-2">
          {/* About */}
          <section>
            <p className="text-label text-[var(--kola)]">About me</p>
            <p className="mt-3 text-lg leading-relaxed text-foreground/85">
              I build software for the people I grew up with. My focus is product engineering — front-end, back-end, the messy middle — for fintech and community products in The Gambia and across West Africa. I believe in shipping small, listening hard, and building tools that respect the people who use them.
            </p>
          </section>

          {/* Skills */}
          <section>
            <p className="text-label text-[var(--kola)]">Skills</p>
            <div className="mt-4 space-y-4">
              {skillGroups.map((g) => (
                <div key={g.label}>
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">{g.label}</h3>
                  <div className="flex flex-wrap gap-2">
                    {g.items.map((s: string) => <TagPill key={s}>{s}</TagPill>)}
                  </div>
                </div>
              ))}
              {skillGroups.length === 0 && (
                <div className="flex flex-wrap gap-2">
                  {dev.skills.map((s: string) => <TagPill key={s}>{s}</TagPill>)}
                </div>
              )}
            </div>
          </section>

          {/* Featured */}
          <section>
            <p className="text-label text-[var(--kola)]">Featured project</p>
            <div className="mt-4 overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
              <div
                className="aspect-[21/9] w-full"
                style={{ background: `linear-gradient(135deg, var(--baobab) 0%, var(--kola) 100%)` }}
                aria-hidden
              />
              <div className="p-6 md:p-8">
                <TagPill variant="domain" domain={featured.domain} />
                <h3 className="mt-3 font-display text-2xl font-semibold text-foreground">{featured.name}</h3>
                <p className="mt-2 text-muted-foreground">{featured.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {featured.stack.map((t) => <TagPill key={t} variant="outlined">{t}</TagPill>)}
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  <Link to="/projects/$slug" params={{ slug: featured.slug }}>
                    <Button>View project</Button>
                  </Link>
                  <Button variant="outline" className="border-[var(--kola)]/40 text-foreground hover:bg-[var(--kola)]/10">
                    Collaborate
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Projects */}
          <section>
            <p className="text-label text-[var(--kola)]">Other projects</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {otherProjects.map((p) => <ProjectCard key={p.slug} project={p} />)}
            </div>
          </section>

          {/* Verified badges */}
          <section>
            <p className="text-label text-[var(--kola)]">Verified</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <BrandBadge icon={<GraduationCap className="size-3.5" />} tone="savanna">UTG Graduate</BrandBadge>
              <BrandBadge icon={<Award className="size-3.5" />} tone="kola">Bootcamp Certified</BrandBadge>
              <BrandBadge icon={<Heart className="size-3.5" />} tone="default">Community Mentor</BrandBadge>
              <BrandBadge icon={<BookOpen className="size-3.5" />} tone="default">Open Source Contributor</BrandBadge>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 md:sticky md:top-24 md:self-start">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <p className="text-label text-muted-foreground">Community contributions</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                { v: projects.length || 4, l: "Projects" },
                { v: 23, l: "Discussions" },
                { v: 41, l: "Devs helped" },
                { v: 1240, l: "Reputation" },
              ].map((s: string) => (
                <div key={s.l} className="rounded-xl bg-secondary p-3">
                  <div className="font-display text-2xl font-semibold text-foreground">{s.v}</div>
                  <div className="text-xs text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <p className="text-sm text-muted-foreground">Available for new work</p>
            <div className="mt-4 space-y-2">
              <Button className="w-full bg-[var(--kola)] text-[var(--kola-foreground)] hover:bg-[var(--kola)]/90">
                Request collaboration
              </Button>
              <Button variant="outline" className="w-full">
                <MessageSquare className="size-4" /> Send message
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
