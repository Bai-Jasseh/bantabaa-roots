import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import {
  Github, Twitter, Linkedin, Globe, MessageSquare, MapPin, GraduationCap, Award,
  Users, GitBranch, Trophy, ShieldCheck, Lock, PenLine, Sparkles, FolderPlus, Code2, Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TagPill } from "@/components/TagPill";
import { ProjectCard } from "@/components/ProjectCard";
import { CountUp } from "@/components/CountUp";
import { Reveal, RevealStagger } from "@/components/motion/Reveal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { fetchProfileByHandle, fetchProjectsWithBuilders, profileToDeveloper } from "@/data/queries";
import { useAuth } from "@/hooks/useAuth";
import { EditProfileDialog } from "@/components/EditProfileDialog";

export const Route = createFileRoute("/profile/$handle")({
  loader: async ({ params }) => {
    const profile = await fetchProfileByHandle(params.handle);
    if (!profile) throw notFound();
    const all = await fetchProjectsWithBuilders();
    const projects = all.filter((p) => p.builder?.id === profile.id).map((p) => p.project);
    return { profile, projects };
  },
  head: ({ loaderData }) => {
    const dev = loaderData ? profileToDeveloper(loaderData.profile) : null;
    return {
      meta: [
        { title: `${dev?.name ?? "Developer"} — Bantabaa` },
        { name: "description", content: dev ? `${dev.name} · ${dev.title} · ${dev.location}. See their work and skills on Bantabaa.` : "Developer profile on Bantabaa." },
        { property: "og:title", content: `${dev?.name ?? "Developer"} on Bantabaa` },
        { property: "og:description", content: dev ? `${dev.title} · ${dev.location}` : "" },
      ],
    };
  },
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

const SECTION_LABEL = "section-label";

function BigAvatar({ name, hue = 30, url }: { name: string; hue?: number; url?: string | null }) {
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("");
  const baseStyle: React.CSSProperties = {
    width: "var(--avatar-size, 6rem)",
    height: "var(--avatar-size, 6rem)",
    boxShadow: "0 0 0 3px var(--kola), 0 8px 24px -8px color-mix(in oklab, var(--baobab) 40%, transparent)",
  };
  if (url) {
    return <img src={url} alt="" className="shrink-0 rounded-full object-cover shadow-warm" style={baseStyle} />;
  }
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-display font-semibold text-[var(--baobab-foreground)] shadow-warm"
      style={{
        ...baseStyle,
        backgroundColor: `oklch(0.45 0.08 ${hue})`,
        fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
      }}
      aria-hidden
    >
      {initials}
    </div>
  );
}

function SocialLink({ href, label, children }: { href?: string | null; label: string; children: React.ReactNode }) {
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
      className="text-muted-foreground transition-colors hover:text-[var(--kola)]">
      {children}
    </a>
  );
}

function ProfilePage() {
  const { profile, projects } = Route.useLoaderData();
  const dev = profileToDeveloper(profile);
  const { user } = useAuth();
  const router = useRouter();
  const isOwner = user?.id === profile.id;
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const featured = projects[0];
  const gridProjects = projects.slice(1);

  const LANG = ["TypeScript","Python","Go","Dart","JavaScript","Rust","Java","Kotlin","Swift","PHP","Ruby","SQL"];
  const FRAME = ["React","React Native","Flutter","FastAPI","Next.js","Django","Node.js","Vue","Angular","Express","Laravel","TailwindCSS","Spring Boot"];
  const TOOL = ["PostgreSQL","AWS","Firebase","Terraform","Kubernetes","Git","Docker","Figma","Supabase","MongoDB","Redis","Vercel"];
  const skillGroups = [
    { label: "Languages", items: dev.skills.filter((s) => LANG.includes(s)) },
    { label: "Frameworks", items: dev.skills.filter((s) => FRAME.includes(s)) },
    { label: "Tools", items: dev.skills.filter((s) => TOOL.includes(s)) },
    { label: "Other", items: dev.skills.filter((s) => !LANG.includes(s) && !FRAME.includes(s) && !TOOL.includes(s)) },
  ].filter((g) => g.items.length > 0);

  const badges = [
    { name: "Verified Developer", issuer: "Bantabaa", icon: ShieldCheck, earned: profile.onboarding_completed, desc: "Profile complete." },
    { name: "Open Source Contributor", issuer: "GitHub", icon: GitBranch, earned: !!profile.github_url, desc: "Linked GitHub profile." },
    { name: "Community Mentor", issuer: "Bantabaa", icon: Users, earned: (profile.open_to ?? []).includes("mentoring"), desc: "Open to mentoring." },
    { name: "Bootcamp Certified", issuer: "Verified", icon: Code2, earned: false, desc: "Verifiable bootcamp completion." },
    { name: "UTG Graduate", issuer: "University of The Gambia", icon: GraduationCap, earned: false, desc: "Verified graduate." },
    { name: "Hackathon Winner", issuer: "Africa Code Week", icon: Trophy, earned: false, desc: "Won a recognized hackathon." },
  ];

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(typeof window !== "undefined" ? window.location.href : "");
      setCopied(true); toast.success("Profile link copied");
      setTimeout(() => setCopied(false), 1500);
    } catch { toast.error("Could not copy link"); }
  };

  return (
    <TooltipProvider delayDuration={150}>
      <div className="bg-background pb-28 md:pb-12">
        {/* COVER */}
        <Reveal as="section" className="relative">
          <div className="bg-cover-baobab-kola h-44 w-full md:h-60 overflow-hidden" aria-hidden>
            {profile.cover_url && <img src={profile.cover_url} alt="" className="h-full w-full object-cover" />}
          </div>
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <div className="-mt-14 flex flex-col gap-5 md:-mt-16 md:flex-row md:items-end md:justify-between">
              <div className="flex flex-col items-start gap-4 md:flex-row md:items-end">
                <div style={{ "--avatar-size": "6rem" } as React.CSSProperties} className="md:[--avatar-size:7.5rem]">
                  <BigAvatar name={dev.name} hue={dev.avatarHue} url={profile.avatar_url} />
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
                    {(profile.languages ?? []).length > 0 && <span aria-hidden>·</span>}
                    {(profile.languages ?? []).slice(0, 3).map((lang: any) => (
                      <span key={lang} className="rounded-full bg-secondary px-2 py-0.5 text-xs">{lang}</span>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-3 pl-1">
                    <SocialLink href={profile.github_url} label="GitHub"><Github className="size-4" /></SocialLink>
                    <SocialLink href={profile.linkedin_url} label="LinkedIn"><Linkedin className="size-4" /></SocialLink>
                    <SocialLink href={profile.twitter_url} label="Twitter"><Twitter className="size-4" /></SocialLink>
                    <SocialLink href={profile.website_url} label="Website"><Globe className="size-4" /></SocialLink>
                  </div>
                </div>
              </div>
              <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row">
                {isOwner ? (
                  <Button onClick={() => setEditing(true)} className="w-full bg-[var(--kola)] text-[var(--kola-foreground)] hover:bg-[var(--kola)]/90 md:w-auto">
                    <Pencil className="size-4" /> Edit Profile
                  </Button>
                ) : (
                  <Button className="w-full bg-[var(--kola)] text-[var(--kola-foreground)] hover:bg-[var(--kola)]/90 md:w-auto">
                    Request Collaboration
                  </Button>
                )}
                <Button variant="outline" onClick={onCopy} className="w-full border-[var(--baobab)]/40 text-foreground hover:bg-[var(--baobab)]/5 md:w-auto">
                  <MessageSquare className="size-4" /> {copied ? "Copied" : "Share"}
                </Button>
              </div>
            </div>
          </div>
        </Reveal>

        {/* BODY */}
        <div className="mx-auto mt-10 grid max-w-6xl gap-10 px-4 md:grid-cols-[1fr_280px] md:px-6">
          <div className="space-y-12">
            <Reveal as="section">
              <p className={SECTION_LABEL}>About</p>
              {profile.bio ? (
                <p className="mt-4 max-w-2xl text-[18px] text-foreground" style={{ lineHeight: 1.7 }}>{profile.bio}</p>
              ) : (
                <EmptyState message="No bio yet." cta={isOwner ? { label: "Write Your Bio", icon: PenLine, onClick: () => setEditing(true) } : undefined} />
              )}
            </Reveal>

            <Reveal as="section">
              <p className={SECTION_LABEL}>Skills</p>
              {skillGroups.length === 0 ? (
                <div className="mt-4">
                  <EmptyState message="No skills added yet." cta={isOwner ? { label: "Add Skills", icon: Sparkles, onClick: () => setEditing(true) } : undefined} />
                </div>
              ) : (
                <div className="mt-4 space-y-5">
                  {skillGroups.map((g, gi) => (
                    <div key={g.label}>
                      <h3 className="mb-2 text-sm font-medium text-muted-foreground">{g.label}</h3>
                      <div className="flex flex-wrap gap-2">
                        {g.items.map((s, i) => (
                          <span key={s} className={"tag-skill tag-in inline-flex items-center rounded-full font-medium " + (i === 0 ? "px-3 py-1.5 text-sm" : "px-2.5 py-1 text-xs")}
                            style={{ animationDelay: `${(gi * 4 + i) * 0.05}s` }}>{s}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Reveal>

            {featured && (
              <Reveal as="section">
                <p className={SECTION_LABEL}>Featured Project</p>
                <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
                  <div className="relative aspect-[16/9] w-full" style={{ background: `linear-gradient(135deg, var(--baobab) 0%, var(--kola) 100%)` }} aria-hidden>
                    <div className="absolute bottom-3 left-3"><TagPill variant="domain" domain={featured.domain} /></div>
                  </div>
                  <div className="p-6 md:p-7">
                    <h3 className="font-display text-2xl font-semibold text-foreground">{featured.name}</h3>
                    <p className="mt-2 text-base text-muted-foreground">{featured.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {featured.stack.map((t: any) => <TagPill key={t} variant="outlined">{t}</TagPill>)}
                    </div>
                    <div className="mt-6 flex flex-wrap gap-2">
                      <Link to="/projects/$slug" params={{ slug: featured.slug }}>
                        <Button>View Project</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            )}

            <section>
              <p className={SECTION_LABEL}>Projects</p>
              {projects.length === 0 ? (
                <div className="mt-4">
                  <EmptyState
                    message={isOwner ? "No projects shared yet. Your first project is waiting to be told." : "No projects yet."}
                    cta={isOwner ? { label: "Share a Project", icon: FolderPlus, to: "/projects/new" } : undefined}
                  />
                </div>
              ) : gridProjects.length === 0 ? null : (
                <RevealStagger className="mt-4 grid gap-6 sm:grid-cols-2" stagger={0.1}>
                  {gridProjects.map((p: any) => (
                    <Reveal key={p.slug}><ProjectCard project={p} /></Reveal>
                  ))}
                </RevealStagger>
              )}
            </section>

            <Reveal as="section">
              <p className={SECTION_LABEL}>Community</p>
              <div className="mt-4 rounded-2xl border border-border bg-[var(--cream)] p-6 dark:bg-card md:p-8">
                <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                  {[
                    { v: projects.length, l: "Projects Shared" },
                    { v: 0, l: "Discussions Started" },
                    { v: 0, l: "Developers Helped" },
                    { v: dev.skills.length * 50, l: "Reputation Score" },
                  ].map((s) => (
                    <div key={s.l} className="text-center md:text-left">
                      <CountUp to={s.v} duration={1.2} className="font-display text-4xl font-bold text-[var(--kola)]" />
                      <div className="mt-1 text-sm text-muted-foreground">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal as="section">
              <p className={SECTION_LABEL}>Verified</p>
              <div className="mt-4 -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 lg:grid-cols-6">
                {badges.map((b) => {
                  const Icon = b.earned ? b.icon : Lock;
                  return (
                    <Tooltip key={b.name}>
                      <TooltipTrigger asChild>
                        <div className={"flex w-28 shrink-0 flex-col items-center text-center md:w-auto " + (b.earned ? "" : "opacity-40")}>
                          <div className="flex size-14 items-center justify-center rounded-full"
                            style={{ background: b.earned ? "color-mix(in oklab, var(--kola) 16%, transparent)" : "var(--muted)" }}>
                            <Icon className={"size-6 " + (b.earned ? "text-[var(--kola)]" : "text-muted-foreground")} />
                          </div>
                          <div className="mt-2 text-xs font-medium text-foreground">{b.name}</div>
                          <div className="text-[11px] text-muted-foreground">{b.issuer}</div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>{b.desc}</TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </Reveal>
          </div>

          {/* Sidebar */}
          <aside className="md:sticky md:top-24 md:self-start md:space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <p className="text-label text-muted-foreground"><Award className="mr-1 inline size-3.5" />Open to</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(profile.open_to ?? []).filter((x: any) => x !== "not_available").length === 0 ? (
                  <p className="text-sm text-muted-foreground">Not currently available</p>
                ) : (profile.open_to ?? []).filter((x) => x !== "not_available").map((o) => (
                  <span key={o} className="inline-flex items-center rounded-full bg-[var(--savanna)]/15 px-2.5 py-1 text-xs font-medium capitalize text-[var(--savanna)]">{o}</span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {isOwner && (
        <EditProfileDialog profile={profile} open={editing} onOpenChange={setEditing} onSaved={() => router.invalidate()} />
      )}
    </TooltipProvider>
  );
}

function EmptyState({ message, cta }: { message: string; cta?: { label: string; icon: React.ComponentType<{ className?: string }>; onClick?: () => void; to?: string } }) {
  const Icon = cta?.icon;
  const inner = (
    <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
      {cta && (
        cta.to ? (
          <Link to={cta.to}>
            <Button variant="outline" className="mt-4">{Icon && <Icon className="size-4" />} {cta.label}</Button>
          </Link>
        ) : (
          <Button variant="outline" className="mt-4" onClick={cta.onClick}>{Icon && <Icon className="size-4" />} {cta.label}</Button>
        )
      )}
    </div>
  );
  return inner;
}
