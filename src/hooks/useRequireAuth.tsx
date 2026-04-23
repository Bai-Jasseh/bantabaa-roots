import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export function useRequireAuth() {
  const { user } = useAuth();
  const navigate = useNavigate();
  return (action: () => void | Promise<void>, message = "Sign in to continue.") => {
    if (!user) {
      toast.error(message);
      navigate({ to: "/login" });
      return;
    }
    void action();
  };
}
