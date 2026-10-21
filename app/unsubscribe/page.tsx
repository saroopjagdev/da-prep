import type { Metadata } from "next";
import { Suspense } from "react";
import UnsubscribeForm from "@/components/UnsubscribeForm";

export const metadata: Metadata = { title: "Stop deadline emails", robots: { index: false, follow: false } };

export default function Unsubscribe() {
  return (
    <div className="mx-auto max-w-xl space-y-4">
      <h1 className="page-title">Stop deadline emails</h1>
      <p className="text-muted">Press the button to stop every email from Level6: deadline emails and the welcome email. Your account and tracker are not affected.</p>
      <Suspense>
        <UnsubscribeForm />
      </Suspense>
    </div>
  );
}
