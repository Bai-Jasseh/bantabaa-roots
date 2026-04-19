import { Link } from "@tanstack/react-router";
import { Bookmark, Building2, MapPin } from "lucide-react";
import { TagPill } from "@/components/TagPill";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type OpportunityType = "Job" | "Contract" | "Grant" | "Mentorship";
export type LocationType = "Remote" | "Hybrid" | "On-site";

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  type: OpportunityType;
  location: string;
  locationType: LocationType;
  tags: string[];
  compensation?: string;
  postedDays: number;
  logoHue?: number;
}

export function OpportunityCard({ op, className }: { op: Opportunity; className?: string }) {
  return (
    <div
      className={cn(
        "group flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:shadow-warm sm:flex-row sm:items-center",
        className,
      )}
    >
      <div
        className="flex size-12 shrink-0 items-center justify-center rounded-xl text-white"
        style={{ backgroundColor: `oklch(0.45 0.08 ${op.logoHue ?? 60})` }}
        aria-hidden
      >
        <Building2 className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-display text-lg font-semibold text-foreground">{op.title}</h3>
          <TagPill variant="outlined">{op.locationType}</TagPill>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span>{op.company}</span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3.5" />
            {op.location}
          </span>
          {op.compensation && <span className="text-foreground/80">· {op.compensation}</span>}
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {op.tags.slice(0, 4).map((t) => (
            <TagPill key={t}>{t}</TagPill>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 self-stretch sm:self-center">
        <span className="hidden text-xs text-muted-foreground sm:block">
          {op.postedDays === 0 ? "Today" : `${op.postedDays}d ago`}
        </span>
        <Button variant="ghost" size="icon" aria-label="Save">
          <Bookmark className="size-4" />
        </Button>
        <Link to="/opportunities/$id" params={{ id: op.id }}>
          <Button className="bg-[var(--kola)] text-[var(--kola-foreground)] hover:bg-[var(--kola)]/90">
            View
          </Button>
        </Link>
      </div>
    </div>
  );
}
