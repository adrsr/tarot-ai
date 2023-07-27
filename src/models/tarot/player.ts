import type { Side } from './side';

export type PlayerPosition = 0 | 1 | 2 | 3 | 4;

export type Player = {
  position: PlayerPosition;
  totalScore: number;
  side?: Side;
};
