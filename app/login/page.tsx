"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import DataTools from "@/components/DataTools";
import { postJson } from "@/lib/api";
import { clearLocalData } from "@/lib/store";

export default function Login() {
  const { enabled, ready, user, signInEmail, signInGoogle, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [over16, setOver16] = useState(false);

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
            Save your progress and sync across devices. Optional: the site works without it.
          </p>
          <form
            className="space-y-2"
            onSubmit={async (e) => {
              e.preventDefault();
              setError("");
              if (!over16) return setError("Please confirm you're 16 or over.");
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
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" className="mt-1 accent-brand-600" checked={over16} onChange={(e) => setOver16(e.target.checked)} required />
              <span>I&apos;m 16 or over</span>
            </label>
            <button className="btn btn-primary w-full">Email me a link</button>
          </form>
          <button
            onClick={async () => (over16 ? setError((await signInGoogle()) ?? "") : setError("Please confirm you're 16 or over."))}
            className="btn btn-secondary w-full"
          >
            Continue with Google
          </button>
          {msg && <p className="text-sm text-mint-600">{msg}</p>}
          {error && <p className="text-sm text-coral-600">{error}</p>}
          <p className="text-xs text-muted">
            By signing in you agree to our{" "}
            <Link className="underline" href="/terms">
              terms
            </Link>{" "}
            and{" "}
            <Link className="underline" href="/privacy">
              privacy notice
            </Link>
            . Accounts are for people aged 16 and over. If you&apos;re younger, you can still use everything without an
            account: your work is saved on this device.
          </p>
        </section>
      )}

      <DataTools />
    </div>
  );
}
