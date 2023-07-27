import type { Suit } from './suit';

export type Card = Readonly<{
  suit: Suit;
  rank: number;
}>;
