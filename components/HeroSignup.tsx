"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import EmailCodeEntry from "@/components/EmailCodeEntry";
import { track } from "@/lib/funnel";

/**
 * One-field signup for the landing page: the lowest-friction form we can offer, because sign-in is passwordless.
 * It sends the same sign-in link as /login. Without accounts configured (local development) it falls back to a plain link.
 */
export default function HeroSignup({ dark = false }: { dark?: boolean }) {
  const { enabled, signInEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  const muted = dark ? "text-white/75" : "text-muted";

  if (!enabled) {
    return (
      <Link href="/practice" className="btn btn-primary !px-7 !py-3 w-fit">
        Start practising
      </Link>
    );
  }

  if (state === "sent") {
    return (
      <div className={`space-y-1 ${dark ? "text-white" : ""}`} role="status">
        <p className="text-lg font-bold">Check your email</p>
        <p className={`text-sm ${muted}`}>
          We sent a sign-in link to <strong>{email}</strong>. It can take a minute, and it may land in spam. No password to remember.
        </p>
        <EmailCodeEntry email={email} dark={dark} />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <form
        className="flex max-w-lg flex-col gap-2 sm:flex-row"
        onSubmit={async (e) => {
          e.preventDefault();
          setError("");
          setState("sending");
          track("hero_signup_submit");
          const err = await signInEmail(email.trim());
          if (err) {
            setError(err);
            setState("idle");
          } else {
            track("link_sent");
            setState("sent");
          }
        }}
      >
        <label className="sr-only" htmlFor={dark ? "hero-email-dark" : "hero-email"}>
          Email address
        </label>
        <input
          id={dark ? "hero-email-dark" : "hero-email"}
          type="email"
          required
          autoComplete="email"
          className="input w-full text-base"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className={`btn whitespace-nowrap !px-6 !py-3 ${dark ? "btn-light" : "btn-primary"}`} disabled={state === "sending"}>
          {state === "sending" ? "Sending..." : "Get started free"}
        </button>
      </form>
      {error && (
        <p className="text-sm text-coral-600" role="alert">
          {error}
        </p>
      )}
      <p className={`text-xs ${muted}`}>
        Free, no card, no password: we email you a sign-in link. By continuing you confirm you are 16 or over and agree to our{" "}
        <Link href="/terms" className="underline">
          terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline">
          privacy notice
        </Link>
        .
      </p>
    </div>
  );
}
