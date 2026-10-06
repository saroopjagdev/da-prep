"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import EmailCodeEntry from "@/components/EmailCodeEntry";
import PasswordAuthForm, { MIN_PASSWORD } from "@/components/PasswordAuthForm";
import DataTools from "@/components/DataTools";
import { postJson } from "@/lib/api";
import { clearLocalData } from "@/lib/store";

// Hidden until the Google provider is switched on in Supabase (Authentication > Providers). Then set this to "true".
const GOOGLE_SIGN_IN = process.env.NEXT_PUBLIC_GOOGLE_SIGNIN === "true";

/** Shown after following a password-reset email: the person is signed in and picks a new password. */
function NewPassword() {
  const { updatePassword } = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <section className="card max-w-sm space-y-3 p-5">
      <h2 className="text-lg font-bold">Choose a new password</h2>
      <form
        className="space-y-2"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError((await updatePassword(password)) ?? "");
          setBusy(false);
        }}
      >
        <input
          type="password"
          required
          minLength={MIN_PASSWORD}
          autoComplete="new-password"
          className="input w-full"
          placeholder={`At least ${MIN_PASSWORD} characters`}
          aria-label="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn btn-primary w-full" disabled={busy}>
          Save password
        </button>
      </form>
      {error && <p className="text-sm text-coral-600">{error}</p>}
    </section>
  );
}

export default function Login() {
  const { enabled, ready, user, recovery, signInEmail, signInGoogle, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  if (enabled && !ready) return <p className="text-muted">Loading...</p>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="page-title">{user ? "Your account" : enabled ? "Sign in or create an account" : "Your data"}</h1>

      {!enabled && (
        <p className="text-muted">
          Accounts aren&apos;t set up on this deployment. Everything still works and is saved in this browser.
        </p>
      )}

      {enabled && user && (
        <section className="card space-y-4 p-5">
          <p>
            Signed in as <strong>{user.email}</strong>. Your tracker, stories and progress sync across devices.{" "}
            <Link href="/pricing" className="underline">
              Plan details
            </Link>
          </p>
          <div className="flex flex-wrap gap-3">
            <button onClick={signOut} className="btn btn-secondary">
              Sign out
            </button>
            <button
              onClick={async () => {
                if (!confirm("Permanently delete your account and all saved data? This can't be undone.")) return;
                try {
                  await postJson("/api/account", undefined, "DELETE");
                  clearLocalData();
                  await signOut();
                } catch (e) {
                  setError((e as Error).message);
                }
              }}
              className="btn btn-danger"
            >
              Delete my account and data
            </button>
          </div>
          {error && <p className="text-sm text-coral-600">{error}</p>}
        </section>
      )}

      {enabled && user && recovery && <NewPassword />}

      {enabled && !user && (
        <section className="card max-w-sm space-y-4 p-6">
          <p className="text-sm text-muted">
            An account is needed for practice tests, mock processes and the AI features (mock interviews, written feedback and the CV checker), and it syncs your progress across devices. It is free, and you stay signed in on this device.
          </p>
          <PasswordAuthForm initialMode="signin" />
          {GOOGLE_SIGN_IN && (
            <button
              onClick={async () => setError((await signInGoogle()) ?? "")}
              className="btn btn-secondary w-full"
            >
              Continue with Google
            </button>
          )}
          <details className="text-sm">
            <summary className="cursor-pointer text-muted">Prefer a sign-in link by email?</summary>
            <form
              className="mt-2 space-y-2"
              onSubmit={async (e) => {
                e.preventDefault();
                setError("");
                const err = await signInEmail(email);
                if (err) setError(err);
                else setMsg("Check your email for a sign-in link.");
              }}
            >
              <input
                type="email"
                required
                className="input"
                placeholder="you@example.com"
                aria-label="Email for a sign-in link"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="btn btn-secondary w-full">Email me a link</button>
            </form>
            {msg && <EmailCodeEntry email={email} />}
          </details>
          {msg && <p className="text-sm text-mint-600">{msg}</p>}
          {error && <p className="text-sm text-coral-600">{error}</p>}
          <p className="text-xs text-muted">
            By signing in you confirm you are 16 or over and agree to our{" "}
            <Link className="underline" href="/terms">
              terms
            </Link>{" "}
            and{" "}
            <Link className="underline" href="/privacy">
              privacy notice
            </Link>
            . Accounts and the AI features are for people aged 16 and over.
          </p>
        </section>
      )}

      <DataTools />
    </div>
  );
}
