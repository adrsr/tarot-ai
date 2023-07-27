import type { PlayerPosition } from './player';
import type { WinConditionType } from './win-condition';

export type MatchState = {
  winConditionValue: number;
  winConditionType: WinConditionType;
  gamesDealed: number;
  gamesPlayed: number;
  winnerPosition?: PlayerPosition;
  totalScores: ReadonlyArray<number>;
};
