"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { GameStage, Key, StageButton, useKeys } from "@/components/games/stage";
import type { GameProps, GameResult } from "@/components/games/types";
import { GRID, NUMEROSITY, digitFillCorrect, digitPuzzle, gridRecallScore, gridTrial, numerosityCorrect, numerosityRound, type DigitPuzzle } from "@/lib/games/cognitive";

const pct = (n: number, d: number) => (d ? `${Math.round((100 * n) / d)}%` : "none");
const clock = () => performance.now();
const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

/* ------------------------------------------------------------------ Numerosity */

/** Pick the two numbers that give the target with the operation shown. Adaptive: a right answer raises the level, a wrong one lowers it. */
export function Numerosity({ seed, onFinish }: GameProps) {
  const [level, setLevel] = useState(1);
  const [roundNo, setRoundNo] = useState(0);
  const [picked, setPicked] = useState<number[]>([]);
  const [left, setLeft] = useState<number>(NUMEROSITY.seconds);
  const [roundLeft, setRoundLeft] = useState<number>(NUMEROSITY.perRoundSeconds);
  const [note, setNote] = useState("");
  const stats = useRef({ right: 0, wrong: 0, timeouts: 0, best: 1 });
  const begun = useRef(0);
  const roundStart = useRef(0);
  const finished = useRef(false);
  const levelRef = useRef(1);
  const round = useMemo(() => numerosityRound(seed + roundNo * 17, level), [seed, roundNo, level]);

  function end() {
    if (finished.current) return;
    finished.current = true;
    const s = stats.current;
    const total = s.right + s.wrong + s.timeouts;
    const res: GameResult = {
      headline: `Reached level ${s.best}`,
      stats: [
        { label: "Highest level", value: String(s.best) },
        { label: "Right", value: `${s.right} of ${total}` },
        { label: "Wrong", value: String(s.wrong) },
        { label: "Ran out of time", value: String(s.timeouts) },
      ],
      reading: [
        s.best >= 7 ? "You reached the multiplication levels: your mental arithmetic held up as it got harder." : s.best >= 4 ? "You reached subtraction levels: good, steady progress." : "You stayed on addition: slowing down slightly on each round may help.",
        s.timeouts > s.wrong ? "More rounds ended on the clock than on wrong answers: speed is the limit, so scan for the pair rather than checking every number." : "Most mistakes were wrong picks, not slow ones: check your pair before you commit.",
      ],
    };
    onFinish(res);
  }

  useEffect(() => {
    begun.current = clock();
    roundStart.current = clock();
    const id = window.setInterval(() => {
      const remaining = NUMEROSITY.seconds - (clock() - begun.current) / 1000;
      setLeft(Math.max(0, Math.ceil(remaining)));
      setRoundLeft(Math.max(0, Math.ceil(NUMEROSITY.perRoundSeconds - (clock() - roundStart.current) / 1000)));
      if (remaining <= 0) {
        window.clearInterval(id);
        end();
      } else if (clock() - roundStart.current > NUMEROSITY.perRoundSeconds * 1000) {
        stats.current.timeouts++;
        advance(Math.max(1, levelRef.current - 1), "Out of time for that one.");
      }
    }, 250);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function advance(nextLevel: number, text: string) {
    levelRef.current = nextLevel;
    stats.current.best = Math.max(stats.current.best, nextLevel);
    roundStart.current = clock();
    setNote(text);
    setPicked([]);
    setLevel(nextLevel);
    setRoundNo((n) => n + 1);
  }

  function pick(n: number) {
    if (picked.includes(n)) return setPicked(picked.filter((x) => x !== n));
    const next = [...picked, n];
    if (next.length < 2) return setPicked(next);
    const ok = numerosityCorrect(round, [next[0], next[1]]) || numerosityCorrect(round, [next[1], next[0]]);
    if (ok) {
      stats.current.right++;
      advance(levelRef.current + 1, "Correct.");
    } else {
      stats.current.wrong++;
      advance(Math.max(1, levelRef.current - 1), "Not that pair.");
    }
  }

  return (
    <GameStage title="Numerosity" left={`Level ${level}`} right={`${mmss(left)} · ${roundLeft}s for this one`} progress={1 - left / NUMEROSITY.seconds} status={note || "Pick the two numbers that make the target."}>
      <div className="space-y-5 text-center">
        <p className="text-3xl font-extrabold tabular-nums">
          A {round.op} B = {round.target}
        </p>
        <div className="mx-auto grid max-w-md grid-cols-4 gap-3">
          {round.numbers.map((n) => (
            <button key={n} type="button" onClick={() => pick(n)} aria-pressed={picked.includes(n)} className={`rounded-xl py-4 text-xl font-bold tabular-nums ring-1 ${picked.includes(n) ? "bg-brand-500 text-white ring-white" : "bg-white/10 text-white ring-white/25 hover:bg-white/20"}`}>
              {n}
            </button>
          ))}
        </div>
        <p className="text-xs text-white/60">{round.op === "−" || round.op === "÷" ? "Either order is accepted." : "Choose two numbers."}</p>
      </div>
    </GameStage>
  );
}

/* ------------------------------------------------------------------ Digit challenge */

const DIGIT_SECONDS = 240;

/** Fill the gaps in the equation with different digits from 1 to 9 so it comes to the result. Each right answer makes the next one harder. */
export function DigitChallenge({ seed, onFinish }: GameProps) {
  const [level, setLevel] = useState(0);
  const puzzle: DigitPuzzle = useMemo(() => digitPuzzle(seed, level), [seed, level]);
  const [fill, setFill] = useState<(number | null)[]>(() => digitPuzzle(seed, 0).numbers.map(() => null));
  const [left, setLeft] = useState(DIGIT_SECONDS);
  const [note, setNote] = useState("");
  const stats = useRef({ solved: 0, wrong: 0, best: 0 });
  const begun = useRef(0);
  const finished = useRef(false);

  useEffect(() => {
    begun.current = clock();
    const id = window.setInterval(() => {
      const remaining = DIGIT_SECONDS - (clock() - begun.current) / 1000;
      setLeft(Math.max(0, Math.ceil(remaining)));
      if (remaining <= 0 && !finished.current) {
        finished.current = true;
        window.clearInterval(id);
        const s = stats.current;
        onFinish({
          headline: `${s.solved} equation${s.solved === 1 ? "" : "s"} solved`,
          stats: [
            { label: "Equations solved", value: String(s.solved) },
            { label: "Wrong attempts", value: String(s.wrong) },
            { label: "Most blanks filled in one equation", value: String(s.best || 2) },
          ],
          reading: [
            s.wrong > s.solved ? "More wrong attempts than solved equations: work out the bigger digit that does the most work (the one that is multiplied) first." : "Few wrong attempts: you worked it out before you filled it in.",
            "More than one fill can be right. If your first idea fails, swap the largest digit rather than starting from nothing.",
          ],
        });
      }
    }, 250);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function put(d: number) {
    const at = fill.indexOf(null);
    if (at === -1 || fill.includes(d)) return;
    const next = [...fill];
    next[at] = d;
    setFill(next);
  }
  function undo() {
    let at = -1;
    fill.forEach((v, i) => {
      if (v !== null) at = i;
    });
    if (at < 0) return;
    const next = [...fill];
    next[at] = null;
    setFill(next);
  }
  function check() {
    if (digitFillCorrect(puzzle, fill)) {
      stats.current.solved++;
      stats.current.best = Math.max(stats.current.best, puzzle.numbers.length);
      const nextLevel = level + 1;
      setNote("Correct.");
      setLevel(nextLevel);
      setFill(digitPuzzle(seed, nextLevel).numbers.map(() => null));
    } else {
      stats.current.wrong++;
      setNote(fill.includes(null) ? "Fill every gap first." : "That does not come to the result.");
      if (!fill.includes(null)) setFill(fill.map(() => null));
    }
  }
  useKeys((k) => {
    if (/^[1-9]$/.test(k)) put(Number(k));
    if (k === "Backspace") undo();
    if (k === "Enter") check();
  });

  return (
    <GameStage title="Digit challenge" left={`Equation ${level + 1}`} right={mmss(left)} progress={1 - left / DIGIT_SECONDS} status={note || "Use each digit from 1 to 9 at most once in an equation."}>
      <div className="space-y-5 text-center">
        <p className="flex flex-wrap items-center justify-center gap-2 text-2xl font-extrabold tabular-nums">
          {puzzle.numbers.map((_, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className={`grid h-12 w-12 place-items-center rounded-lg ring-2 ${fill[i] === null ? "ring-white/40" : "bg-white/15 ring-white"}`}>{fill[i] ?? ""}</span>
              {i < puzzle.ops.length && <span>{puzzle.ops[i]}</span>}
            </span>
          ))}
          <span>= {puzzle.result}</span>
        </p>
        <div className="mx-auto grid max-w-xs grid-cols-9 gap-1.5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
            <button key={d} type="button" onClick={() => put(d)} disabled={fill.includes(d)} className="rounded-lg bg-white/10 py-3 font-bold text-white ring-1 ring-white/25 hover:bg-white/20 disabled:opacity-30">
              {d}
            </button>
          ))}
        </div>
        <div className="flex justify-center gap-3">
          <StageButton onClick={undo}>Undo <Key>⌫</Key></StageButton>
          <StageButton kind="primary" onClick={check}>
            Check <Key>Enter</Key>
          </StageButton>
        </div>
      </div>
    </GameStage>
  );
}

/* ------------------------------------------------------------------ Grid challenge */

type GridPhase = { name: "show"; k: number } | { name: "sym"; k: number } | { name: "recall"; got: number[] };

/** Remember the order in which cells light up, with a symmetry question between each, then tap the cells back in order. */
export function GridChallenge({ seed, onFinish }: GameProps) {
  const [t, setT] = useState(0);
  const [phase, setPhase] = useState<GridPhase>({ name: "show", k: 0 });
  const trial = useMemo(() => gridTrial(seed, t), [seed, t]);
  const recalled = useRef(0);
  const total = useRef(0);
  const symOk = useRef(0);
  const symAsked = useRef(0);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (phase.name !== "show") return;
    const id = window.setTimeout(() => setPhase({ name: "sym", k: phase.k }), 900);
    return () => window.clearTimeout(id);
  }, [phase]);

  function answerSym(says: boolean) {
    if (phase.name !== "sym") return;
    symAsked.current++;
    if (says === trial.symmetry[phase.k].symmetric) symOk.current++;
    if (phase.k + 1 >= trial.cells.length) setPhase({ name: "recall", got: [] });
    else setPhase({ name: "show", k: phase.k + 1 });
  }
  function tap(cell: number) {
    if (phase.name !== "recall") return;
    const got = [...phase.got, cell];
    if (got.length < trial.cells.length) return setPhase({ ...phase, got });
    const score = gridRecallScore(trial.cells, got);
    recalled.current += score;
    total.current += trial.cells.length;
    setNote(`${score} of ${trial.cells.length} in the right place.`);
    if (t + 1 >= GRID.setSizes.length) {
      onFinish({
        headline: `${recalled.current} of ${total.current} cells recalled in order`,
        stats: [
          { label: "Cells recalled in the right place", value: `${recalled.current} of ${total.current} (${pct(recalled.current, total.current)})` },
          { label: "Symmetry questions right", value: `${symOk.current} of ${symAsked.current}` },
          { label: "Longest set you faced", value: String(Math.max(...GRID.setSizes)) },
        ],
        reading: [
          symOk.current < symAsked.current * 0.7 ? "You missed a fair number of symmetry questions: the task is built so that the distraction competes with your memory, so keep answering them." : "You answered the symmetry questions well while holding the cells in mind.",
          recalled.current / total.current < 0.6 ? "Try linking the cells into a path or shape as they appear." : "You held the order well as the sets got longer.",
        ],
      });
      return;
    }
    setT(t + 1);
    setPhase({ name: "show", k: 0 });
  }

  const lit = phase.name === "show" ? trial.cells[phase.k] : -1;
  const sym = phase.name === "sym" ? trial.symmetry[phase.k] : null;
  return (
    <GameStage title="Grid challenge" left={`Task ${t + 1} of ${GRID.setSizes.length}`} right={`Remember ${trial.cells.length} cells`} progress={t / GRID.setSizes.length} status={note || (phase.name === "recall" ? "Tap the cells in the order they lit up." : phase.name === "sym" ? "Is the pattern a mirror image left to right?" : "Watch the cells light up.")}>
      {sym ? (
        <div className="space-y-4 text-center">
          <div className="mx-auto grid w-48 gap-0.5 rounded-lg bg-white p-1.5" style={{ gridTemplateColumns: `repeat(${GRID.symmetrySize}, 1fr)` }} role="img" aria-label="A pattern of filled squares">
            {sym.pattern.flat().map((v, i) => (
              <span key={i} className={`aspect-square rounded-sm ${v ? "bg-slate-800" : "bg-slate-100"}`} />
            ))}
          </div>
          <div className="flex justify-center gap-3">
            <StageButton kind="primary" onClick={() => answerSym(true)}>Symmetric</StageButton>
            <StageButton onClick={() => answerSym(false)}>Not symmetric</StageButton>
          </div>
        </div>
      ) : (
        <div className="mx-auto grid w-56 gap-2" style={{ gridTemplateColumns: `repeat(${GRID.size}, 1fr)` }}>
          {Array.from({ length: GRID.size * GRID.size }, (_, i) => {
            const order = phase.name === "recall" ? phase.got.indexOf(i) : -1;
            return (
              <button key={i} type="button" disabled={phase.name !== "recall"} onClick={() => tap(i)} aria-label={`Cell ${i + 1}`} className={`aspect-square rounded-lg text-sm font-bold ${i === lit ? "bg-brand-500" : order >= 0 ? "bg-white/35" : "bg-white/10 hover:bg-white/20"}`}>
                {order >= 0 ? order + 1 : ""}
              </button>
            );
          })}
        </div>
      )}
    </GameStage>
  );
}
