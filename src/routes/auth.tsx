import { useForm } from "react-hook-form";
import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Lock, Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useIsAdmin } from "@/hooks/use-tff-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TffLogo } from "@/components/tff/branding";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Organizer Login | TFF eFootball" },
      { name: "description", content: "Sign in to manage TFF tournaments, teams, and matches." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { session, isAdmin } = useIsAdmin();

  const { register, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Redirect if already authenticated
  if (session && isAdmin) {
    navigate({ to: "/admin", replace: true });
    return null;
  }

  async function onSubmit(values: any) {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Successfully logged in!");
        navigate({ to: "/admin", replace: true });
      }
    } catch (e: any) {
      toast.error(e.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 panel p-8">
        <div className="flex flex-col items-center">
          <TffLogo showText={true} className="mb-2" />
          <h2 className="mt-4 text-center text-3xl font-bold tracking-tight text-foreground">
            Organizer Portal
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Sign in to manage your eFootball tournaments
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                <Mail className="size-5" />
              </span>
              <Input
                {...register("email", { required: true })}
                type="email"
                autoComplete="email"
                required
                placeholder="Email address"
                className="pl-10"
              />
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                <Lock className="size-5" />
              </span>
              <Input
                {...register("password", { required: true })}
                type="password"
                autoComplete="current-password"
                required
                placeholder="Password"
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
