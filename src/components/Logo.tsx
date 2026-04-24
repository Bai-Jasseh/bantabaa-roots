import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
  variant?: "color" | "light" | "dark";
}

/**
 * Bantabaa logo — refined baobab mark with a connected canopy.
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
        className="size-9 shrink-0 drop-shadow-sm"
        fill="none"
      >
        <defs>
          <linearGradient id="bantabaa-trunk" x1="15" y1="18" x2="27" y2="37" gradientUnits="userSpaceOnUse">
            <stop stopColor={trunk} />
            <stop offset="1" stopColor={trunk} stopOpacity="0.82" />
          </linearGradient>
          <radialGradient id="bantabaa-node" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(18 8) rotate(55) scale(22)">
            <stop stopColor={nodes} />
            <stop offset="1" stopColor={nodes} stopOpacity="0.72" />
          </radialGradient>
        </defs>

        <path
          d="M20 4.8c-5.9 0-10.8 2.5-13.5 6.7-1 1.5-.1 3.5 1.7 3.7 1.4.1 2.7.6 3.8 1.4 2.3 1.8 4.9 2.6 8 2.6s5.7-.8 8-2.6c1.1-.8 2.4-1.3 3.8-1.4 1.8-.2 2.7-2.2 1.7-3.7C30.8 7.3 25.9 4.8 20 4.8Z"
          fill={nodes}
          opacity="0.08"
        />

        {/* Canopy connector lines */}
        <g stroke={links} strokeWidth="1.05" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7.2 14.7 11 10.5 17 8.1 20 5.9 23 8.1 29 10.5 32.8 14.7" />
          <path d="M11 10.5 15.2 15.1 20 13.3 24.8 15.1 29 10.5" />
          <path d="M17 8.1 15.2 15.1 11.8 18.1" />
          <path d="M23 8.1 24.8 15.1 28.2 18.1" />
          <path d="M15.2 15.1h9.6" />
        </g>

        {/* Canopy nodes */}
        <g fill="url(#bantabaa-node)">
          <circle cx="20" cy="5.9" r="2.8" />
          <circle cx="17" cy="8.1" r="1.85" />
          <circle cx="23" cy="8.1" r="1.85" />
          <circle cx="11" cy="10.5" r="2.15" />
          <circle cx="29" cy="10.5" r="2.15" />
          <circle cx="7.2" cy="14.7" r="1.65" />
          <circle cx="15.2" cy="15.1" r="1.75" />
          <circle cx="20" cy="13.3" r="1.55" />
          <circle cx="24.8" cy="15.1" r="1.75" />
          <circle cx="32.8" cy="14.7" r="1.65" />
        </g>

        {/* Trunk */}
        <path
          d="M18.2 17.6c-.25 3.8-.9 7.1-1.95 10.1-.78 2.26-1.45 5.02-1.75 8.3h11c-.3-3.28-.97-6.04-1.75-8.3-1.05-3-1.7-6.3-1.95-10.1-.05-.78-.72-1.4-1.8-1.4s-1.75.62-1.8 1.4Z"
          fill="url(#bantabaa-trunk)"
        />
        <path
          d="M20 17c-.18 4.4-.2 9.75-.05 16.15"
          stroke={variant === "color" ? "color-mix(in oklab, var(--cream) 50%, var(--baobab))" : "currentColor"}
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.45"
        />
      </svg>
      {showWordmark && (
        <span className="font-display text-xl font-bold tracking-tight text-foreground">
          Bantabaa
        </span>
      )}
    </div>
  );
}
