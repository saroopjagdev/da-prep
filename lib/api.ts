import { diag } from "@/lib/diag";
import { supabase } from "@/lib/supabase";

const TIMEOUT_MS = 90_000;

// Practice passes (see lib/server/pass.ts): issued when a free allowance is charged and sent with that practice
// session's follow-up AI calls. Kept in localStorage so a mock process can be resumed in another tab.
const PASS_KINDS = { interview: "x-pass-interview", mock: "x-pass-mock" } as const;
type PassKind = keyof typeof PASS_KINDS;
const passKey = (k: PassKind) => `da-prep:pass:${k}`;

function savePass(data: unknown) {
  const d = data as { pass?: unknown; kind?: unknown; expires?: unknown };
  if (typeof d?.pass !== "string" || typeof d.expires !== "number" || !(typeof d.kind === "string" && d.kind in PASS_KINDS)) return;
  try {
    localStorage.setItem(passKey(d.kind as PassKind), JSON.stringify({ pass: d.pass, expires: d.expires }));
  } catch {
    /* storage unavailable: the next charged action issues a new pass */
  }
}

function passHeaders(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [kind, header] of Object.entries(PASS_KINDS) as [PassKind, string][]) {
    try {
      const raw = localStorage.getItem(passKey(kind));
      const p = raw ? (JSON.parse(raw) as { pass: string; expires: number }) : null;
      if (p && p.expires > Date.now()) out[header] = p.pass;
    } catch {
      /* ignore */
    }
  }
  return out;
}

async function authHeaders(): Promise<Record<string, string>> {
  const token = (await supabase()?.auth.getSession())?.data.session?.access_token;
  return { ...passHeaders(), ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

/** fetch with a deadline, so a hung request ends in a clear error instead of an endless spinner. */
async function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } catch (e) {
    if ((e as Error)?.name === "AbortError") throw new Error("That took too long. Please try again.");
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

/** POST JSON to our API, attaching the Supabase access token when signed in. */
export async function postJson<T>(url: string, body?: unknown, method = "POST"): Promise<T> {
  const res = await fetchWithTimeout(url, {
    method,
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Something went wrong");
  savePass(data);
  return data as T;
}

const extensionFor = (mime: string) =>
  mime.includes("mp4") ? "mp4" : mime.includes("ogg") ? "ogg" : mime.includes("wav") ? "wav" : "webm";

/** Upload a recorded answer and get the transcript back. */
export async function transcribeBlob(blob: Blob): Promise<string> {
  const started = Date.now();
  diag("transcribe-request", { bytes: blob.size, type: blob.type });
  const body = new FormData();
  body.append("audio", blob, `answer.${extensionFor(blob.type)}`);
  let res: Response;
  try {
    res = await fetchWithTimeout("/api/transcribe", { method: "POST", body, headers: await authHeaders() });
  } catch (e) {
    diag("transcribe-network-error", { message: String((e as Error)?.message ?? e).slice(0, 120) });
    throw new Error("Couldn't reach the server to transcribe your answer. Check your connection.");
  }
  const data = await res.json().catch(() => ({}));
  diag("transcribe-response", {
    status: res.status,
    ms: Date.now() - started,
    chars: typeof data.text === "string" ? data.text.length : undefined,
    error: data.error,
  });
  if (!res.ok) throw new Error(data.error ?? "Could not transcribe your answer.");
  return (data.text as string) ?? "";
}

/** Upload a CV, cover letter or statement (PDF or Word) and get its plain text back. The file is not stored. */
export async function extractFileText(file: File): Promise<{ text: string; truncated: boolean }> {
  const body = new FormData();
  body.append("file", file);
  let res: Response;
  try {
    res = await fetchWithTimeout("/api/extract", { method: "POST", body, headers: await authHeaders() });
  } catch (e) {
    throw new Error((e as Error)?.message || "Couldn't reach the server to read your file. Check your connection.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Could not read that file.");
  return { text: String(data.text ?? ""), truncated: Boolean(data.truncated) };
}
