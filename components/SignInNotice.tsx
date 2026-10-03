"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

/** Shown on pages that use the AI, so a signed-out visitor learns about the sign-in before filling anything in. */
export default function SignInNotice({ what = "this feature" }: { what?: string }) {
  const { enabled, ready, user } = useAuth();
  if (!enabled || !ready || user) return null;
  return (
    <p role="note" className="callout bg-sun-50 text-sm">
      Sign in to use {what}. It is free to start and takes a minute.{" "}
      <Link href="/login" className="font-semibold underline">
        Sign in or create an account
      </Link>
      . Practice tests, the tracker and the guides need no account.
    </p>
  );
}
