// Remove common personal details from text before it is sent to the AI provider. Students are asked not to include
// them, but CVs and pasted text often do. Conservative patterns: UK formats only, so job details and figures survive.

const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
// UK phone numbers starting 0 or +44: 10 digits after the trunk 0 (or after +44), with optional spaces, dashes or
// brackets. The digit count is checked in the callback so prices, years and figures are left alone.
const PHONE = /(?<![\w£$€.,])(?:\+44[\s-]?\(?0?\)?[\s-]?|\(?0)\d(?:[\s-]?\)?[\s-]?\d){8,9}(?![\w])/g;
const POSTCODE = /\b(?:GIR\s?0AA|[A-PR-UWYZ][A-HK-Y]?\d[A-Z\d]?\s?\d[ABD-HJLNP-UW-Z]{2})\b/gi;
const NI_NUMBER = /\b[A-CEGHJ-PR-TW-Z]{2}\s?\d{2}\s?\d{2}\s?\d{2}\s?[A-D]\b/gi;

export function redact(text: string): string {
  return text
    .replace(EMAIL, "[email removed]")
    .replace(NI_NUMBER, "[NI number removed]")
    .replace(PHONE, (m) => {
      const digits = m.replace(/\D/g, "");
      const ok = (digits.startsWith("44") && digits.length >= 12 && digits.length <= 13) || (digits.startsWith("0") && digits.length === 11);
      return ok ? "[phone removed]" : m;
    })
    .replace(POSTCODE, "[postcode removed]");
}

// --- CV checker: stricter removal with a count, so the page can say what was taken out. ---------------------------
// `redact` above stays as the lightweight pass applied to every prompt. A CV is mostly personal data, so the CV checker
// also removes links and dates of birth, and reports how many details it removed.

const LINK = /\b(?:https?:\/\/|www\.)[^\s<>"')]+|\b(?:linkedin|facebook|instagram|tiktok|twitter|x)\.com\/[^\s<>"')]+/gi;
const DOB = /\b(?:date of birth|d\.?o\.?b\.?|born(?: on)?)\s*[:\-]?\s*[^\n,;]{0,30}/gi;

export type CvRedaction = { text: string; removed: number };

export function redactForCv(input: string): CvRedaction {
  let removed = 0;
  const count = (label: string) => () => {
    removed++;
    return label;
  };
  let text = input
    .replace(EMAIL, count("[email removed]"))
    .replace(LINK, count("[link removed]"))
    .replace(DOB, count("[date of birth removed]"))
    .replace(NI_NUMBER, count("[NI number removed]"))
    .replace(PHONE, (m) => {
      const digits = m.replace(/\D/g, "");
      const ok = (digits.startsWith("44") && digits.length >= 12 && digits.length <= 13) || (digits.startsWith("0") && digits.length === 11);
      if (!ok) return m;
      removed++;
      return "[phone removed]";
    })
    .replace(POSTCODE, count("[postcode removed]"));
  text = text.trim();
  return { text, removed };
}
