"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { z } from "zod";
import { cloudEnabled, supabase } from "@/lib/supabase";

// Zod probes for eval support with new Function(); the site's Content-Security-Policy blocks eval, so the probe
// logs a policy warning in every browser. Jitless mode skips the probe (validation works the same, slightly slower).
z.config({ jitless: true });

type AuthState = {
  enabled: boolean;
  ready: boolean;
  user: User | null;
  signInEmail: (email: string) => Promise<string | null>;
  signInGoogle: () => Promise<string | null>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthState>({
  enabled: false,
  ready: true,
  user: null,
  signInEmail: async () => "Accounts are not configured",
  signInGoogle: async () => "Accounts are not configured",
  signOut: async () => {},
});

export const useAuth = () => useContext(Ctx);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(!cloudEnabled);

  useEffect(() => {
    const sb = supabase();
    if (!sb) return;
    sb.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setReady(true);
    });
    const { data } = sb.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => data.subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      enabled: cloudEnabled,
      ready,
      user,
      async signInEmail(email) {
        const { error } = await supabase()!.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: window.location.origin },
        });
        return error?.message ?? null;
      },
      async signInGoogle() {
        const { error } = await supabase()!.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo: window.location.origin },
        });
        return error?.message ?? null;
      },
      async signOut() {
        await supabase()?.auth.signOut();
      },
    }),
    [ready, user],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
