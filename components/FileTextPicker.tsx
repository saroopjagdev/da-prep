"use client";

import { useRef, useState } from "react";
import { extractFileText } from "@/lib/api";

const MAX_MB = 4;

/** "Upload a PDF or Word file" for the writing tools: reads the text on the server and hands it to the text box to review and edit. */
export default function FileTextPicker({ onText, what = "document", maxChars = 8000 }: { onText: (text: string) => void; what?: string; maxChars?: number }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  async function pick(file?: File) {
    if (!file) return;
    setMsg("");
    setError("");
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`That file is too large. The limit is ${MAX_MB} MB.`);
      return;
    }
    setBusy(true);
    try {
      const got = await extractFileText(file);
      const truncated = got.truncated || got.text.length > maxChars;
      const text = got.text.slice(0, maxChars);
      onText(text);
      setMsg(truncated ? `Read ${file.name}. It was long, so only the start is shown below: trim it to the part you want reviewed.` : `Read ${file.name}. Check the text below, then get your feedback.`);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div className="space-y-1">
      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={input}
          id="file-upload"
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="sr-only"
          onChange={(e) => pick(e.target.files?.[0])}
          disabled={busy}
        />
        <label htmlFor="file-upload" className={`btn btn-secondary cursor-pointer ${busy ? "opacity-60" : ""}`}>
          {busy ? "Reading file..." : `Upload your ${what} (PDF or Word)`}
        </label>
        <span className="text-xs text-muted">or paste the text below. Files are read to get the text and are not stored.</span>
      </div>
      {msg && <p className="text-sm text-mint-600">{msg}</p>}
      {error && <p className="text-sm text-coral-600" role="alert">{error}</p>}
    </div>
  );
}
