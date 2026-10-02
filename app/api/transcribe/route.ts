import { mockEnabled, transcribeAudio, transcribeModel } from "@/lib/ai";
import { guardAi } from "@/lib/server/guard";
import { requirePass } from "@/lib/server/pass";

/** Lets the setup screen warn up front if voice transcription isn't available on this server. */
export function GET() {
  return Response.json({ configured: Boolean(process.env.OPENAI_API_KEY) || mockEnabled(), model: transcribeModel() });
}

// A 60-second answer is well under 1 MB; this leaves room for slower codecs without inviting abuse.
export const maxDuration = 60;

const MAX_BYTES = 8 * 1024 * 1024;

export async function POST(req: Request) {
  const gate = await guardAi(req, "transcribe", 15, 150);
  if (!gate.ok) return gate.response;
  // Transcription only happens inside an interview or mock process, so it needs that session's pass.
  if (gate.userId) {
    const denied = await requirePass(req, gate.userId, ["interview", "mock"]);
    if (denied) return denied;
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("audio");
  if (!(file instanceof File)) {
    return Response.json({ error: "No audio received." }, { status: 400 });
  }
  if (file.size === 0) {
    return Response.json({ error: "The recording was empty." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return Response.json({ error: "That recording is too long." }, { status: 413 });
  }
  // MediaRecorder labels audio-only recordings audio/*, but some browsers report video/webm or video/mp4.
  if (!/^(audio|video)\//.test(file.type)) {
    return Response.json({ error: "Unsupported file type." }, { status: 415 });
  }

  try {
    const text = (await transcribeAudio(file)).slice(0, 4000);
    return Response.json({ text });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Could not transcribe your answer." }, { status: 500 });
  }
}
