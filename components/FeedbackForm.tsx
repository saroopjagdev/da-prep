"use client";

import { useEffect, useState } from "react";
import { postJson } from "@/lib/api";
import { MAX_MESSAGE, MAX_NAME } from "@/lib/feedback";
import { ratingFromParam } from "@/lib/feedback-ask";

/**
 * Everyone sees this same form and can send anything. The rating is optional and never changes what happens next. The
 * permission to show a comment on the site is a separate, unticked box, and the name is the one the person types.
 */
export default function FeedbackForm() {
  const [rating, setRating] = useState<number | undefined>();
  const [message, setMessage] = useState("");
  const [mayQuote, setMayQuote] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  // The banner and the email carry a one-tap rating (?r=5); it only fills in the optional rating box.
  useEffect(() => {
    const r = ratingFromParam(new URLSearchParams(window.location.search).get("r"));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the address is only readable in the browser
    if (r) setRating(r);
  }, []);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await postJson("/api/feedback", { rating, message, mayQuote, displayName: mayQuote ? displayName : undefined });
      setSent(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <p role="status" className="callout bg-mint-50 text-mint-600">
        Thank you. We read every message{mayQuote ? ", and we will only show yours if we choose it, with the name you gave" : ""}.
      </p>
    );
  }

  return (
    <form onSubmit={send} className="card space-y-4 p-5">
      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold">How would you rate Level6 so far? (optional)</legend>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Rating out of 5">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className={`flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm ${rating === n ? "border-brand-600 bg-brand-50 font-semibold" : "border-line"}`}>
              <input type="radio" name="rating" className="sr-only" checked={rating === n} onChange={() => setRating(n)} />
              {n} {n === 1 ? "star" : "stars"}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="space-y-1">
        <label htmlFor="fb-message" className="text-sm font-semibold">
          What is working, and what is not?
        </label>
        <textarea
          id="fb-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={MAX_MESSAGE}
          rows={5}
          required
          className="w-full rounded-lg border border-line p-3 text-sm"
          placeholder="Anything helps: what you used, what was useful, what confused you or put you off."
        />
        <p className="text-xs text-muted">Please do not include your full name, school, email or phone number.</p>
      </div>

      <div className="space-y-2 rounded-lg bg-soft p-3 text-sm">
        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1 accent-brand-600" checked={mayQuote} onChange={(e) => setMayQuote(e.target.checked)} />
          <span>
            You may show my comment on the Level6 website, with the name I give below. I understand you choose which comments to show, and I can ask for mine to be taken down at any time.
          </span>
        </label>
        {mayQuote && (
          <div className="space-y-1 pl-6">
            <label htmlFor="fb-name" className="font-medium">
              Name to show
            </label>
            <input
              id="fb-name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={MAX_NAME}
              required
              className="w-full rounded-lg border border-line p-2"
              placeholder="For example: Aisha, Year 13"
            />
            <p className="text-xs text-muted">A first name or a nickname is enough. No surname or school.</p>
          </div>
        )}
      </div>

      {error && (
        <p role="alert" className="callout bg-coral-50 text-coral-600">
          {error}
        </p>
      )}
      <button type="submit" disabled={busy || !message.trim()} className="btn btn-primary">
        {busy ? "Sending…" : "Send feedback"}
      </button>
    </form>
  );
}
