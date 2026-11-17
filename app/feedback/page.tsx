"use client";

import FeedbackForm from "@/components/FeedbackForm";
import RequireAccount from "@/components/RequireAccount";

export default function FeedbackPage() {
  return (
    <RequireAccount what="send feedback">
      <div className="mx-auto max-w-xl space-y-4">
        <h1 className="page-title">Tell us how Level6 is going</h1>
        <p className="lead">Good or bad, we want to hear it. We read every message and use it to decide what to fix next.</p>
        <FeedbackForm />
      </div>
    </RequireAccount>
  );
}
