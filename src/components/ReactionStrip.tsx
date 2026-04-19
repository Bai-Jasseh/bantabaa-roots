import { useState } from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReactionStripProps {
  appreciate: number;
  discuss: number;
  className?: string;
}

export function ReactionStrip({ appreciate, discuss, className }: ReactionStripProps) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(appreciate);

  const onLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(!liked);
    setCount((c) => c + (liked ? -1 : 1));
  };

  return (
    <div className={cn("flex items-center gap-1 text-xs text-muted-foreground", className)}>
      <button
        type="button"
        onClick={onLike}
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2 py-1 transition-all hover:bg-secondary",
          liked && "text-[var(--kola)]",
        )}
        aria-pressed={liked}
        aria-label="Appreciate"
      >
        <Heart
          className={cn("size-3.5 transition-transform", liked && "scale-110 fill-current")}
        />
        <span className="tabular-nums">{count}</span>
      </button>
      <span className="inline-flex items-center gap-1 rounded-full px-2 py-1">
        <MessageCircle className="size-3.5" />
        <span className="tabular-nums">{discuss}</span>
      </span>
      <button
        type="button"
        onClick={(e) => e.preventDefault()}
        className="inline-flex items-center gap-1 rounded-full px-2 py-1 transition-colors hover:bg-secondary"
        aria-label="Share"
      >
        <Share2 className="size-3.5" />
      </button>
    </div>
  );
}
