import { useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

type Props = {
  bucket: "avatars" | "project-covers";
  value?: string | null;
  onChange: (url: string | null) => void;
  shape?: "circle" | "rect";
  label?: string;
  className?: string;
};

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export function ImageUpload({ bucket, value, onChange, shape = "rect", label, className }: Props) {
  const { user } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const upload = async (file: File) => {
    if (!user) { toast.error("Sign in to upload."); return; }
    if (!file.type.startsWith("image/")) { toast.error("Pick an image file."); return; }
    if (file.size > MAX_BYTES) { toast.error("Image must be under 5 MB."); return; }

    setBusy(true);
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });
    if (error) { setBusy(false); toast.error(error.message); return; }
    const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);
    onChange(pub.publicUrl);
    setBusy(false);
    toast.success("Image uploaded.");
  };

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) void upload(f);
    e.target.value = "";
  };

  const isCircle = shape === "circle";

  return (
    <div className={cn("space-y-2", className)}>
      {label && <p className="text-sm font-medium text-foreground">{label}</p>}
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "relative flex shrink-0 items-center justify-center overflow-hidden border border-dashed border-border bg-secondary/40",
            isCircle ? "size-20 rounded-full" : "h-24 w-40 rounded-lg",
          )}
        >
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <Upload className="size-5 text-muted-foreground" aria-hidden />
          )}
          {busy && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/70">
              <Loader2 className="size-5 animate-spin text-[var(--kola)]" />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onPick} />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="inline-flex h-9 items-center rounded-md border border-border bg-background px-3 text-sm font-medium hover:bg-secondary disabled:opacity-50"
          >
            {value ? "Change" : "Upload"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="inline-flex h-8 items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="size-3" /> Remove
            </button>
          )}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">PNG or JPG, max 5 MB.</p>
    </div>
  );
}
