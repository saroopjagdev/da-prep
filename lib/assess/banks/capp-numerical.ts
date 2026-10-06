// Cappfinity-style numerical reasoning: mixed answer types on one table (type the number, order the values, choose
// one). Original, generated from invented data so every key is computed; the checks recompute each key from the table.

import { rng, type Rng } from "@/lib/assess/rng";
import type { Item, Stimulus } from "@/lib/assess/types";

type Theme = { title: string; entity: string; names: string[]; unit: string; measure: string };

const THEMES: Theme[] = [
  { title: "New client accounts opened, by branch", entity: "Branch", names: ["Leeds", "Bristol", "Cardiff", "Glasgow", "Norwich", "York"], unit: "accounts", measure: "new accounts" },
  { title: "Funds under management, by fund (£ million)", entity: "Fund", names: ["Global Equity", "UK Income", "Green Bond", "Asia Growth", "Cash Plus", "Balanced"], unit: "£ million", measure: "funds under management" },
  { title: "Card transactions processed, by region (thousand)", entity: "Region", names: ["London", "North East", "Scotland", "Wales", "Midlands", "South West"], unit: "thousand", measure: "card transactions" },
  { title: "Advisory fees earned, by sector (£ thousand)", entity: "Sector", names: ["Retail", "Energy", "Technology", "Healthcare", "Transport", "Media"], unit: "£ thousand", measure: "advisory fees" },
];

export type CappNumericalBank = { items: Item[]; stimuli: Record<string, Stimulus>; checks: Record<string, (s: Stimulus) => number | number[]> };

const rows = (s: Stimulus) => {
  if (s.type !== "table") throw new Error("expected a table");
  return s.rows as [string, number, number][];
};
const pct = (a: number, b: number) => Math.round(((b - a) / a) * 1000) / 10; // one decimal place

function group(r: Rng, t: Theme, g: number) {
  // Re-roll until growth rates (to 1 dp) and absolute changes are all distinct, so every key is unambiguous.
  for (;;) {
    const names = r.shuffle(t.names).slice(0, 4);
    const data: [string, number, number][] = names.map((n) => {
      const a = r.int(20, 90) * 10;
      return [n, a, a + r.int(-6, 18) * 5];
    });
    const growth = data.map(([, a, b]) => pct(a, b));
    const change = data.map(([, a, b]) => b - a);
    if (new Set(growth).size < 4 || new Set(change).size < 4 || Math.max(...change) <= 0) continue;
    const stimId = `capp-num-g${g}`;
    const stimulus: Stimulus = { type: "table", title: t.title, columns: [t.entity, "2024", "2025"], rows: data };
    const [x] = data;
    const items: Item[] = [];
    const checks: CappNumericalBank["checks"] = {};

    const id1 = `${stimId}-1`;
    items.push({
      id: id1,
      kind: "numeric",
      stimulus: stimId,
      prompt: `By what percentage did ${x[0]}'s ${t.measure} change from 2024 to 2025? Give your answer to one decimal place (use a minus sign for a fall).`,
      answer: pct(x[1], x[2]),
      tolerance: 0.1,
      unit: "%",
      explanation: `(${x[2]} − ${x[1]}) ÷ ${x[1]} × 100 = ${pct(x[1], x[2])}% to one decimal place.`,
      difficulty: 3,
    });
    checks[id1] = (s) => {
      const [, a, b] = rows(s).find((q) => q[0] === x[0])!;
      return pct(a, b);
    };

    const id2 = `${stimId}-2`;
    const byGrowth = [...data.keys()].sort((i, j) => growth[j] - growth[i]);
    let shown = r.shuffle([...data.keys()]);
    // Never show the options already in the right order.
    while (shown.every((v, k) => v === byGrowth[k])) shown = r.shuffle([...data.keys()]);
    items.push({
      id: id2,
      kind: "rank",
      stimulus: stimId,
      prompt: `Put the ${t.entity.toLowerCase()}s in order of percentage growth from 2024 to 2025, highest first.`,
      options: shown.map((i) => data[i][0]),
      order: byGrowth.map((i) => shown.indexOf(i)),
      orderLabel: "highest growth first",
      explanation: `Growth: ${byGrowth.map((i) => `${data[i][0]} ${growth[i]}%`).join(", ")}.`,
      difficulty: 4,
    });
    checks[id2] = (s) => {
      const t2 = rows(s);
      return [...t2.keys()].sort((i, j) => pct(t2[j][1], t2[j][2]) - pct(t2[i][1], t2[i][2])).map((i) => shown.indexOf(i));
    };

    const id3 = `${stimId}-3`;
    const biggest = change.indexOf(Math.max(...change));
    const opts = r.shuffle(names);
    items.push({
      id: id3,
      kind: "mcq",
      stimulus: stimId,
      prompt: `Which ${t.entity.toLowerCase()} had the largest increase in ${t.measure} from 2024 to 2025?`,
      options: opts,
      answer: opts.indexOf(data[biggest][0]),
      explanation: `Changes: ${data.map(([n, a, b]) => `${n} ${b - a > 0 ? "+" : ""}${b - a}`).join(", ")}. The largest increase is ${data[biggest][0]}.`,
      difficulty: 2,
    });
    checks[id3] = (s) => {
      const t2 = rows(s);
      const ch = t2.map(([, a, b]) => b - a);
      return opts.indexOf(t2[ch.indexOf(Math.max(...ch))][0]);
    };

    const id4 = `${stimId}-4`;
    const total = data.reduce((sum, q) => sum + q[2], 0);
    items.push({
      id: id4,
      kind: "numeric",
      stimulus: stimId,
      prompt: `What was the total ${t.measure} across all four in 2025?`,
      answer: total,
      unit: t.unit,
      explanation: `${data.map((q) => q[2]).join(" + ")} = ${total}.`,
      difficulty: 1,
    });
    checks[id4] = (s) => rows(s).reduce((sum, q) => sum + q[2], 0);

    return { stimId, stimulus, items, checks };
  }
}

/** 8 tables with 4 items each; the test serves 3 tables (12 items) per attempt. */
export function buildCappNumerical(groups = 16): CappNumericalBank {
  const out: CappNumericalBank = { items: [], stimuli: {}, checks: {} };
  for (let g = 1; g <= groups; g++) {
    const { stimId, stimulus, items, checks } = group(rng(41000 + g), THEMES[(g - 1) % THEMES.length], g);
    out.stimuli[stimId] = stimulus;
    out.items.push(...items);
    Object.assign(out.checks, checks);
  }
  return out;
}

export const CAPP_NUMERICAL = buildCappNumerical();
