import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — Bantabaa" },
      { name: "description", content: "Sign in to your Bantabaa account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: pwd });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome back.");
    navigate({ to: "/" });
  };

  const handleGoogle = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) {
      setLoading(false);
      toast.error("Could not sign in with Google.");
      return;
    }
    if (result.redirected) return;
    toast.success("Welcome back.");
    navigate({ to: "/" });
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-10">
      <h1 className="font-display text-3xl font-bold text-foreground">Welcome back.</h1>
      <p className="mt-2 text-muted-foreground">Sign in to continue.</p>

      <div className="mt-8 space-y-3">
        <Button variant="outline" className="h-11 w-full" onClick={handleGoogle} disabled={loading}>
          Continue with Google
        </Button>
        <div className="relative my-4 flex items-center">
          <div className="flex-1 border-t border-border" />
          <span className="px-3 text-xs uppercase tracking-wider text-muted-foreground">or</span>
          <div className="flex-1 border-t border-border" />
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-3">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Email</span>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm focus:border-[var(--kola)] focus:outline-none focus:ring-[3px] focus:ring-[var(--kola)]/15"
              placeholder="you@example.com"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Password</span>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"} required value={pwd} onChange={(e) => setPwd(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm focus:border-[var(--kola)] focus:outline-none focus:ring-[3px] focus:ring-[var(--kola)]/15"
              />
              <button type="button" onClick={() => setShowPwd((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPwd ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </label>
          <Button type="submit" disabled={loading} className="h-11 w-full bg-[var(--kola)] text-[var(--kola-foreground)] hover:bg-[var(--kola)]/90">
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="pt-2 text-center text-sm text-muted-foreground">
          New here?{" "}
          <Link to="/onboarding" className="text-[var(--kola)] underline">Join Bantabaa</Link>
        </p>
      </div>
    </div>
  );
}
