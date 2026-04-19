import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
  variant?: "color" | "light" | "dark";
}

/**
 * Bantabaa logo — abstract baobab with a network-of-nodes canopy.
 * Pure inline SVG so it scales crisply at favicon and hero sizes alike.
 */
export function Logo({ className, showWordmark = true, variant = "color" }: LogoProps) {
  const trunk = variant === "light" ? "currentColor" : variant === "dark" ? "currentColor" : "var(--baobab)";
  const nodes = variant === "light" ? "currentColor" : variant === "dark" ? "currentColor" : "var(--kola)";
  const links = variant === "light"
    ? "color-mix(in oklab, currentColor 40%, transparent)"
    : variant === "dark"
      ? "color-mix(in oklab, currentColor 40%, transparent)"
      : "color-mix(in oklab, var(--kola) 50%, transparent)";

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <svg
        viewBox="0 0 40 40"
        aria-hidden="true"
        className="size-8 shrink-0"
        fill="none"
      >
        {/* Canopy connector lines */}
        <g stroke={links} strokeWidth="0.8" strokeLinecap="round">
          <line x1="10" y1="10" x2="20" y2="6" />
          <line x1="20" y1="6" x2="30" y2="10" />
          <line x1="10" y1="10" x2="14" y2="14" />
          <line x1="30" y1="10" x2="26" y2="14" />
          <line x1="14" y1="14" x2="20" y2="6" />
          <line x1="26" y1="14" x2="20" y2="6" />
          <line x1="14" y1="14" x2="20" y2="14" />
          <line x1="20" y1="14" x2="26" y2="14" />
          <line x1="6" y1="14" x2="10" y2="10" />
          <line x1="34" y1="14" x2="30" y2="10" />
        </g>
        {/* Canopy nodes */}
        <g fill={nodes}>
          <circle cx="20" cy="6" r="2.4" />
          <circle cx="10" cy="10" r="1.8" />
          <circle cx="30" cy="10" r="1.8" />
          <circle cx="6" cy="14" r="1.4" />
          <circle cx="14" cy="14" r="1.4" />
          <circle cx="20" cy="14" r="1.4" />
          <circle cx="26" cy="14" r="1.4" />
          <circle cx="34" cy="14" r="1.4" />
        </g>
        {/* Trunk */}
        <path
          d="M18 18 Q17 24 16 30 Q15.5 34 14 36 L26 36 Q24.5 34 24 30 Q23 24 22 18 Z"
          fill={trunk}
        />
      </svg>
      {showWordmark && (
        <span className="font-display text-xl font-bold tracking-tight">
          Bantabaa
        </span>
      )}
    </div>
  );
}
