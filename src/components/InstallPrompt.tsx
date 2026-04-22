import { useEffect, useState } from "react";
import { X } from "lucide-react";
// Logo intentionally not used — install card uses a compact mark
import { Button } from "@/components/ui/button";

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const STORAGE_KEY = "bantabaa-install-prompt";
const VISITS_KEY = "bantabaa-visits";

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    // iOS Safari
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function isPreviewHost() {
  if (typeof window === "undefined") return true;
  const h = window.location.hostname;
  return h.includes("lovable.app") || h.includes("lovableproject.com") || h === "localhost";
}

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isStandalone() || isPreviewHost()) return;

    // Track visit count
    try {
      const v = Number(localStorage.getItem(VISITS_KEY) || "0") + 1;
      localStorage.setItem(VISITS_KEY, String(v));
      const state = localStorage.getItem(STORAGE_KEY); // "dismissed-1" | "dismissed-2" | "accepted"
      if (state === "accepted" || state === "dismissed-2") return;

      const onPrompt = (e: Event) => {
        e.preventDefault();
        setDeferred(e as BIPEvent);
        if (v >= 2) setShow(true);
      };
      window.addEventListener("beforeinstallprompt", onPrompt as EventListener);
      return () => window.removeEventListener("beforeinstallprompt", onPrompt as EventListener);
    } catch {
      return;
    }
  }, []);

  if (!show) return null;

  const dismiss = () => {
    try {
      const prev = localStorage.getItem(STORAGE_KEY);
      localStorage.setItem(STORAGE_KEY, prev === "dismissed-1" ? "dismissed-2" : "dismissed-1");
    } catch {}
    setShow(false);
  };

  const install = async () => {
    if (!deferred) return;
    try {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === "accepted") {
        localStorage.setItem(STORAGE_KEY, "accepted");
      }
    } catch {}
    setShow(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Install Bantabaa"
      className="fixed inset-x-0 bottom-[calc(64px+env(safe-area-inset-bottom))] z-50 mx-auto max-w-md px-3 md:max-w-lg"
      style={{ animation: "step-in-right 0.3s ease-out both" }}
    >
      <div className="rounded-2xl border border-border bg-card/95 p-4 shadow-warm backdrop-blur-xl">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-muted" />
        <div className="flex items-start gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[var(--kola)]/15 font-display text-xl font-bold text-[var(--kola)]">
            B
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-display text-base font-semibold text-foreground">
              Add Bantabaa to your home screen
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              One tap away from the community.
            </p>
          </div>
          <button
            onClick={dismiss}
            aria-label="Dismiss"
            className="-mr-1 -mt-1 flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Button
            onClick={install}
            className="h-11 flex-1 bg-[var(--kola)] text-[var(--kola-foreground)] hover:bg-[var(--kola)]/90"
          >
            Add to Home Screen
          </Button>
          <Button onClick={dismiss} variant="ghost" className="h-11 text-muted-foreground">
            Not now
          </Button>
        </div>
      </div>
    </div>
  );
}
