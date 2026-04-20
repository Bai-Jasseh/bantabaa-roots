import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Bookmark, Building2, Clock, MapPin, ArrowRight, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { TagPill } from "@/components/TagPill";
import { cn } from "@/lib/utils";

export type OpportunityType = "Job" | "Contract" | "Grant" | "Mentorship";
export type LocationType = "Remote" | "Hybrid" | "On-site";
export type ExperienceLevel = "Junior" | "Mid" | "Senior" | "Any";

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
  experience?: ExperienceLevel;
  deadlineDays?: number;
  featured?: boolean;
  applicants?: number;
  contractDuration?: string;
  projectType?: string;
  eligibility?: string[];
  mentorSlots?: number;
  sessionFormat?: string;
}

const LOCATION_TYPE_STYLES: Record<LocationType, string> = {
  Remote: "bg-[color-mix(in_oklab,var(--savanna)_14%,transparent)] text-[var(--savanna)] border-[var(--savanna)]/30",
  Hybrid: "bg-[color-mix(in_oklab,var(--kola)_14%,transparent)] text-[var(--kola)] border-[var(--kola)]/30",
  "On-site": "bg-secondary text-foreground/80 border-border",
};

export function OpportunityCard({ op, className, featured }: { op: Opportunity; className?: string; featured?: boolean }) {
  const [saved, setSaved] = useState(false);
  const isFeatured = featured ?? op.featured;
  const isUrgent = op.deadlineDays !== undefined && op.deadlineDays <= 3;
  const initial = op.company[0]?.toUpperCase() ?? "?";

  const onSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSaved((s) => !s);
    if (!saved) toast.success("Saved to your opportunities.");
  };

  return (
    <Link
      to="/opportunities/$id"
      params={{ id: op.id }}
      className={cn(
        "group relative flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-warm sm:flex-row sm:p-6",
        isFeatured && "border-l-4 border-l-[var(--kola)] bg-[oklch(0.97_0.022_75)] dark:bg-[color-mix(in_oklab,var(--kola)_8%,var(--card))]",
        className,
      )}
    >
      {isFeatured && (
        <span className="absolute -top-3 left-4 rounded-full bg-[var(--kola)] px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--kola-foreground)]">
          Featured
        </span>
      )}
      <div
        className="flex size-14 shrink-0 items-center justify-center rounded-2xl font-display text-xl font-bold"
        style={{
          backgroundColor: `color-mix(in oklab, var(--kola) 18%, transparent)`,
          color: `var(--kola)`,
        }}
        aria-hidden
      >
        {op.company.match(/^https?:/) ? <Building2 className="size-6" /> : initial}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-semibold text-foreground">{op.title}</h3>
          <button
            type="button"
            onClick={onSave}
            aria-label={saved ? "Unsave" : "Save opportunity"}
            className="shrink-0 rounded-full p-1.5 text-muted-foreground transition-all hover:bg-secondary hover:text-[var(--kola)]"
          >
            <Bookmark className={cn("size-4 transition-transform", saved && "fill-[var(--kola)] text-[var(--kola)] scale-110")} />
          </button>
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          <span className="font-medium text-foreground">{op.company}</span>
          <span className="text-muted-foreground">·</span>
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <MapPin className="size-3.5" /> {op.location}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium", LOCATION_TYPE_STYLES[op.locationType])}>
            {op.locationType}
          </span>
          {op.experience && op.experience !== "Any" && (
            <TagPill variant="outlined">{op.experience}</TagPill>
          )}
          {op.contractDuration && <TagPill variant="outlined">{op.contractDuration}</TagPill>}
          {op.projectType && <TagPill variant="outlined">{op.projectType}</TagPill>}
          {op.sessionFormat && <TagPill variant="outlined">{op.sessionFormat}</TagPill>}
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {op.tags.slice(0, 4).map((t) => (
            <TagPill key={t} variant="outlined">{t}</TagPill>
          ))}
          {op.tags.length > 4 && <TagPill variant="outlined">+{op.tags.length - 4} more</TagPill>}
        </div>

        {op.compensation && (
          <div className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
            <DollarSign className="size-3.5 text-[var(--kola)]" />
            {op.compensation}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-3">
          <span className={cn(
            "inline-flex items-center gap-1 text-xs",
            isUrgent ? "font-semibold text-[var(--destructive)]" : "text-muted-foreground",
          )}>
            <Clock className="size-3.5" />
            {op.deadlineDays !== undefined
              ? `Closes in ${op.deadlineDays}d`
              : op.postedDays === 0 ? "Posted today" : `Posted ${op.postedDays}d ago`}
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-[var(--kola)] group-hover:gap-2 transition-all">
            View details <ArrowRight className="size-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
