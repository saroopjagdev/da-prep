"use client";

import Link from "next/link";
import { useUsage } from "@/components/useUsage";

/**
 * The engagement reward for a free account: three steps, and what finishing them unlocks (see BONUS_EXTRA in
 * lib/plans.ts). Shows nothing for Pro, signed-out visitors, or when limits are not enforced.
 */
export default function UnlockProgress({ className = "" }: { className?: string }) {
  const usage = useUsage();
  const b = usage?.bonus;
  if (!usage || usage.plan !== "free" || !usage.enforced || !b) return null;
  if (b.unlocked) {
    return (
      <p role="note" className={`text-sm text-mint-600 ${className}`}>
        Bonus unlocked: {b.extra} more practice tests, mock interviews and reviews.
      </p>
    );
  }
  const steps = [
    { done: b.steps.applied, label: "Apply to an employer from the tracker", href: "/opportunities" },
    { done: b.steps.interview, label: "Take a mock interview", href: "/interview" },
    { done: b.steps.practice, label: "Start a practice test", href: "/practice" },
  ];
  return (
    <div role="note" className={`space-y-1 text-sm ${className}`}>
      <p className="font-medium">Do all three to unlock {b.extra} more practice tests, mock interviews and reviews:</p>
      <ul className="space-y-0.5">
        {steps.map((s) => (
          <li key={s.label} className={s.done ? "text-mint-600" : ""}>
            <span aria-hidden="true">{s.done ? "✓ " : "○ "}</span>
            {s.done ? (
              <>
                {s.label} <span className="sr-only">(done)</span>
              </>
            ) : (
              <Link href={s.href} className="underline">
                {s.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
