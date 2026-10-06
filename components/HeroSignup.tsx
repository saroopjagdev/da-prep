"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import PasswordAuthForm from "@/components/PasswordAuthForm";

/**
 * Signup for the landing page: email and a password, so coming back later is a normal sign-in with no code or link.
 * Without accounts configured (local development) it falls back to a plain link.
 */
export default function HeroSignup({ dark = false }: { dark?: boolean }) {
  const { enabled } = useAuth();
  const muted = dark ? "text-white/75" : "text-muted";

  if (!enabled) {
    return (
      <Link href="/practice" className="btn btn-primary !px-7 !py-3 w-fit">
        Start practising
      </Link>
    );
  }

  return (
    <div className="max-w-sm space-y-2">
      <PasswordAuthForm initialMode="signup" dark={dark} idPrefix={dark ? "hero-dark" : "hero"} />
      <p className={`text-xs ${muted}`}>
        Free, no card. By continuing you confirm you are 16 or over and agree to our{" "}
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
