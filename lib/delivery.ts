// How an answer was delivered, worked out from the transcript and the time spoken. Pure and local: nothing is sent anywhere.
// Limits, stated in the app too: transcription tends to leave out some "um"s and "uh"s, so the filler count can only be a
// minimum, and pauses and eye contact can't be measured from text.

export type FillerCount = { word: string; count: number };

export type Delivery = {
  words: number;
  seconds: number;
  /** Words per minute, or null when the answer is too short to judge. */
  wpm: number | null;
  pace: "slow" | "good" | "fast" | null;
  fillers: FillerCount[];
  fillerTotal: number;
  /** Fillers per 100 words, or null when there are too few words. */
  fillerRate: number | null;
  /** Share of the allowed time used, 0 to 1, when a limit is known. */
  usedShare: number | null;
  tips: string[];
};

const FILLERS: [string, RegExp][] = [
  ["um / uh / er", /\b(?:u+m+|u+h+|e+r+m*|a+h+)\b/gi],
  ["you know", /\byou know\b/gi],
  ["I mean", /\bi mean\b/gi],
  ["sort of / kind of", /\b(?:sort|kind) of\b/gi],
  ["basically", /\bbasically\b/gi],
  ["literally", /\bliterally\b/gi],
  // "like" only when it is set off by a pause, so "I like robotics" and "looks like" are not counted.
  ["like", /(?:[,.]\s*like\b|\blike\s*,)/gi],
];

const wordCount = (text: string) => (text.trim().match(/[\w'’-]+/g) ?? []).length;

export function analyseDelivery(text: string, seconds: number, limitSeconds?: number): Delivery {
  const words = wordCount(text);
  const wpm = seconds >= 15 && words >= 20 ? Math.round((words / seconds) * 60) : null;
  const pace = wpm === null ? null : wpm < 110 ? "slow" : wpm > 180 ? "fast" : "good";

  const fillers: FillerCount[] = [];
  for (const [word, re] of FILLERS) {
    const count = (text.match(re) ?? []).length;
    if (count > 0) fillers.push({ word, count });
  }
  fillers.sort((a, b) => b.count - a.count);
  const fillerTotal = fillers.reduce((n, f) => n + f.count, 0);
  const fillerRate = words >= 20 ? Math.round((fillerTotal / words) * 1000) / 10 : null;
  const usedShare = limitSeconds && limitSeconds > 0 ? Math.min(1, seconds / limitSeconds) : null;

  const tips: string[] = [];
  if (pace === "fast") tips.push("You spoke quickly. Slow down a little at the key points so the interviewer can follow your result.");
  if (pace === "slow") tips.push("Your pace was slow. A steadier rhythm helps you fit the situation, action and result into the time.");
  if (fillerRate !== null && fillerRate >= 3) tips.push(`About ${fillerRate} filler words per 100 spoken. Try pausing silently instead of filling the gap.`);
  if (usedShare !== null && usedShare < 0.4 && words >= 1) tips.push("You used under half the time. A fuller STAR answer usually runs for most of it.");
  if (usedShare !== null && usedShare > 0.97) tips.push("You used all the time. Practise a version that finishes with a clear result before the cut-off.");
  return { words, seconds, wpm, pace, fillers, fillerTotal, fillerRate, usedShare, tips };
}
