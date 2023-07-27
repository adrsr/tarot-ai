import type { Card } from './card';
import type { Player, PlayerPosition } from './player';
import type { Round } from './round';
import type { ScoringResult } from './scoring-result';

export type GameSize = 3 | 4 | 5;

export enum GameStateKind {
  Waiting = 'waiting',
  Bidding = 'bidding',
  CallingTakerPartner = 'calling-taker-partner',
  MakingAside = 'making-aside',
  Playing = 'playing',
  Voided = 'voided',
  Finished = 'finished',
}

export type GameState = {
  kind: GameStateKind;
  playerCount: GameSize;
  players: Array<Player>;
  ownPosition?: PlayerPosition;
  ownHand?: Array<Card>;
  dog?: ReadonlyArray<Card>;
  aside?: ReadonlyArray<Card>;
  takerPosition?: PlayerPosition;
  takerPartnerPosition?: PlayerPosition;
  previousRound?: Round;
  currentRound?: Round;
  scoringResult?: ScoringResult;
};

export type VoidedGameState = {
  dog: ReadonlyArray<Card>;
};

export type FinishedGameState = {
  scoringResult: ScoringResult;
  aside: ReadonlyArray<Card>;
};
