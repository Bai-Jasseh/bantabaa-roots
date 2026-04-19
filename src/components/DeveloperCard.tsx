import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { TagPill } from "@/components/TagPill";
import { BrandBadge } from "@/components/BrandBadge";
import { cn } from "@/lib/utils";

export interface Developer {
  handle: string;
  name: string;
  title: string;
  location: string;
  flag: string;
  skills: string[];
  openTo?: "Work" | "Freelance" | "Collaboration" | "Mentoring";
  avatarHue?: number;
}

interface DeveloperCardProps {
  dev: Developer;
  className?: string;
}

function Avatar({ name, hue = 30 }: { name: string; hue?: number }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
  return (
    <div
      className="flex size-12 shrink-0 items-center justify-center rounded-full font-display text-base font-semibold text-[var(--baobab-foreground)] ring-2 ring-[var(--kola)]/60"
      style={{ backgroundColor: `oklch(0.45 0.08 ${hue})` }}
      aria-hidden
    >
      {initials}
    </div>
  );
}

export function DeveloperCard({ dev, className }: DeveloperCardProps) {
  return (
    <Link
      to="/profile/$handle"
      params={{ handle: dev.handle }}
      className={cn(
        "group flex w-72 shrink-0 flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-warm",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <Avatar name={dev.name} hue={dev.avatarHue} />
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-base font-semibold leading-tight text-foreground">
            {dev.name}
          </h3>
          <p className="truncate text-sm text-muted-foreground">{dev.title}</p>
        </div>
      </div>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <MapPin className="size-3.5" />
        <span>{dev.flag} {dev.location}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {dev.skills.slice(0, 3).map((s) => (
          <TagPill key={s}>{s}</TagPill>
        ))}
      </div>
      {dev.openTo && (
        <BrandBadge tone="kola" className="self-start">
          Open to {dev.openTo}
        </BrandBadge>
      )}
    </Link>
  );
}

export { Avatar };
