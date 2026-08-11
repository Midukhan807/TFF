import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";

export function useSession() {
  const [session, setSession] = useState<{ userId: string; email: string | null } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next?.user ? { userId: next.user.id, email: next.user.email ?? null } : null);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(
        data.session?.user
          ? { userId: data.session.user.id, email: data.session.user.email ?? null }
          : null,
      );
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return { session, loading };
}

export function useIsAdmin() {
  const { session, loading } = useSession();
  const query = useQuery({
    queryKey: ["is-admin", session?.userId],
    enabled: !!session,
    queryFn: async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session!.userId);
      return (data ?? []).length > 0;
    },
  });
  return { isAdmin: !!query.data, session, loading: loading || query.isLoading };
}
