import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

/**
 * Renders children only when a Supabase session is hydrated and a user
 * is signed in. While the session is restoring, shows a quiet loader.
 * If no user is present, shows an inline sign-in prompt instead of
 * redirecting (which races the auth hydration and kicks signed-in users out).
 */
export function AuthGate({ children, message }: { children: ReactNode; message?: string }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[40vh] max-w-md items-center justify-center px-4 py-16 text-muted-foreground">
        <div className="size-6 animate-spin rounded-full border-2 border-[var(--kola)] border-t-transparent" aria-label="Loading" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold">Sign in to continue</h1>
        <p className="mt-2 text-muted-foreground">{message ?? "You need an account to do that."}</p>
        <div className="mt-6 flex justify-center gap-2">
          <Link to="/login"><Button className="bg-[var(--kola)] text-[var(--kola-foreground)] hover:bg-[var(--kola)]/90">Log in</Button></Link>
          <Link to="/onboarding"><Button variant="outline">Join Bantabaa</Button></Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
