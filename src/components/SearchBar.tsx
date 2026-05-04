import { useState, useRef, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchBar({ className, autoFocus = false }: { className?: string; autoFocus?: boolean }) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = q.trim();
    if (!value) return;
    navigate({ to: "/search", search: { q: value } });
  };

  return (
    <form onSubmit={submit} className={cn("relative", className)} role="search">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
      <input
        ref={inputRef}
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search devs, projects, opportunities…"
        aria-label="Search"
        className="h-9 w-full rounded-full border border-border bg-secondary/60 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[var(--kola)] focus:bg-background focus:outline-none focus:ring-2 focus:ring-[var(--kola)]/30"
      />
    </form>
  );
}
