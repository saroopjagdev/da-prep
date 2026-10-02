"use client";

import { RATING_LABELS, TF_OPTIONS, type Item, type Response } from "@/lib/assess/types";

type Props = {
  item: Item;
  response: Response;
  onChange: (r: Response) => void;
  /** After feedback is shown the answer can no longer be changed. */
  locked: boolean;
};

const LIKERT = ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"];

function Radio({ name, checked, disabled, onChange, label, className = "" }: { name: string; checked: boolean; disabled: boolean; onChange: () => void; label: string; className?: string }) {
  return (
    <label className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm ${checked ? "border-brand-500 bg-brand-50" : "border-line bg-white hover:border-brand-500"} ${className}`}>
      <input type="radio" name={name} checked={checked} disabled={disabled} onChange={onChange} className="h-4 w-4 accent-[var(--color-brand-600,#2563eb)]" />
      <span>{label}</span>
    </label>
  );
}

export default function ItemView({ item, response, onChange, locked }: Props) {
  const name = item.id;
  switch (item.kind) {
    case "mcq": {
      const r = response as Extract<Response, { kind: "mcq" }>;
      return (
        <fieldset className="space-y-2">
          <legend className="sr-only">Choose one answer</legend>
          {item.options.map((o, i) => (
            <Radio key={i} name={name} checked={r.choice === i} disabled={locked} onChange={() => onChange({ kind: "mcq", choice: i })} label={o} />
          ))}
        </fieldset>
      );
    }
    case "tf-cannot-say": {
      const r = response as Extract<Response, { kind: "tf-cannot-say" }>;
      return (
        <fieldset className="grid gap-2 sm:grid-cols-3">
          <legend className="sr-only">Is the statement true, false or can you not say?</legend>
          {TF_OPTIONS.map((o, i) => (
            <Radio key={o} name={name} checked={r.choice === i} disabled={locked} onChange={() => onChange({ kind: "tf-cannot-say", choice: i })} label={o} />
          ))}
        </fieldset>
      );
    }
    case "most-least":
    case "forced-choice": {
      const r = response as Extract<Response, { kind: "most-least" | "forced-choice" }>;
      const rows = item.kind === "most-least" ? item.options : item.statements.map((s) => s.text);
      const mostLabel = item.kind === "most-least" ? "Most effective" : "Most like me";
      const leastLabel = item.kind === "most-least" ? "Least effective" : "Least like me";
      const set = (patch: Partial<{ most: number | null; least: number | null }>) => {
        const next = { most: r.most, least: r.least, ...patch };
        // The same row cannot be both most and least.
        if (patch.most !== undefined && next.most === next.least) next.least = null;
        if (patch.least !== undefined && next.least === next.most) next.most = null;
        onChange({ kind: item.kind, ...next } as Response);
      };
      return (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[24rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-line text-left">
                <th scope="col" className="py-2 pr-3 font-semibold">Option</th>
                <th scope="col" className="w-24 px-2 py-2 text-center font-semibold">{mostLabel}</th>
                <th scope="col" className="w-24 px-2 py-2 text-center font-semibold">{leastLabel}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((text, i) => (
                <tr key={i} className="border-b border-line last:border-0">
                  <th scope="row" className="py-2 pr-3 text-left font-normal">{text}</th>
                  <td className="text-center">
                    <input type="radio" name={`${name}-most`} aria-label={`${mostLabel}: ${text}`} checked={r.most === i} disabled={locked} onChange={() => set({ most: i })} className="h-4 w-4" />
                  </td>
                  <td className="text-center">
                    <input type="radio" name={`${name}-least`} aria-label={`${leastLabel}: ${text}`} checked={r.least === i} disabled={locked} onChange={() => set({ least: i })} className="h-4 w-4" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    case "rate-each": {
      const r = response as Extract<Response, { kind: "rate-each" }>;
      return (
        <div className="space-y-4">
          {item.actions.map((a, i) => (
            <fieldset key={i} className="space-y-2 rounded-lg border border-line bg-white p-3">
              <legend className="px-1 text-sm font-medium">{a}</legend>
              <div className="grid gap-2 sm:grid-cols-4">
                {RATING_LABELS.map((label, v) => (
                  <Radio
                    key={label}
                    name={`${name}-${i}`}
                    checked={r.ratings[i] === v}
                    disabled={locked}
                    onChange={() => onChange({ kind: "rate-each", ratings: r.ratings.map((x, j) => (j === i ? v : x)) })}
                    label={label}
                  />
                ))}
              </div>
            </fieldset>
          ))}
        </div>
      );
    }
    case "rank": {
      const r = response as Extract<Response, { kind: "rank" }>;
      const order = r.order ?? item.options.map((_, i) => i);
      const move = (pos: number, dir: -1 | 1) => {
        const next = [...order];
        [next[pos], next[pos + dir]] = [next[pos + dir], next[pos]];
        onChange({ kind: "rank", order: next });
      };
      return (
        <div className="space-y-2">
          <p className="text-sm text-muted">Put the options in order, {item.orderLabel ?? "best first"}. Use the arrows to move an option.</p>
          <ol className="space-y-2">
            {order.map((optIdx, pos) => (
              <li key={optIdx} className="flex items-center gap-3 rounded-lg border border-line bg-white p-3 text-sm">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded bg-brand-50 text-xs font-bold text-brand-700">{pos + 1}</span>
                <span className="flex-1">{item.options[optIdx]}</span>
                <button type="button" disabled={locked || pos === 0} onClick={() => move(pos, -1)} className="btn btn-secondary px-2 py-1" aria-label={`Move up: ${item.options[optIdx]}`}>↑</button>
                <button type="button" disabled={locked || pos === order.length - 1} onClick={() => move(pos, 1)} className="btn btn-secondary px-2 py-1" aria-label={`Move down: ${item.options[optIdx]}`}>↓</button>
              </li>
            ))}
          </ol>
          {r.order === null && (
            <button type="button" disabled={locked} onClick={() => onChange({ kind: "rank", order })} className="btn btn-secondary text-sm">
              Keep this order
            </button>
          )}
        </div>
      );
    }
    case "written": {
      const r = response as Extract<Response, { kind: "written" }>;
      const words = (r.text ?? "").trim().split(/\s+/).filter(Boolean).length;
      return (
        <label className="block space-y-1 text-sm">
          <span className="font-semibold">Your reply</span>
          <textarea
            className="input h-48 font-normal"
            value={r.text ?? ""}
            disabled={locked}
            maxLength={4000}
            onChange={(e) => onChange({ kind: "written", text: e.target.value === "" ? null : e.target.value })}
          />
          <span className="block text-xs text-muted">
            {words} words{item.minWords ? ` (aim for at least ${item.minWords})` : ""}. Not marked automatically: you will see a checklist to compare against at the end.
          </span>
        </label>
      );
    }
    case "numeric": {
      const r = response as Extract<Response, { kind: "numeric" }>;
      return (
        <label className="block space-y-1 text-sm">
          <span className="font-semibold">Your answer</span>
          <span className="flex items-center gap-2">
            <input
              type="text"
              inputMode="decimal"
              autoComplete="off"
              className="input max-w-[12rem] tabular-nums"
              value={r.value ?? ""}
              disabled={locked}
              onChange={(e) => onChange({ kind: "numeric", value: e.target.value === "" ? null : e.target.value })}
            />
            {item.unit && <span className="text-muted">{item.unit}</span>}
          </span>
        </label>
      );
    }
    case "likert": {
      const r = response as Extract<Response, { kind: "likert" }>;
      return (
        <fieldset className="grid gap-2 sm:grid-cols-5">
          <legend className="sr-only">How much do you agree?</legend>
          {LIKERT.map((label, i) => (
            <Radio key={label} name={name} checked={r.value === i + 1} disabled={locked} onChange={() => onChange({ kind: "likert", value: i + 1 })} label={label} />
          ))}
        </fieldset>
      );
    }
  }
}
