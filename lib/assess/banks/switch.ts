// switchChallenge-style items: a row of four shapes goes through a "switch" that reorders it; choose the switch
// code that produces the output. Codes are four digits: position i of the output takes the input shape at position
// code[i]. Harder items chain two switches with the first one given. Generated from a seed so keys are computed.

import { rng, type Rng } from "@/lib/assess/rng";
import type { Item } from "@/lib/assess/types";

const SHAPES = ["▲", "●", "■", "◆", "★", "✚"];

const PERMS: string[] = (() => {
  const out: string[] = [];
  const rec = (pre: string, rest: string) => (rest ? [...rest].forEach((c, i) => rec(pre + c, rest.slice(0, i) + rest.slice(i + 1))) : out.push(pre));
  rec("", "1234");
  return out.filter((p) => p !== "1234"); // the identity switch changes nothing, so it is never used
})();

export const applySwitch = (row: string[], code: string) => [...code].map((d) => row[Number(d) - 1]);
const show = (row: string[]) => row.join(" ");

function item(r: Rng, n: number, twoStep: boolean): Item {
  const input = r.shuffle(SHAPES).slice(0, 4);
  const first = twoStep ? r.pick(PERMS) : null;
  const answer = r.pick(PERMS);
  const middle = first ? applySwitch(input, first) : input;
  const output = applySwitch(middle, answer);
  // Distractors: other codes that give a different output from the same middle row.
  const distractors = r.shuffle(PERMS.filter((p) => p !== answer && show(applySwitch(middle, p)) !== show(output))).slice(0, 3);
  const options = r.shuffle([answer, ...distractors]);
  const prompt = first
    ? `Input: ${show(input)}\nAfter switch ${first}: ${show(middle)}\nThen an unknown switch gives: ${show(output)}\nWhich switch code was the second one?`
    : `Input: ${show(input)}\nOutput: ${show(output)}\nWhich switch code turns the input into the output?`;
  return {
    id: `sw-${n}`,
    kind: "mcq",
    prompt,
    options,
    answer: options.indexOf(answer),
    explanation: `Code ${answer} means: output position 1 takes shape ${answer[0]} of the row going in, position 2 takes shape ${answer[1]}, and so on. ${show(middle)} becomes ${show(output)}.`,
    difficulty: twoStep ? 4 : 2,
  };
}

/** 24 one-switch items, then 24 two-switch items. */
export function buildSwitch(): Item[] {
  const r = rng(52000);
  return Array.from({ length: 48 }, (_, i) => item(r, i + 1, i >= 24));
}

export const SWITCH = buildSwitch();
