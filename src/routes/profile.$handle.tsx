import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  Github, Twitter, Linkedin, Globe, MessageSquare, MapPin, GraduationCap, Award,
  Users, GitBranch, Trophy, ShieldCheck, Lock, Share2, Flag, Copy, Check,
  PenLine, Sparkles, FolderPlus, Code2, ExternalLink, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TagPill } from "@/components/TagPill";
import { ProjectCard } from "@/components/ProjectCard";
import { CountUp } from "@/components/CountUp";
import { Reveal, RevealStagger } from "@/components/motion/Reveal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { SAMPLE_DEVELOPERS, SAMPLE_PROJECTS } from "@/data/sample";
import type { Developer } from "@/components/DeveloperCard";

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
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-md py-32 text-center">
      <h1 className="font-display text-3xl">Something went wrong</h1>
      <p className="mt-2 text-muted-foreground">{error.message}</p>
    </div>
  ),
  component: ProfilePage,
});

// ---------- helpers ----------

const SECTION_LABEL = "section-label";

function BigAvatar({ name, hue = 30 }: { name: string; hue?: number }) {
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("");
  return (
    <div
      className="flex size-24 md:size-30 shrink-0 items-center justify-center rounded-full font-display text-3xl md:text-4xl font-semibold text-[var(--baobab-foreground)] shadow-warm"
      style={{
        backgroundColor: `oklch(0.45 0.08 ${hue})`,
        width: "var(--avatar-size, 6rem)",
        height: "var(--avatar-size, 6rem)",
        boxShadow: "0 0 0 3px var(--kola), 0 8px 24px -8px color-mix(in oklab, var(--baobab) 40%, transparent)",
      }}
      aria-hidden
    >
      {initials}
    </div>
  );
}

function OpenToBadge({ openTo }: { openTo?: Developer["openTo"] }) {
  const available = !!openTo;
  return (
    <span
      className={
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium " +
        (available
          ? "bg-[var(--savanna)] text-[var(--savanna-foreground)]"
          : "bg-muted text-muted-foreground")
      }
    >
      <span className={"size-1.5 rounded-full " + (available ? "bg-white" : "bg-muted-foreground")} />
      {available ? `Open to ${openTo}` : "Not Available"}
    </span>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="text-muted-foreground transition-colors hover:text-[var(--kola)]"
    >
      {children}
    </a>
  );
}

// ---------- page ----------

function ProfilePage() {
  const { dev } = Route.useLoaderData() as { dev: Developer };
  const projects = SAMPLE_PROJECTS.filter((p) => p.builder.handle === dev.handle);
  const otherSample = SAMPLE_PROJECTS.filter((p) => p.builder.handle !== dev.handle).slice(0, 2);
  // Show 1 featured + at least a couple in the grid for demo richness
  const featured = projects[0] ?? SAMPLE_PROJECTS[0];
  const gridProjects = (projects.length > 1 ? projects.slice(1) : otherSample);
  const seekingCollaborators = true;

  // Skill grouping
  const LANG = ["TypeScript", "Python", "Go", "Dart", "JavaScript"];
  const FRAME = ["React", "React Native", "Flutter", "FastAPI", "Next.js", "Django", "Node.js"];
  const TOOL = ["PostgreSQL", "AWS", "Firebase", "Terraform", "Kubernetes", "Git", "Docker", "Figma"];
  const skillGroups = [
    { label: "Languages", items: dev.skills.filter((s) => LANG.includes(s)) },
    { label: "Frameworks", items: dev.skills.filter((s) => FRAME.includes(s)) },
    { label: "Tools", items: dev.skills.filter((s) => TOOL.includes(s)) },
    { label: "Domains", items: ["Fintech", "Mobile"] },
  ].filter((g) => g.items.length > 0);

  const bio = `I build software for the people I grew up with. My focus is product engineering — front-end, back-end, the messy middle — for fintech and community products in The Gambia and across West Africa. I believe in shipping small, listening hard, and building tools that respect the people who use them.`;

  // Verified badges
  const badges = [
    { name: "UTG Graduate", issuer: "University of The Gambia", icon: GraduationCap, earned: true, desc: "Graduated from the University of The Gambia." },
    { name: "Bootcamp Certified", issuer: "Jokkolabs Banjul", icon: Code2, earned: true, desc: "Completed a verified developer bootcamp." },
    { name: "Community Mentor", issuer: "Bantabaa", icon: Users, earned: true, desc: "Recognized for mentoring 10+ developers in the community." },
    { name: "Open Source Contributor", issuer: "GitHub", icon: GitBranch, earned: true, desc: "Active contributions to open source projects." },
    { name: "Hackathon Winner", issuer: "Africa Code Week", icon: Trophy, earned: false, desc: "Won a recognized hackathon. Earn this by joining one." },
    { name: "Verified Developer", issuer: "Bantabaa", icon: ShieldCheck, earned: false, desc: "Identity verified by the Bantabaa team." },
  ];

  // Recent activity
  const activity = [
    { kind: "Project shared", text: `Shared "${featured.name}"`, when: "2 days ago", icon: Sparkles },
    { kind: "Discussion", text: "Started a discussion in Web Development", when: "5 days ago", icon: MessageSquare },
    { kind: "Badge earned", text: "Earned the Community Mentor badge", when: "1 week ago", icon: Award },
    { kind: "Helped", text: "Helped 3 developers in Beginners Corner", when: "2 weeks ago", icon: Users },
    { kind: "Opportunity", text: "Applied to Senior Full Stack Engineer · Paystack", when: "3 weeks ago", icon: ExternalLink },
  ];

  // Share profile
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      const url = typeof window !== "undefined" ? window.location.href : "";
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Profile link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy link");
    }
  };

  return (
    <TooltipProvider delayDuration={150}>
      <div className="bg-background pb-28 md:pb-12">
        {/* COVER + HEADER */}
        <Reveal as="section" className="relative">
          <div className="bg-cover-baobab-kola h-44 w-full md:h-60" aria-hidden />
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <div className="-mt-14 flex flex-col gap-5 md:-mt-16 md:flex-row md:items-end md:justify-between">
              <div className="flex flex-col items-start gap-4 md:flex-row md:items-end">
                <div style={{ "--avatar-size": "6rem" } as React.CSSProperties} className="md:[--avatar-size:7.5rem]">
                  <BigAvatar name={dev.name} hue={dev.avatarHue} />
                </div>
                <div className="md:pb-1">
                  <h1 className="font-display font-bold tracking-tight text-foreground" style={{ fontSize: "clamp(28px, 4vw, 36px)", lineHeight: 1.1 }}>
                    {dev.name}
                  </h1>
                  <p className="mt-1 text-[18px] font-medium text-muted-foreground">
                    {dev.title}{dev.openTo ? ` · Open to ${dev.openTo}` : ""}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="size-4" /> {dev.flag} {dev.location}
                    </span>
                    <span aria-hidden>·</span>
                    {["English", "Wolof", "Mandinka"].map((lang) => (
                      <span key={lang} className="rounded-full bg-secondary px-2 py-0.5 text-xs">{lang}</span>
                    ))}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <OpenToBadge openTo={dev.openTo} />
                    <div className="flex items-center gap-3 pl-1">
                      <SocialLink href="#" label="GitHub"><Github className="size-4" /></SocialLink>
                      <SocialLink href="#" label="LinkedIn"><Linkedin className="size-4" /></SocialLink>
                      <SocialLink href="#" label="Twitter"><Twitter className="size-4" /></SocialLink>
                      <SocialLink href="#" label="Personal site"><Globe className="size-4" /></SocialLink>
                    </div>
                  </div>
                </div>
              </div>
              {/* Action buttons */}
              <div id="profile-actions" className="flex w-full flex-col gap-2 md:w-auto md:flex-row">
                <Button className="w-full bg-[var(--kola)] text-[var(--kola-foreground)] hover:bg-[var(--kola)]/90 md:w-auto">
                  Request Collaboration
                </Button>
                <Button variant="outline" className="w-full border-[var(--baobab)]/40 text-foreground hover:bg-[var(--baobab)]/5 md:w-auto">
                  <MessageSquare className="size-4" /> Send Message
                </Button>
              </div>
            </div>
          </div>
        </Reveal>

        {/* BODY */}
        <div className="mx-auto mt-10 grid max-w-6xl gap-10 px-4 md:grid-cols-[1fr_280px] md:px-6">
          <div className="space-y-12">
            {/* About */}
            <Reveal as="section">
              <p className={SECTION_LABEL}>About</p>
              {bio ? (
                <p className="mt-4 max-w-2xl text-[18px] text-foreground" style={{ lineHeight: 1.7 }}>
                  {bio}
                </p>
              ) : (
                <EmptyState
                  message="Your story matters here. Tell the community who you are."
                  cta={{ label: "Write Your Bio", icon: PenLine }}
                />
              )}
            </Reveal>

            {/* Skills */}
            <Reveal as="section">
              <p className={SECTION_LABEL}>Skills</p>
              {skillGroups.length === 0 ? (
                <div className="mt-4">
                  <EmptyState
                    message="Skills tell your story. Add yours so the community knows what you can build."
                    cta={{ label: "Add Skills", icon: Sparkles }}
                  />
                </div>
              ) : (
                <div className="mt-4 space-y-5">
                  {skillGroups.map((g, gi) => (
                    <div key={g.label}>
                      <h3 className="mb-2 text-sm font-medium text-muted-foreground">{g.label}</h3>
                      <div className="flex flex-wrap gap-2">
                        {g.items.map((s, i) => (
                          <span
                            key={s}
                            className={
                              "tag-skill tag-in inline-flex items-center rounded-full font-medium " +
                              (i === 0 ? "px-3 py-1.5 text-sm" : "px-2.5 py-1 text-xs")
                            }
                            style={{ animationDelay: `${(gi * 4 + i) * 0.05}s` }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Reveal>

            {/* Featured Project */}
            <Reveal as="section">
              <p className={SECTION_LABEL}>Featured Project</p>
              <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
                <div
                  className="relative aspect-[16/9] w-full"
                  style={{ background: `linear-gradient(135deg, var(--baobab) 0%, var(--kola) 100%)` }}
                  aria-hidden
                >
                  <div className="absolute bottom-3 left-3">
                    <TagPill variant="domain" domain={featured.domain} />
                  </div>
                  {seekingCollaborators && (
                    <div className="absolute right-3 top-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[color-mix(in_oklab,var(--kola)_18%,transparent)] px-2.5 py-1 text-xs font-medium text-[var(--kola)] backdrop-blur">
                        <Users className="size-3.5" /> Seeking Collaborators
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6 md:p-7">
                  <h3 className="font-display text-2xl font-semibold text-foreground">{featured.name}</h3>
                  <p className="mt-2 text-base text-muted-foreground">{featured.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {featured.stack.map((t) => <TagPill key={t} variant="outlined">{t}</TagPill>)}
                  </div>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <Link to="/projects/$slug" params={{ slug: featured.slug }}>
                      <Button>View Project</Button>
                    </Link>
                    <Button variant="outline" className="border-border">
                      <Github className="size-4" /> View on GitHub
                    </Button>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Projects grid */}
            <section>
              <p className={SECTION_LABEL}>Projects</p>
              {gridProjects.length === 0 ? (
                <div className="mt-4">
                  <EmptyState
                    message="No projects shared yet. Your first project is waiting to be told."
                    cta={{ label: "Share a Project", icon: FolderPlus }}
                  />
                </div>
              ) : (
                <RevealStagger className="mt-4 grid gap-6 sm:grid-cols-2" stagger={0.1}>
                  {gridProjects.map((p, i) => (
                    <Reveal key={p.slug} className="relative">
                      <span className="pointer-events-none absolute right-3 top-3 z-10 rounded-full bg-background/70 px-2 py-0.5 text-[10px] font-medium text-muted-foreground backdrop-blur">
                        {2024 - (i % 3)}
                      </span>
                      <ProjectCard project={p} />
                    </Reveal>
                  ))}
                </RevealStagger>
              )}
            </section>

            {/* Community Contributions */}
            <Reveal as="section">
              <p className={SECTION_LABEL}>Community</p>
              <div className="mt-4 rounded-2xl border border-border bg-[var(--cream)] p-6 dark:bg-card md:p-8">
                <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                  {[
                    { v: projects.length || 4, l: "Projects Shared" },
                    { v: 23, l: "Discussions Started" },
                    { v: 41, l: "Developers Helped" },
                    { v: 1240, l: "Reputation Score" },
                  ].map((s) => (
                    <div key={s.l} className="text-center md:text-left">
                      <CountUp to={s.v} duration={1.2} className="font-display text-4xl font-bold text-[var(--kola)]" />
                      <div className="mt-1 text-sm text-muted-foreground">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Verified badges */}
            <Reveal as="section">
              <p className={SECTION_LABEL}>Verified</p>
              <div className="mt-4 -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 lg:grid-cols-6">
                {badges.map((b) => {
                  const Icon = b.earned ? b.icon : Lock;
                  return (
                    <Tooltip key={b.name}>
                      <TooltipTrigger asChild>
                        <div className={"flex w-28 shrink-0 flex-col items-center text-center md:w-auto " + (b.earned ? "" : "opacity-40")}>
                          <div
                            className="flex size-14 items-center justify-center rounded-full"
                            style={{ background: b.earned ? "color-mix(in oklab, var(--kola) 16%, transparent)" : "var(--muted)" }}
                          >
                            <Icon className={"size-6 " + (b.earned ? "text-[var(--kola)]" : "text-muted-foreground")} />
                          </div>
                          <div className="mt-2 text-xs font-medium text-foreground">{b.name}</div>
                          <div className="text-[11px] text-muted-foreground">{b.issuer}</div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top">{b.desc}</TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </Reveal>

            {/* Recent activity */}
            <Reveal as="section">
              <p className={SECTION_LABEL}>Recent Activity</p>
              <ul className="timeline-rail mt-4 space-y-5 pl-5">
                {activity.map((a) => {
                  const Icon = a.icon;
                  return (
                    <li key={a.text} className="relative">
                      <span className="absolute -left-[26px] top-1 flex size-4 items-center justify-center rounded-full bg-[var(--kola)] text-[var(--kola-foreground)]">
                        <Icon className="size-2.5" />
                      </span>
                      <div className="text-sm text-foreground">{a.text}</div>
                      <div className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="size-3" /> {a.when}
                      </div>
                    </li>
                  );
                })}
              </ul>
              <a href="#" className="mt-4 inline-block text-sm font-medium text-[var(--kola)] hover:underline">
                View all activity →
              </a>
            </Reveal>
          </div>

          {/* SIDEBAR — desktop only */}
          <aside className="hidden md:block">
            <div className="sticky top-24 space-y-4">
              {/* Availability */}
              <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Availability</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className={"size-2 rounded-full " + (dev.openTo ? "bg-[var(--savanna)]" : "bg-muted-foreground")} />
                  <span className="text-sm font-medium text-foreground">
                    {dev.openTo ? `Open to ${dev.openTo}` : "Not Available"}
                  </span>
                </div>
                <Button className="mt-4 w-full bg-[var(--kola)] text-[var(--kola-foreground)] hover:bg-[var(--kola)]/90">
                  Contact
                </Button>
              </div>
              {/* Quick stats */}
              <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Quick stats</p>
                <dl className="mt-3 space-y-2.5 text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Profile views (30d)</dt>
                    <dd className="font-medium text-foreground"><CountUp to={342} duration={1.2} /></dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Projects</dt>
                    <dd className="font-medium text-foreground"><CountUp to={projects.length || 4} duration={1.2} /></dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Reputation</dt>
                    <dd className="font-medium text-foreground"><CountUp to={1240} duration={1.2} /></dd>
                  </div>
                </dl>
              </div>
              {/* Share */}
              <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <Button variant="outline" className="w-full" onClick={onCopy}>
                  {copied ? <Check className="size-4" /> : <Share2 className="size-4" />}
                  {copied ? "Copied" : "Share this profile"}
                </Button>
                <button
                  type="button"
                  className="mt-4 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => toast("Thank you. The community team will review.")}
                >
                  <Flag className="size-3" /> Report profile
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* Mobile sticky CTA */}
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur md:hidden">
          <Button className="w-full bg-[var(--kola)] text-[var(--kola-foreground)] hover:bg-[var(--kola)]/90">
            Request Collaboration
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}

// ---------- empty state ----------

function EmptyState({
  message,
  cta,
}: {
  message: string;
  cta: { label: string; icon: React.ComponentType<{ className?: string }> };
}) {
  const Icon = cta.icon;
  return (
    <div className="mt-3 rounded-2xl border border-dashed border-border bg-secondary/40 p-6 text-center">
      <p className="italic text-muted-foreground">{message}</p>
      <Button variant="outline" className="mt-3 border-[var(--kola)]/50 text-foreground hover:bg-[var(--kola)]/10">
        <Icon className="size-4" /> {cta.label}
      </Button>
    </div>
  );
}

// silence unused import warning when Award stays referenced via badges list
void Award;
