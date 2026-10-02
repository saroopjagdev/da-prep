import { RATING_LABELS, TF_OPTIONS, type Item, type Response } from "./types";

const NONE = "No answer";

/** Human-readable correct answer for the results review. Trait items have none. */
export function describeKey(item: Item): string {
  switch (item.kind) {
    case "mcq":
      return item.options[item.answer];
    case "tf-cannot-say":
      return TF_OPTIONS[item.answer];
    case "most-least":
      return `Most effective: ${item.options[item.most]}. Least effective: ${item.options[item.least]}.`;
    case "rate-each":
      return item.actions.map((a, i) => `${a} (${RATING_LABELS[item.ratings[i]]})`).join("\n");
    case "rank":
      return item.order.map((o, i) => `${i + 1}. ${item.options[o]}`).join("\n");
    case "written":
      return item.checklist.map((c) => `• ${c}`).join("\n");
    case "numeric":
      return `${item.answer.toLocaleString("en-GB")}${item.unit ? ` ${item.unit}` : ""}${item.tolerance ? ` (answers within ${item.tolerance} accepted)` : ""}`;
    default:
      return "";
  }
}

/** Human-readable version of what the candidate answered. */
export function describeResponse(item: Item, r: Response): string {
  if (r.kind !== item.kind) return NONE;
  switch (item.kind) {
    case "mcq": {
      const c = (r as Extract<Response, { kind: "mcq" }>).choice;
      return c === null ? NONE : item.options[c];
    }
    case "tf-cannot-say": {
      const c = (r as Extract<Response, { kind: "tf-cannot-say" }>).choice;
      return c === null ? NONE : TF_OPTIONS[c];
    }
    case "most-least": {
      const x = r as Extract<Response, { kind: "most-least" }>;
      if (x.most === null && x.least === null) return NONE;
      return `Most effective: ${x.most === null ? "none chosen" : item.options[x.most]}. Least effective: ${x.least === null ? "none chosen" : item.options[x.least]}.`;
    }
    case "rate-each": {
      const x = r as Extract<Response, { kind: "rate-each" }>;
      if (x.ratings.every((v) => v === null)) return NONE;
      return item.actions.map((a, i) => `${a} (${x.ratings[i] === null || x.ratings[i] === undefined ? "not rated" : RATING_LABELS[x.ratings[i] as number]})`).join("\n");
    }
    case "rank": {
      const x = r as Extract<Response, { kind: "rank" }>;
      return x.order ? x.order.map((o, i) => `${i + 1}. ${item.options[o]}`).join("\n") : NONE;
    }
    case "written": {
      const t = (r as Extract<Response, { kind: "written" }>).text;
      return t && t.trim() ? t.trim() : NONE;
    }
    case "numeric": {
      const v = (r as Extract<Response, { kind: "numeric" }>).value;
      return v === null || !v.trim() ? NONE : v.trim();
    }
    default:
      return "";
  }
}
