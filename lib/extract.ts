// Reads the text out of an uploaded CV, cover letter or statement (PDF or Word .docx).
// Pure server-side helpers: the file is read in memory, never written to disk or stored, and only the text is returned.

import mammoth from "mammoth";
import { extractText, getDocumentProxy } from "unpdf";

export type DocKind = "pdf" | "docx";

/** Vercel functions accept bodies up to about 4.5 MB, so stay under that. */
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
/** A CV or cover letter is a few pages; refuse anything much longer rather than spend time parsing it. */
const MAX_PDF_PAGES = 12;

export class ExtractError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}

/** Decide the file type from its first bytes, never from the file name or the browser's claimed type. */
export function detectKind(b: Uint8Array): DocKind | null {
  if (b.length > 5 && b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46 && b[4] === 0x2d) return "pdf"; // %PDF-
  if (b.length > 4 && b[0] === 0x50 && b[1] === 0x4b && b[2] === 0x03 && b[3] === 0x04) return "docx"; // zip container
  return null;
}

/** Collapse runs of blank space and drop control characters, keeping paragraph breaks. */
export function tidy(text: string): string {
  return text
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
    .replace(/[ \t ]+/g, " ")
    .replace(/ ?\n ?/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function extractDocumentText(bytes: Uint8Array): Promise<{ kind: DocKind; text: string }> {
  const kind = detectKind(bytes);
  if (!kind) throw new ExtractError("Please upload a PDF or a Word (.docx) file.", 415);
  try {
    if (kind === "pdf") {
      const pdf = await getDocumentProxy(new Uint8Array(bytes));
      if (pdf.numPages > MAX_PDF_PAGES) throw new ExtractError(`That PDF has ${pdf.numPages} pages. Please upload just your CV or letter (up to ${MAX_PDF_PAGES} pages).`, 413);
      const { text } = await extractText(pdf, { mergePages: true });
      return { kind, text: tidy(text) };
    }
    const result = await mammoth.extractRawText({ buffer: Buffer.from(bytes) });
    return { kind, text: tidy(result.value) };
  } catch (e) {
    if (e instanceof ExtractError) throw e;
    throw new ExtractError("We couldn't read that file. Try saving it again as a PDF or .docx, or paste the text instead.", 422);
  }
}
