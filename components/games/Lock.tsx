"use client";

import { useEffect, useRef, useState } from "react";
import { GameStage, Key, StageButton, useKeys } from "@/components/games/stage";
import type { GameProps, GameResult } from "@/components/games/types";
import { LOCK, lockSpec, segmentAt } from "@/lib/games/tasks";

const SIZE = 220;
const C = SIZE / 2;
const R = 92;

const polar = (deg: number, r: number) => [C + r * Math.sin((deg * Math.PI) / 180), C - r * Math.cos((deg * Math.PI) / 180)] as const;
function wedge(i: number) {
  const a0 = (i * 360) / LOCK.segments;
  const a1 = ((i + 1) * 360) / LOCK.segments;
  const [x0, y0] = polar(a0, R);
  const [x1, y1] = polar(a1, R);
  return `M${C} ${C} L${x0} ${y0} A${R} ${R} 0 0 1 ${x1} ${y1} Z`;
}

export default function Lock({ seed, onFinish }: GameProps) {
  const [lock, setLock] = useState(0);
  const [angle, setAngle] = useState(0);
  const [presses, setPresses] = useState(0);
  const [misses, setMisses] = useState(0);
  const [note, setNote] = useState("");
  const start = useRef(0);
  const angleRef = useRef(0);
  const best = useRef(0);
  const spec = lockSpec(seed, lock);

  useEffect(() => {
    start.current = performance.now();
    let raf = 0;
    const speed = lockSpec(seed, lock).speed;
    const tick = () => {
      angleRef.current = (((performance.now() - start.current) / 1000) * speed) % 360;
      setAngle(angleRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [lock, seed]);

  function finish(opened: number, missCount: number, pressCount: number) {
    const res: GameResult = {
      headline: opened >= LOCK.locks ? `All ${LOCK.locks} locks opened` : `${opened} of ${LOCK.locks} locks opened`,
      stats: [
        { label: "Locks opened", value: `${opened} of ${LOCK.locks}` },
        { label: "Furthest lock reached", value: String(Math.max(best.current + 1, opened)) },
        { label: "Misses (each sends you back to lock 1)", value: String(missCount) },
        { label: "Presses used", value: `${pressCount} of ${LOCK.maxPresses}` },
      ],
      reading: [
        missCount === 0 ? "You never missed: precise timing from the start." : missCount > 3 ? "Several misses: the dial speeds up on each lock, so wait for the highlighted number rather than pressing as it approaches." : "A few misses: each costs a restart, so accuracy beats speed here.",
        "Every miss sends you back to the first lock, so the task rewards steady control under rising speed.",
      ],
    };
    onFinish(res);
  }

  function press() {
    const hit = segmentAt(angleRef.current) === spec.target;
    const used = presses + 1;
    setPresses(used);
    if (hit) {
      if (lock + 1 >= LOCK.locks) return finish(LOCK.locks, misses, used);
      best.current = Math.max(best.current, lock + 1);
      setNote(`Lock ${lock + 1} opened.`);
      setLock(lock + 1);
    } else {
      const m = misses + 1;
      setMisses(m);
      setNote("Missed. Back to the first lock.");
      setLock(0);
    }
    if (used >= LOCK.maxPresses && !hit) finish(best.current, misses + 1, used);
  }
  useKeys((k) => k === " " && press());

  const [px, py] = polar(angle, R + 6);
  return (
    <GameStage title="Security" left={`Lock ${lock + 1} of ${LOCK.locks}`} right={`${LOCK.maxPresses - presses} presses left`} progress={lock / LOCK.locks} status={note || "Stop the pointer on the highlighted number."}>
      <div className="grid place-items-center">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-64 w-64" role="img" aria-label={`A lock dial. The highlighted number is ${spec.target}.`}>
          <circle cx={C} cy={C} r={R + 8} fill="#0b1c2b" stroke="#ffffff33" strokeWidth="2" />
          {Array.from({ length: LOCK.segments }, (_, i) => (
            <path key={i} d={wedge(i)} fill={i === spec.target ? "#14b8a6" : i % 2 ? "#1f3b52" : "#274a66"} stroke="#0b1c2b" strokeWidth="1.5" />
          ))}
          {Array.from({ length: LOCK.segments }, (_, i) => {
            const [x, y] = polar(((i + 0.5) * 360) / LOCK.segments, R * 0.72);
            return (
              <text key={i} x={x} y={y + 5} textAnchor="middle" fontSize="16" fontWeight="700" fill={i === spec.target ? "#04201d" : "#e2e8f0"}>
                {i}
              </text>
            );
          })}
          <circle cx={C} cy={C} r="14" fill="#0b1c2b" />
          <line x1={C} y1={C} x2={px} y2={py} stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
          <circle cx={px} cy={py} r="6" fill="#fbbf24" />
        </svg>
      </div>
      <div className="mt-3 flex justify-center">
        <StageButton kind="primary" onClick={press}>
          Stop <Key>Space</Key>
        </StageButton>
      </div>
    </GameStage>
  );
}
