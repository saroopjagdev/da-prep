"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { track } from "@/lib/funnel";

export const MIN_PASSWORD = 8;

type Mode = "signup" | "signin" | "reset";

/**
 * Email and password: create an account, sign in, or ask for a reset email. Signing in stays signed in on the device,
 * so there is no code or link to fetch each visit. `idPrefix` keeps field ids unique when two forms share a page.
 */
export default function PasswordAuthForm({
  initialMode = "signup",
  dark = false,
  idPrefix = "auth",
}: {
  initialMode?: Mode;
  dark?: boolean;
  idPrefix?: string;
}) {
  const { signUpPassword, signInPassword, resetPassword } = useAuth();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const muted = dark ? "text-white/75" : "text-muted";
  const linkBtn = `underline underline-offset-2 ${dark ? "text-white" : "text-brand-700"}`;

  function switchTo(next: Mode) {
    setMode(next);
    setError("");
    setNote("");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setNote("");
    setBusy(true);
    const addr = email.trim();
    if (mode === "signup") {
      track("hero_signup_submit");
      const r = await signUpPassword(addr, password);
      if (r.error) setError(r.error);
      else if (r.confirm) setNote(`We sent a message to ${addr}. Open it once to confirm your address, then sign in with your password.`);
    } else if (mode === "signin") {
      const err = await signInPassword(addr, password);
      if (err) setError(err === "Invalid login credentials" ? "That email and password do not match." : err);
    } else {
      const err = await resetPassword(addr);
      if (err) setError(err);
      else setNote(`If ${addr} has an account, a reset link is on its way. It may land in spam.`);
    }
    setBusy(false);
  }

  const label = `block text-sm font-medium ${dark ? "text-white" : ""}`;
  const action = mode === "signup" ? "Create free account" : mode === "signin" ? "Sign in" : "Email me a reset link";

  return (
    <div className="space-y-2">
      <form className="space-y-2" onSubmit={submit}>
        <div>
          <label className={label} htmlFor={`${idPrefix}-email`}>
            Email address
          </label>
          <input
            id={`${idPrefix}-email`}
            type="email"
            required
            autoComplete="email"
            className="input w-full text-base"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {mode !== "reset" && (
          <div>
            <label className={label} htmlFor={`${idPrefix}-password`}>
              Password
            </label>
            <input
              id={`${idPrefix}-password`}
              type="password"
              required
              minLength={MIN_PASSWORD}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              className="input w-full text-base"
              placeholder={mode === "signup" ? `At least ${MIN_PASSWORD} characters` : "Your password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        )}
        <button className={`btn w-full !py-3 ${dark ? "btn-light" : "btn-primary"}`} disabled={busy}>
          {busy ? "Please wait..." : action}
        </button>
      </form>
      {note && (
        <p className={`text-sm ${dark ? "text-white" : "text-mint-600"}`} role="status">
          {note}
        </p>
      )}
      {error && (
        <p className={`text-sm ${dark ? "text-white" : "text-coral-600"}`} role="alert">
          {error}
        </p>
      )}
      <p className={`text-sm ${muted}`}>
        {mode === "signup" && (
          <>
            Already have an account?{" "}
            <button type="button" className={linkBtn} onClick={() => switchTo("signin")}>
              Sign in
            </button>
          </>
        )}
        {mode === "signin" && (
          <>
            New here?{" "}
            <button type="button" className={linkBtn} onClick={() => switchTo("signup")}>
              Create an account
            </button>
            {" · "}
            <button type="button" className={linkBtn} onClick={() => switchTo("reset")}>
              Forgot password?
            </button>
          </>
        )}
        {mode === "reset" && (
          <button type="button" className={linkBtn} onClick={() => switchTo("signin")}>
            Back to sign in
          </button>
        )}
      </p>
    </div>
  );
}
