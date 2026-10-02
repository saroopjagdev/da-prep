// Client-safe tracker helpers (no firm data imported here, so pages don't bundle every profile).
import type { Application } from "@/lib/types";

export type TrackerTemplate = Omit<Application, "id" | "status" | "notes" | "deadline">;
export type TrackerFirm = { slug: string; name: string; programmes: TrackerTemplate[] };

/** A new tracker item from a template. */
export const fromTemplate = (t: TrackerTemplate, id: string): Application => ({
  ...t,
  checklist: t.checklist?.map((c) => ({ ...c })),
  id,
  deadline: "",
  status: "Interested",
  notes: "",
});
