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
