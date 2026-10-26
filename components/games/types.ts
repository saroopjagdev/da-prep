import type { ComponentType } from "react";

/** What a finished game hands back to the shell: a few plain numbers and a short reading of them. */
export type GameResult = {
  headline: string;
  stats: { label: string; value: string }[];
  /** Short observations about what the numbers show. Never a pass or fail. */
  reading: string[];
};

export type GameProps = {
  /** Fixed for one play, so a game can be described and tested. Chosen when Start is pressed. */
  seed: number;
  onFinish: (result: GameResult) => void;
};

export type GameComponent = ComponentType<GameProps>;
