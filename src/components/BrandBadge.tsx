import * as React from "react";
import { cn } from "@/lib/utils";

interface BrandBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  icon?: React.ReactNode;
  tone?: "default" | "kola" | "savanna" | "baobab";
}

export function BrandBadge({ icon, tone = "default", className, children, ...props }: BrandBadgeProps) {
  const tones: Record<string, string> = {
    default: "bg-secondary text-secondary-foreground",
    kola: "bg-[color-mix(in_oklab,var(--kola)_18%,transparent)] text-[var(--kola)]",
    savanna: "bg-[color-mix(in_oklab,var(--savanna)_16%,transparent)] text-[var(--savanna)]",
    baobab: "bg-[var(--baobab)] text-[var(--baobab-foreground)]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className,
      )}
      {...props}
    >
      {icon && <span className="flex size-3.5 items-center justify-center">{icon}</span>}
      {children}
    </span>
  );
}
