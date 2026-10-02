import OpenAI from "openai";
import { z } from "zod";
import { redact } from "@/lib/redact";

/**
 * Two model tiers, both overridable by env:
 * - "fast": short, high-volume generation (interview questions, STAR drafts)
 * - "smart": marking and feedback, where quality matters more than speed
 * Defaults are OpenAI's September 2026 lineup; set OPENAI_MODEL / OPENAI_MODEL_FAST to change them.
 */
export type Tier = "fast" | "smart";

export const modelFor = (tier: Tier) =>
  tier === "fast" ? process.env.OPENAI_MODEL_FAST || "gpt-6-luna" : process.env.OPENAI_MODEL || "gpt-6.1-sol";

let client: OpenAI | null = null;
function getClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set");
  }
  return (client ??= new OpenAI());
}

/** Dev/testing only: serve canned responses so the UI can be exercised without an API key. */
export const mockEnabled = () => process.env.MOCK_AI === "1" && process.env.NODE_ENV !== "production";

export const transcribeModel = () => process.env.OPENAI_TRANSCRIBE_MODEL || "gpt-transcribe";

/** Turn a recorded answer (webm, mp4, ogg, wav...) into text. Returns an empty string if no speech was detected. */
export async function transcribeAudio(file: File): Promise<string> {
  if (mockEnabled()) {
    return "In Year 11 I led a four person robotics team. We were behind on the build, so I split the jobs by strength and we finished two days early.";
  }
  const res = await getClient().audio.transcriptions.create({
    file,
    model: transcribeModel(),
    languages: ["en"],
  });
  return (res.text ?? "").trim();
}

type AskOptions<T extends z.ZodTypeAny> = {
  system: string;
  user: string;
  schema: T;
  tier?: Tier;
  /**
   * Upper bound on output tokens. Reasoning models count their hidden reasoning against this budget,
   * so keep it generous: a too-small cap can end the response before any JSON is written.
   */
  maxTokens?: number;
  /** Canned response used when MOCK_AI=1 (ignored in production). */
  mock?: () => unknown;
};

function extractJson(text: string): unknown {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end < start) throw new Error("Model returned no JSON");
  return JSON.parse(text.slice(start, end + 1));
}

/**
 * Ask the model for a JSON object and validate it against a zod schema.
 * Retries once if the reply isn't valid JSON or doesn't match the schema. API errors are not retried.
 */
export async function askJson<T extends z.ZodTypeAny>({
  system,
  user,
  schema,
  tier = "smart",
  maxTokens = 4000,
  mock,
}: AskOptions<T>): Promise<z.infer<T>> {
  if (mock && mockEnabled()) return schema.parse(mock());

  const openai = getClient();
  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await openai.responses.create({
      model: modelFor(tier),
      // JSON mode requires the word "JSON" in the input messages themselves (the `instructions` field doesn't count).
      input: [
        { role: "system", content: `${system}\n\nRespond with a single JSON object only. No prose, no code fences.` },
        { role: "user", content: redact(user) }, // strip emails, phone numbers and postcodes first
      ],
      max_output_tokens: maxTokens,
      text: { format: { type: "json_object" } },
      store: false, // don't retain users' applications or answers on the provider side
    });

    if (res.status === "incomplete") {
      throw new Error(`Model output was cut off (${res.incomplete_details?.reason ?? "unknown reason"}).`);
    }
    try {
      return schema.parse(extractJson(res.output_text));
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Model returned an invalid response");
}
