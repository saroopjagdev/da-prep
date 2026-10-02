import OpenAI from "openai";
import { mockEnabled } from "@/lib/ai";
import { redact } from "@/lib/redact";

export const SUPPORT_MESSAGE =
  "It sounds like you might be going through something difficult, and that matters more than any application. " +
  "You can talk to someone now, for free: Childline on 0800 1111 (under 19s), Samaritans on 116 123 (24/7), " +
  "or text SHOUT to 85258. If you are in immediate danger, call 999. Your text was not sent for feedback.";

const BLOCKED_MESSAGE = "We can't give feedback on that text. Please remove anything harmful or inappropriate and try again.";

let client: OpenAI | null = null;

/**
 * Run user-written text through OpenAI's free moderation endpoint before it reaches the coaching prompts.
 * Returns a Response to send back when the text should be stopped, otherwise null.
 * Fails open: if moderation itself is unavailable the request goes ahead (inputs are still length-limited and
 * the outputs are schema-checked).
 */
export async function screenText(...texts: (string | undefined)[]): Promise<Response | null> {
  if (!process.env.OPENAI_API_KEY || mockEnabled()) return null;
  const input = redact(texts.filter(Boolean).join("\n\n")).slice(0, 20_000);
  if (!input.trim()) return null;
  try {
    const res = await (client ??= new OpenAI()).moderations.create({ model: "omni-moderation-latest", input });
    const r = res.results[0];
    if (!r?.flagged) return null;
    const c = r.categories as unknown as Record<string, boolean>;
    if (c["self-harm"] || c["self-harm/intent"] || c["self-harm/instructions"]) {
      return Response.json({ error: SUPPORT_MESSAGE, safeguarding: true }, { status: 422 });
    }
    return Response.json({ error: BLOCKED_MESSAGE }, { status: 422 });
  } catch (e) {
    console.error("moderation failed", e);
    return null;
  }
}
