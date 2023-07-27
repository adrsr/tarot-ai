import type { Card } from './card';

export type DiscardableCards = Readonly<{
  suitedCards: ReadonlyArray<Card>;
  trumpCards: ReadonlyArray<Card>;
  trumpCount: number;
  cardCount: number;
}>;
