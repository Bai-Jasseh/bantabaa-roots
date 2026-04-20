import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "filled" | "outlined" | "domain";
export type Domain = "Fintech" | "Agritech" | "Healthtech" | "Edtech" | "Govtech" | "Open Source" | "Other";

interface TagPillProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
  domain?: Domain;
}

const DOMAIN_TOKEN: Record<Domain, string> = {
  Fintech: "var(--domain-fintech)",
  Agritech: "var(--domain-agritech)",
  Healthtech: "var(--domain-healthtech)",
  Edtech: "var(--domain-edtech)",
  Govtech: "var(--domain-govtech)",
  "Open Source": "var(--domain-opensource)",
  Other: "var(--domain-other)",
};

export function TagPill({
  variant = "filled",
  domain,
  className,
  children,
  style,
  ...props
}: TagPillProps) {
  const base =
    "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium leading-none";

  if (variant === "domain" && domain) {
    const color = DOMAIN_TOKEN[domain];
    return (
      <span
        className={cn(base, className)}
        style={{
          backgroundColor: `color-mix(in oklab, ${color} 14%, transparent)`,
          color,
          ...style,
        }}
        {...props}
      >
        <span
          className="size-1.5 rounded-full"
          style={{ backgroundColor: color }}
          aria-hidden
        />
        {children ?? domain}
      </span>
    );
  }

  if (variant === "outlined") {
    return (
      <span
        className={cn(base, "border border-border bg-transparent text-foreground/80", className)}
        {...props}
      >
        {children}
      </span>
    );
  }

  return (
    <span
      className={cn(
        base,
        "bg-[color-mix(in_oklab,var(--savanna)_14%,transparent)] text-[var(--savanna)]",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
