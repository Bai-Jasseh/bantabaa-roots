import { Link } from "@tanstack/react-router";
import { TagPill } from "@/components/TagPill";
import { ReactionStrip } from "@/components/ReactionStrip";
import { Avatar } from "@/components/DeveloperCard";
import { cn } from "@/lib/utils";

export type Domain = "Fintech" | "Agritech" | "Healthtech" | "Edtech" | "Govtech" | "Open Source" | "Other";

export interface Project {
  id?: string;
  slug: string;
  name: string;
  description: string;
  domain: Domain;
  builder: { name: string; handle: string; hue?: number; location?: string; flag?: string; avatarUrl?: string | null };
  stack: string[];
  appreciate: number;
  discuss: number;
  coverHue?: number;
  coverUrl?: string | null;
  year?: number;
  postedDays?: number;
  seekingCollab?: boolean;
  featured?: boolean;
}

const DOMAIN_HUES: Record<string, string> = {
  Fintech: "var(--domain-fintech)",
  Agritech: "var(--domain-agritech)",
  Healthtech: "var(--domain-healthtech)",
  Edtech: "var(--domain-edtech)",
  Govtech: "var(--domain-govtech)",
  "Open Source": "var(--domain-opensource)",
  Other: "var(--domain-other)",
};

export function ProjectCard({ project, className }: { project: Project; className?: string }) {
  const color = DOMAIN_HUES[project.domain] ?? "var(--domain-other)";
  const isNew = (project.postedDays ?? 99) <= 2;
  return (
    <Link to="/projects/$slug" params={{ slug: project.slug }}
      className={cn("group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-[250ms] ease-out hover:-translate-y-1 hover:shadow-warm", className)}>
      <div className="relative aspect-[16/9] w-full overflow-hidden"
        style={project.coverUrl ? undefined : { background: `linear-gradient(135deg, color-mix(in oklab, ${color} 60%, var(--baobab)) 0%, color-mix(in oklab, ${color} 30%, var(--background)) 100%)` }}>
        {project.coverUrl ? (
          <img src={project.coverUrl} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
        ) : (
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.18) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(0,0,0,0.18) 0%, transparent 50%)" }} />
        )}
        <div className="absolute left-2 bottom-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-medium leading-none shadow-sm" style={{ color }}>
            <span className="size-1.5 rounded-full" style={{ backgroundColor: color }} aria-hidden />
            {project.domain}
          </span>
        </div>
        {isNew && <span className="absolute right-2 top-2 rounded-full bg-[var(--kola)] px-2 py-0.5 text-[11px] font-medium text-[var(--kola-foreground)] shadow-sm">New</span>}
        {project.year && <span className="absolute right-2 bottom-2 rounded-full bg-black/30 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur">{project.year}</span>}
        {!project.coverUrl && <div className="absolute bottom-3 right-3 hidden font-display text-4xl font-bold text-white/30 sm:block" aria-hidden>{project.name[0]}</div>}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="truncate font-display text-[18px] font-semibold leading-tight text-foreground">{project.name}</h3>
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{project.description}</p>
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <div className="scale-75 origin-left"><Avatar name={project.builder.name} hue={project.builder.hue} url={project.builder.avatarUrl} /></div>
          <span className="truncate text-sm font-medium text-foreground">{project.builder.name}</span>
          {project.builder.location && (
            <span className="truncate text-xs text-muted-foreground">· {project.builder.flag} {project.builder.location.split(",")[0]}</span>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {project.stack.slice(0, 3).map((t) => <TagPill key={t} variant="outlined">{t}</TagPill>)}
          {project.stack.length > 3 && <TagPill variant="outlined">+{project.stack.length - 3} more</TagPill>}
        </div>
        <div className="mt-auto border-t border-border pt-3">
          <ReactionStrip projectId={project.id} appreciate={project.appreciate} discuss={project.discuss} />
        </div>
      </div>
    </Link>
  );
}
