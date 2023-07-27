import type { Notification } from '../notification';
import type { Room, RoomId } from '../room';
import type { Bid } from '../tarot/bid';
import type { Card } from '../tarot/card';
import type { DiscardableCards } from '../tarot/discardable-cards';
import type { FinishedGameState, GameState, VoidedGameState } from '../tarot/game-state';
import type { MatchState } from '../tarot/match-state';
import type { Player, PlayerPosition } from '../tarot/player';
import type { Profile, User, UserId } from '../user';

export type ListenEvents = {

  'user.session': (user: User, token?: string | null, expires?: string | null) => void;

  'user.ownProfileUpdated': (profile: Profile) => void;

  'user.profileUpdated': (userId: UserId, profile: Profile) => void;

  'room.status': () => void;

  'room.list': (rooms: ReadonlyArray<[RoomId, Room]>) => void;

  'room.created': (room: Room) => void;

  'room.deleted': (roomId: RoomId) => void;

  'room.userJoined': (roomId: RoomId, user: User) => void;

  'room.userLeft': (roomId: RoomId, userId: UserId) => void;

  'room.notification': (notification: Notification) => void;

  'game.playerAdded': (player: Player) => void;

  'game.playerReconnected': (playerPosition: PlayerPosition) => void;

  'game.playerDisconnected': (playerPosition: PlayerPosition) => void;

  'game.handReceived': (hand: Array<Card>) => void;

  'game.petitSec': (playerPosition: PlayerPosition) => void;

  'game.bidding': (playerPosition: PlayerPosition) => void;

  'game.bidRequest': (validBids: ReadonlyArray<Bid>) => void;

  'game.bidRequest.acknowledgment': (bidMade: Bid) => void;

  'game.bidMade': (playerPosition: PlayerPosition, bidMade: Bid) => void;

  'game.newTaker': (takerPosition: PlayerPosition, takerBid: Bid) => void;

  'game.callingPartner': () => void;

  'game.partnerCallRequest': (callableCards: ReadonlyArray<Card>) => void;

  'game.partnerCallRequest.acknowledgment': (calledCard: Card) => void;

  'game.partnerCalled': (calledCard: Card) => void;

  'game.makingAside': (dog: ReadonlyArray<Card>) => void;

  'game.asideRequest': (discardableCards: DiscardableCards) => void;

  'game.asideRequest.acknowledgment': (asideMade: ReadonlyArray<Card>) => void;

  'game.playingCard': (playerPosition: PlayerPosition) => void;

  'game.cardRequest': (playableCards: ReadonlyArray<Card>) => void;

  'game.cardRequest.acknowledgment': (playedCard: Card) => void;

  'game.cardPlayed': (playerPosition: PlayerPosition, playedCard: Card) => void;

  'game.trickWon': (masterPosition: PlayerPosition, foolReceiverPosition?: PlayerPosition | null) => void;

  'game.partnerRevealed': (partnerPosition?: PlayerPosition | null) => void;

  'game.defenderRevealed': (defenderPosition: PlayerPosition) => void;

  'game.voidedGame': (voidedGameState: VoidedGameState, matchState: MatchState) => void;

  'game.finishedGame': (finishedGameState: FinishedGameState, matchState: MatchState) => void;

  'game.state': (gameState: GameState, matchState: MatchState) => void;

};
