import type { Bid } from './bid';
import type { Card } from './card';
import type { Player, PlayerPosition } from './player';

type BaseRound = {
  leadPosition: PlayerPosition;
  currentPosition: PlayerPosition;
};

export type BiddingRound = BaseRound & {
  bids: Array<Bid>;
};

export type TrickRound = {
  trick: Array<Card>;
  trickWinner?: Player;
  foolReceiver?: Player;
};

export type Round = BiddingRound | TrickRound;
