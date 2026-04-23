import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface ReactionStripProps {
  appreciate: number;
  discuss: number;
  className?: string;
  projectId?: string;
}

export function ReactionStrip({ appreciate, discuss, className, projectId }: ReactionStripProps) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(appreciate);
  const [busy, setBusy] = useState(false);

  useEffect(() => { setCount(appreciate); }, [appreciate]);

  useEffect(() => {
    if (!user || !projectId) { setLiked(false); return; }
    let cancelled = false;
    supabase.from("project_reactions").select("id").eq("project_id", projectId).eq("user_id", user.id).eq("kind", "appreciate").maybeSingle()
      .then(({ data }) => { if (!cancelled) setLiked(!!data); });
    return () => { cancelled = true; };
  }, [user, projectId]);

  const onLike = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!projectId) { setLiked((v) => !v); setCount((c) => c + (liked ? -1 : 1)); return; }
    if (!user) { toast.error("Sign in to appreciate."); return; }
    if (busy) return;
    setBusy(true);
    if (liked) {
      await supabase.from("project_reactions").delete().eq("project_id", projectId).eq("user_id", user.id).eq("kind", "appreciate");
      setLiked(false); setCount((c) => Math.max(0, c - 1));
    } else {
      const { error } = await supabase.from("project_reactions").insert({ project_id: projectId, user_id: user.id, kind: "appreciate" });
      if (!error) { setLiked(true); setCount((c) => c + 1); }
    }
    setBusy(false);
  };

  const onShare = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    try {
      await navigator.clipboard.writeText(typeof window !== "undefined" ? window.location.href : "");
      toast.success("Link copied");
    } catch { /* noop */ }
  };

  return (
    <div className={cn("flex items-center gap-1 text-xs text-muted-foreground", className)}>
      <button type="button" onClick={onLike} aria-pressed={liked} aria-label="Appreciate"
        className={cn("inline-flex items-center gap-1 rounded-full px-2 py-1 transition-all hover:bg-secondary", liked && "text-[var(--kola)]")}>
        <Heart className={cn("size-3.5 transition-transform", liked && "scale-110 fill-current")} />
        <span className="tabular-nums">{count}</span>
      </button>
      <span className="inline-flex items-center gap-1 rounded-full px-2 py-1">
        <MessageCircle className="size-3.5" />
        <span className="tabular-nums">{discuss}</span>
      </span>
      <button type="button" onClick={onShare} className="inline-flex items-center gap-1 rounded-full px-2 py-1 transition-colors hover:bg-secondary" aria-label="Share">
        <Share2 className="size-3.5" />
      </button>
    </div>
  );
}
