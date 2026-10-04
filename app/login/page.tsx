"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import DataTools from "@/components/DataTools";
import { postJson } from "@/lib/api";
import { clearLocalData } from "@/lib/store";

// Hidden until the Google provider is switched on in Supabase (Authentication > Providers). Then set this to "true".
const GOOGLE_SIGN_IN = process.env.NEXT_PUBLIC_GOOGLE_SIGNIN === "true";

export default function Login() {
  const { enabled, ready, user, signInEmail, signInGoogle, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  if (enabled && !ready) return <p className="text-muted">Loading...</p>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="page-title">{user ? "Your account" : enabled ? "Sign in" : "Your data"}</h1>

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

      {enabled && !user && (
        <section className="card max-w-sm space-y-4 p-6">
          <p className="text-sm text-muted">
            An account is needed for the AI features (mock interviews, written feedback and the CV checker) and lets you sync your progress across devices. Practice tests, the tracker and the guides work without one.
          </p>
          <form
            className="space-y-2"
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
              aria-label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="btn btn-primary w-full">Email me a link</button>
          </form>
          {GOOGLE_SIGN_IN && (
            <button
              onClick={async () => setError((await signInGoogle()) ?? "")}
              className="btn btn-secondary w-full"
            >
              Continue with Google
            </button>
          )}
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
