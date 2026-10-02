// Light types and labels for the employer picker. Kept apart from the profiles so client code can import them
// without bundling every firm profile.
export type FirmGroup = "finance" | "professional" | "other";
export type FirmOption = { slug: string; name: string; group: FirmGroup; programmes: string[] };

export const FIRM_GROUPS: [FirmGroup, string][] = [
  ["finance", "Banking and finance"],
  ["professional", "Accountancy and professional services"],
  ["other", "Other employers"],
];
