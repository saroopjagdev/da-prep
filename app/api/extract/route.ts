import { ExtractError, MAX_UPLOAD_BYTES, extractDocumentText } from "@/lib/extract";
import { guardAi } from "@/lib/server/guard";

export const maxDuration = 30;

/** Longest text the writing tools accept; longer documents are cut and the page says so. */
const MAX_CHARS = 8000;

/**
 * Turns an uploaded PDF or Word file into plain text for the CV checker and written feedback. The file is read in
 * memory and discarded: nothing is stored and nothing is sent to the AI here (the text goes back to the page, where
 * the person can read and edit it before choosing to submit it).
 */
export async function POST(req: Request) {
  // Same sign-in and rate limits as the AI tools, so the parser cannot be used anonymously or in a loop.
  const gate = await guardAi(req, "extract", 10, 60);
  if (!gate.ok) return gate.response;

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return Response.json({ error: "No file received." }, { status: 400 });
  if (file.size === 0) return Response.json({ error: "That file is empty." }, { status: 400 });
  if (file.size > MAX_UPLOAD_BYTES) return Response.json({ error: "That file is too large. The limit is 4 MB." }, { status: 413 });

  try {
    const { kind, text } = await extractDocumentText(new Uint8Array(await file.arrayBuffer()));
    if (text.length < 30) {
      return Response.json(
        { error: "We couldn't find any text in that file. If it's a scan or a photo, paste the text instead." },
        { status: 422 },
      );
    }
    const truncated = text.length > MAX_CHARS;
    return Response.json({ kind, text: truncated ? text.slice(0, MAX_CHARS) : text, truncated });
  } catch (e) {
    if (e instanceof ExtractError) return Response.json({ error: e.message }, { status: e.status });
    console.error(e);
    return Response.json({ error: "Could not read that file." }, { status: 500 });
  }
}
