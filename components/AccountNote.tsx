"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

/** A short sign-up prompt for list pages whose tools need an account. Hidden once signed in. */
export default function AccountNote({ children }: { children: React.ReactNode }) {
  const { enabled, ready, user } = useAuth();
  if (!enabled || !ready || user) return null;
  return (
    <p role="note" className="callout bg-brand-50 text-sm">
      {children}{" "}
      <Link href="/login" className="font-semibold underline">
        Create a free account
      </Link>
    </p>
  );
}
