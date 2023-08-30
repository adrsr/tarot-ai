import { Bid } from './models/tarot/bid';
import { Card } from './models/tarot/card';
import { DiscardableCards } from './models/tarot/discardable-cards';
import { PlayerPosition } from './models/tarot/player';
import { Side } from './models/tarot/side';
import { Suit } from './models/tarot/suit';

export enum TrickEval {
  Safe,
  Risk,
  Defensive,
  Aggressive,
}

export class ArtificialIntelligence {

  // 4️⃣ current version works for the classic 4 players game
  // 3️⃣ 5️⃣ variants coming soon !

  #hand: Array<Card>;
  #position: PlayerPosition;
  #takerPosition: PlayerPosition;
  #side: Side;
  #tricks: Array<Array<{ playerPosition: number, playedCard: Card }>>;

  constructor() {
    this.#hand = [];
    this.#position = 0;
    this.#takerPosition = 0;
    this.#side = Side.Defense;
    this.#tricks = [[]];
  }

  set hand(value: Array<Card>) {
    this.#hand = value;

    // clear data
    this.#takerPosition = 0;
    this.#side = Side.Defense;
    this.#tricks = [[]];
  }

  set position(value: PlayerPosition) {
    this.#position = value;
  }

  set takerPosition(value: PlayerPosition) {
    this.#takerPosition = value;

    if (this.#takerPosition == this.#position)
      this.#side = Side.Taker;
  }

  set playedCard(value: { playerPosition: number, playedCard: Card }) {
    if (this.#tricks[0].length == 3) {
      this.#tricks[0].push(value);
      this.#tricks.unshift([]);
    }
    else {
      this.#tricks[0].push(value);
    }
  }

  /*
    AI CORE
  */

  private thinkBid(validBids: ReadonlyArray<Bid>): Bid {
    const oudlers = this.#hand.filter(card => {
      if (card.suit == Suit.Trump)
        if (card.rank == 1 || card.rank == 21 || card.rank == 0)
          return true;
      return false;
    }).length;

    const trumps = this.#hand.filter(card => {
      return card.suit == Suit.Trump
    }).length;

    const extraPoints = this.#hand.reduce((acc, card) => {
      if (card.suit != Suit.Trump)
        if (card.rank > 10)
          return acc + card.rank - 9;
      return acc;
    }, 0);

    const handStrength = oudlers * (trumps * 3 + extraPoints * 2);

    let maxBid = Bid.Pass;

    if (handStrength > 64)
      maxBid = Bid.Take;
    if (handStrength > 95)
      maxBid = Bid.Guard;
    if (handStrength > 125)
      maxBid = Bid.GuardWithout;
    if (handStrength > 170)
      maxBid = Bid.GuardAgainst;

    return validBids.find(o => o == maxBid) || Bid.Pass;
  }

  private thinkAside(discardableCards: DiscardableCards): Array<Card> {
    const aside = [] as Array<Card>;

    if (discardableCards.suitedCards.length <= 6) {
      const suitedToDiscard = discardableCards.suitedCards.length;
      const trumpToDiscard = 6 - suitedToDiscard;
      aside.push(...discardableCards.suitedCards.slice(0, suitedToDiscard));
      if (trumpToDiscard > 0)
        aside.push(...discardableCards.trumpCards.map(o => o).sort((a, b) => a.rank - b.rank).slice(0, trumpToDiscard));
    } else {
      const removeSuit = (suit: Suit, cards: ReadonlyArray<Card>) => {
        return cards.filter(o => o.suit != suit);
      }
      const sortCards = (cards: ReadonlyArray<Card>) => {
        const suits = this.shuffleSuits();
        const s1 = cards.filter(o => o.suit == suits[0]);
        const s2 = cards.filter(o => o.suit == suits[1]);
        const s3 = cards.filter(o => o.suit == suits[2]);
        const s4 = cards.filter(o => o.suit == suits[3]);
        return [s1, s2, s3, s4].filter(o => o.length > 0);
      }
      const makeCut = (maxSize: number) => {
        const cut = sortedCards.find(o => o.length <= maxSize);
        if (cut) {
          aside.push(...cut);
          sortedCards = sortCards(removeSuit(cut[0].suit, sortedCards.flat()));
        }
      }

      let sortedCards = sortCards(discardableCards.suitedCards);

      makeCut(1);
      makeCut(1);
      makeCut(2);
      makeCut(2);
      if (aside.length < 5)
        makeCut(2)
      if (aside.length < 4)
        makeCut(3)
      if (aside.length < 4)
        makeCut(3)
      if (aside.length < 3)
        makeCut(4)

      if (aside.length != 6) {
        const toDiscard = 6 - aside.length;
        aside.push(...sortedCards.flat().sort((a, b) => b.rank - a.rank).slice(0, toDiscard));
      }
    }

    return aside;
  }

  private thinkCard(playableCards: ReadonlyArray<Card>): Card {
    const onlyTrump = playableCards.every(o => o.suit == Suit.Trump);
    const defaultCard = playableCards[0];
    const excuse = this.getExcuseCard(playableCards)

    if (excuse && this.thinkExcuse(onlyTrump))
      return excuse;

    const evaluation = this.evaluateRunningTrick(playableCards);

    if (onlyTrump) {
      switch (evaluation) {
        case TrickEval.Safe:
          return this.getPetitCard(playableCards) || this.getLowTrumpCard(playableCards) || defaultCard;
        case TrickEval.Risk:
        case TrickEval.Defensive:
          return this.getLowTrumpCard(playableCards) || defaultCard;
        case TrickEval.Aggressive:
          return this.getHighTrumpCard(playableCards) || defaultCard;
      }
    } else {
      switch (evaluation) {
        case TrickEval.Safe:
          return this.getHighSuitedCard(playableCards) || defaultCard;
        case TrickEval.Risk:
        case TrickEval.Aggressive:
          const topCard = this.getTopSuitedCard(playableCards);
          return topCard || this.getLowSuitedCard(playableCards) || defaultCard;
        case TrickEval.Defensive:
          return this.getLowSuitedCard(playableCards) || defaultCard;
      }
    }
  }

  private thinkExcuse(onlyTrump: boolean): boolean {
    if (this.getPetitCard(this.#tricks[0].map(o => o.playedCard)))
      return false;

    if (onlyTrump && this.#tricks[0].length > 1 && this.runningTrickSuitedPoints() < 4)
      return true;

    if (this.#tricks.length > 10 && this.#tricks[0].length > 1 && this.runningTrickSuitedPoints() < 4)
      return true;

    if (this.#tricks.length > 16)
      return true;

    return false;
  }

  private evaluateRunningTrick(playableCards: ReadonlyArray<Card>): TrickEval {
    const onlyTrump = playableCards.every(o => o.suit == Suit.Trump);
    const firstToPlay = this.#tricks[0].length == 0;
    const lastToPlay = this.#tricks[0].length == 3;

    if (firstToPlay) {
      return TrickEval.Risk;
    }

    if (this.#side == Side.Taker) {
      if (lastToPlay)
        return TrickEval.Safe;

      if (onlyTrump && this.getPetitCard(this.#tricks[0].map(o => o.playedCard)))
        return TrickEval.Aggressive;

      return TrickEval.Risk;
    }

    const takerMove = this.#tricks[0].find(o => o.playerPosition == this.#takerPosition);
    const bro1Move = this.#tricks[0].find(o => o.playerPosition != this.#takerPosition);
    const bro2Move = this.#tricks[0].find(o => o.playerPosition != this.#takerPosition && o.playerPosition != bro1Move?.playerPosition);

    if (takerMove) {
      const takerRank = this.rankNormalized(takerMove.playedCard);
      const bro1Rank = bro1Move ? this.rankNormalized(bro1Move.playedCard) : -1;
      const bro2Rank = bro2Move ? this.rankNormalized(bro2Move.playedCard) : -1;
      const defenseRank = Math.max(bro1Rank, bro2Rank);

      if (defenseRank > takerRank) {
        return TrickEval.Safe;
      }
      else {
        if (onlyTrump) {
          if (takerRank <= 14)
            return TrickEval.Safe;
          if ((bro1Rank > 12 && bro1Rank <= 15) || (bro2Rank > 12 && bro2Rank <= 15))
            return TrickEval.Aggressive;

          return TrickEval.Defensive;
        } else {
          const highestAvailable = this.getHighSuitedCard(playableCards.filter(o => o.suit == takerMove.playedCard.suit));

          if (highestAvailable) {
            if (this.rankNormalized(highestAvailable) > takerRank)
              return TrickEval.Safe;
            else
              return TrickEval.Defensive;
          } else {
            return TrickEval.Defensive;
          }
        }
      }
    } else {
      return TrickEval.Risk;
    }
  }

  /*
    AI UTILS
  */

  private runningTrickSuitedPoints(): number {
    return this.#tricks[0].reduce((acc, current) => {
      if (current.playedCard.suit != Suit.Trump)
        if (current.playedCard.rank > 10)
          return acc + current.playedCard.rank - 9;
      return acc;
    }, 0)
  }

  private getPetitCard(cards: ReadonlyArray<Card>): Card | undefined {
    return cards.find(o => o.suit == Suit.Trump && o.rank == 1);
  }

  private getExcuseCard(cards: ReadonlyArray<Card>): Card | undefined {
    return cards.find(o => o.suit == Suit.Trump && o.rank == 0);
  }

  private getLowTrumpCard(cards: ReadonlyArray<Card>): Card | undefined {
    const processedCards = cards.filter(o => o.suit == Suit.Trump && o.rank > 1);
    processedCards.sort((a, b) => a.rank - b.rank);

    if (processedCards.length)
      return processedCards[0]

    return undefined;
  }

  private getHighTrumpCard(cards: ReadonlyArray<Card>): Card | undefined {
    const processedCards = cards.filter(o => o.suit == Suit.Trump);
    processedCards.sort((a, b) => b.rank - a.rank);

    if (processedCards.length)
      return processedCards[0]

    return undefined;
  }

  private getTopSuitedCard(cards: ReadonlyArray<Card>): Card | undefined {
    let topSuitedCard = undefined as Card | undefined;
    const processedCards = this.shuffleFilterSuitedCards(cards);

    topSuitedCard = processedCards.find(card => {
      let playedRanks = [] as Array<number>;

      this.#tricks.forEach(trick => {
        trick.forEach(o => {
          if (o.playedCard.suit == card.suit)
            playedRanks.push(o.playedCard.rank);
        })
      });

      playedRanks.sort((a, b) => b - a);

      const highestAvailable = playedRanks.reduce((acc, current) => {
        if (current == acc) return acc - 1;
        return acc;
      }, 14)

      if (card.rank == highestAvailable)
        return true;

      return false;
    });

    return topSuitedCard;
  }

  private getHighSuitedCard(cards: ReadonlyArray<Card>): Card | undefined {
    const processedCards = this.shuffleFilterSuitedCards(cards);

    if (processedCards.length)
      return processedCards.sort((a, b) => b.rank - a.rank)[0]
    else
      return undefined;
  }

  private getLowSuitedCard(cards: ReadonlyArray<Card>): Card | undefined {
    const processedCards = this.shuffleFilterSuitedCards(cards);

    if (processedCards.length)
      return processedCards.sort((a, b) => a.rank - b.rank)[0]
    else
      return undefined;
  }

  private shuffleFilterSuitedCards(cards: ReadonlyArray<Card>): Array<Card> {
    return this.shuffleCards(cards.filter(o => o.suit != Suit.Trump));
  }

  private shuffleFilterTrumpCards(cards: ReadonlyArray<Card>): Array<Card> {
    return this.shuffleCards(cards.filter(o => o.suit == Suit.Trump));
  }

  private shuffleCards(cards: ReadonlyArray<Card>): Array<Card> {
    return cards
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  private shuffleSuits(): Array<Suit> {
    return [Suit.Club, Suit.Diamond, Suit.Heart, Suit.Spade]
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  private rankNormalized(card: Card): number {
    return card.suit == Suit.Trump ? card.rank * 15 : card.rank;
  }

  /*
    ACTIONS
  */

  makeBid(validBids: ReadonlyArray<Bid>): Bid {
    return this.thinkBid(validBids);
  }

  callPartner(callableCards: ReadonlyArray<Card>): Card {
    return callableCards[0];
  }

  setAside(discardableCards: DiscardableCards): Array<Card> {
    return this.thinkAside(discardableCards);
  }

  playCard(playableCards: ReadonlyArray<Card>): Card {
    return this.thinkCard(playableCards);
  }

}


