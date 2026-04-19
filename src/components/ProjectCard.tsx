import { Link } from "@tanstack/react-router";
import { TagPill } from "@/components/TagPill";
import { ReactionStrip } from "@/components/ReactionStrip";
import { Avatar } from "@/components/DeveloperCard";
import { cn } from "@/lib/utils";

export type Domain = "Fintech" | "Agritech" | "Healthtech" | "Edtech" | "Govtech" | "Other";

export interface Project {
  slug: string;
  name: string;
  description: string;
  domain: Domain;
  builder: { name: string; handle: string; hue?: number };
  stack: string[];
  appreciate: number;
  discuss: number;
  coverHue?: number;
}

const DOMAIN_HUES: Record<Domain, string> = {
  Fintech: "var(--domain-fintech)",
  Agritech: "var(--domain-agritech)",
  Healthtech: "var(--domain-healthtech)",
  Edtech: "var(--domain-edtech)",
  Govtech: "var(--domain-govtech)",
  Other: "var(--domain-other)",
};

export function ProjectCard({ project, className }: { project: Project; className?: string }) {
  const color = DOMAIN_HUES[project.domain];
  return (
    <Link
      to="/projects/$slug"
      params={{ slug: project.slug }}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-warm",
        className,
      )}
    >
      <div
        className="relative aspect-[16/10] w-full overflow-hidden"
        style={{
          background: `linear-gradient(135deg, color-mix(in oklab, ${color} 55%, var(--baobab)) 0%, color-mix(in oklab, ${color} 25%, var(--background)) 100%)`,
        }}
      >
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage:
            "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(0,0,0,0.15) 0%, transparent 50%)",
        }} />
        <div className="absolute left-4 top-4">
          <TagPill variant="domain" domain={project.domain} />
        </div>
        <div
          className="absolute bottom-3 right-3 font-display text-4xl font-bold text-white/30"
          aria-hidden
        >
          {project.name[0]}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="font-display text-lg font-semibold leading-tight text-foreground">
            {project.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {project.stack.slice(0, 3).map((t) => (
            <TagPill key={t} variant="outlined">{t}</TagPill>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="scale-75 origin-left">
              <Avatar name={project.builder.name} hue={project.builder.hue} />
            </div>
            <span className="truncate text-xs text-muted-foreground">{project.builder.name}</span>
          </div>
          <ReactionStrip appreciate={project.appreciate} discuss={project.discuss} />
        </div>
      </div>
    </Link>
  );
}
