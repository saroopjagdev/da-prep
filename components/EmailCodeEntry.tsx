"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";

/** True once the sign-in email template includes the code (see docs/next-steps.md). Until then this stays hidden. */
export const EMAIL_CODE_ON = process.env.NEXT_PUBLIC_EMAIL_CODE === "true";

/**
 * "Or type the 8-digit code from the email": signs the person in on this page, so a phone user does not have to leave
 * the browser they started in to follow a link in their email app.
 */
export default function EmailCodeEntry({ email, dark = false }: { email: string; dark?: boolean }) {
  const { verifyEmailCode } = useAuth();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  if (!EMAIL_CODE_ON) return null;

  return (
    <form
      className="mt-3 space-y-2"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError("");
        const err = await verifyEmailCode(email, code.trim());
        setBusy(false);
        if (err) setError("That code did not work. Check it, or use the link in the email.");
      }}
    >
      <label className={`block text-sm font-medium ${dark ? "text-white" : ""}`} htmlFor={dark ? "otp-dark" : "otp"}>
        Or type the 8-digit code from the email
      </label>
      <div className="flex max-w-xs gap-2">
        <input
          id={dark ? "otp-dark" : "otp"}
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]{8}"
          maxLength={8}
          required
          className="input w-full text-base tracking-widest"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
        />
        <button className={`btn ${dark ? "btn-light" : "btn-primary"}`} disabled={busy || code.length !== 8}>
          {busy ? "Checking..." : "Sign in"}
        </button>
      </div>
      {error && (
        <p className="text-sm text-coral-600" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
