"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { z } from "zod";
import { track } from "@/lib/funnel";
import { cloudEnabled, supabase } from "@/lib/supabase";

// Zod probes for eval support with new Function(); the site's Content-Security-Policy blocks eval, so the probe
// logs a policy warning in every browser. Jitless mode skips the probe (validation works the same, slightly slower).
z.config({ jitless: true });

type AuthState = {
  enabled: boolean;
  ready: boolean;
  user: User | null;
  /** True when the person arrived from a password-reset email and must now choose a new password. */
  recovery: boolean;
  signInEmail: (email: string) => Promise<string | null>;
  /** Create an account. `confirm` is true when Supabase wants the email address confirmed before signing in. */
  signUpPassword: (email: string, password: string) => Promise<{ error: string | null; confirm: boolean }>;
  signInPassword: (email: string, password: string) => Promise<string | null>;
  resetPassword: (email: string) => Promise<string | null>;
  updatePassword: (password: string) => Promise<string | null>;
  signInGoogle: () => Promise<string | null>;
  /** Sign in with the 8-digit code from the sign-in email. Returns an error message, or null on success. */
  verifyEmailCode: (email: string, code: string) => Promise<string | null>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthState>({
  enabled: false,
  ready: true,
  user: null,
  recovery: false,
  signInEmail: async () => "Accounts are not configured",
  signUpPassword: async () => ({ error: "Accounts are not configured", confirm: false }),
  signInPassword: async () => "Accounts are not configured",
  resetPassword: async () => "Accounts are not configured",
  updatePassword: async () => "Accounts are not configured",
  signInGoogle: async () => "Accounts are not configured",
  verifyEmailCode: async () => "Accounts are not configured",
  signOut: async () => {},
});

export const useAuth = () => useContext(Ctx);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(!cloudEnabled);
  const [recovery, setRecovery] = useState(false);

  useEffect(() => {
    const sb = supabase();
    if (!sb) return;
    // Back from the emailed link: the URL carries a token or a code. Counted once per arrival, no identifier.
    const href = window.location.hash + window.location.search;
    const fromLink = href.includes("access_token=") || href.includes("code=");
    sb.auth.getSession().then(({ data }) => {
      if (fromLink && data.session) track("signed_in", { oncePerLoad: true });
      setUser(data.session?.user ?? null);
      setReady(true);
    });
    const { data } = sb.auth.onAuthStateChange((e, s) => {
      if (e === "PASSWORD_RECOVERY") setRecovery(true);
      setUser(s?.user ?? null);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      enabled: cloudEnabled,
      ready,
      user,
      recovery,
      async signUpPassword(email, password) {
        const { data, error } = await supabase()!.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) return { error: error.message, confirm: false };
        // An address that already has an account comes back without an error and without any identities.
        if (data.user && data.user.identities?.length === 0) {
          return { error: "That email already has an account. Sign in instead, or reset your password.", confirm: false };
        }
        if (data.session) track("signed_in");
        return { error: null, confirm: !data.session };
      },
      async signInPassword(email, password) {
        const { data, error } = await supabase()!.auth.signInWithPassword({ email, password });
        if (!error && data.session) track("signed_in");
        return error?.message ?? null;
      },
      async resetPassword(email) {
        const { error } = await supabase()!.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/login` });
        return error?.message ?? null;
      },
      async updatePassword(password) {
        const { error } = await supabase()!.auth.updateUser({ password });
        if (!error) setRecovery(false);
        return error?.message ?? null;
      },
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
      async verifyEmailCode(email, code) {
        const { data, error } = await supabase()!.auth.verifyOtp({ email, token: code, type: "email" });
        if (!error && data.session) track("signed_in");
        return error?.message ?? null;
      },
      async signOut() {
        await supabase()?.auth.signOut();
      },
    }),
    [ready, user, recovery],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
