"use client";

import { useEffect, useState } from "react";
import type { PublicComment } from "@/lib/feedback";

/**
 * Comments from members, chosen by us and shown with their permission and the name they gave. It says so plainly, shows no
 * star average or count (the chosen few are not a measure of everyone), and renders nothing until there is something to show.
 */
export default function StudentComments({ className = "" }: { className?: string }) {
  const [comments, setComments] = useState<PublicComment[]>([]);

  useEffect(() => {
    let live = true;
    fetch("/api/testimonials")
      .then((r) => (r.ok ? r.json() : { comments: [] }))
      .then((d: { comments?: PublicComment[] }) => {
        if (live && Array.isArray(d.comments)) setComments(d.comments);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);

  if (!comments.length) return null;
  return (
    <section className={`space-y-3 ${className}`} aria-labelledby="student-comments">
      <h2 id="student-comments" className="text-lg font-semibold">
        What students say
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {comments.map((c) => (
          <figure key={c.id} className="card flex flex-col justify-between gap-3 p-4">
            <blockquote className="whitespace-pre-line text-sm">&ldquo;{c.quote}&rdquo;</blockquote>
            <figcaption className="text-xs font-semibold text-muted">{c.name}</figcaption>
          </figure>
        ))}
      </div>
      <p className="text-xs text-muted">Comments chosen by us from feedback members sent, shown with their permission and the name they chose. They are not a measure of every member&apos;s experience.</p>
    </section>
  );
}
