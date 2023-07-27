import { Bid } from './models/tarot/bid';
import { Card } from './models/tarot/card';
import { DiscardableCards } from './models/tarot/discardable-cards';

export class ArtificialIntelligence {

  makeBid(validBids: ReadonlyArray<Bid>): Bid {
    return validBids[0];
  }

  callPartner(callableCards: ReadonlyArray<Card>): Card {
    return callableCards[0];
  }

  setAside(discardableCards: DiscardableCards): Array<Card> {
    const aside = [];
    aside.push(...discardableCards.suitedCards.slice(0, discardableCards.cardCount));
    const missingCardCount = discardableCards.cardCount - aside.length;
    if (missingCardCount) {
      aside.push(...discardableCards.trumpCards.slice(0, missingCardCount));
    }
    return aside;
  }

  playCard(playableCards: ReadonlyArray<Card>): Card {
    return playableCards[0];
  }

}
