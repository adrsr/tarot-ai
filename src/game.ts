import { ArtificialIntelligence } from './artificial-intelligence';
import { Client } from './client';
import { RoomSettings } from './models/dto/create-room.dto';
import { WinConditionType } from './models/tarot/win-condition';

export class Game {

  private readonly client = new Client({
    userPseudo: 'Tarot Bot',
    userAvatar: 'bee',
  });

  private readonly roomSettings: RoomSettings = {
    roomId: 'ai-test',
    roomName: 'AI Test',
    roomPassword: 'AI Password',
    gameSize: 4,
    gameWinConditionValue: 1,
    gameWinConditionType: WinConditionType.GamesPlayed,
  };

  private readonly artificialIntelligence = new ArtificialIntelligence();

  async start(): Promise<void> {
    await this.client.createOrJoinRoom(this.roomSettings);

    this.client.socket.on('game.state', (state) => {
      console.log('Ready to start the game');
      console.log(`You are at the position ${state.ownPosition}`);
    });

    this.client.socket.on('game.handReceived', (hand) => {
      console.log('New distribution');
      console.log(hand);
    });

    this.client.socket.on('game.newTaker', (takerPosition) => {
      console.log('Game started');
      console.log(`Taker is at position ${takerPosition}`);
    });

    this.client.socket.on('game.cardPlayed', (playerPosition, playedCard) => {
      console.log(`Player at position ${playerPosition} played ${JSON.stringify(playedCard)}`);
    });

    this.client.socket.on('game.trickWon', (playerPosition) => {
      console.log(`Player at position ${playerPosition} won the trick`);
    });

    this.client.socket.on('game.finishedGame', (finishedGameState, matchState) => {
      console.log('Game finished');
      console.log(finishedGameState.scoringResult);

      // The match cannot end in a draw, a new game will be started until a clear winner emerges
      if (matchState.winnerPosition != null) {
        console.log(`The winner of the match is at position ${matchState.winnerPosition}`);
      }
    });

    this.client.socket.on('game.voidedGame', () => {
      console.log('Game voided: all players passed');
    });

    this.client.socket.on('game.bidRequest', (validBids) => {
      this.client.socket.emit('game.makeBid', this.artificialIntelligence.makeBid(validBids));
    });

    this.client.socket.on('game.partnerCallRequest', (callableCards) => {
      this.client.socket.emit('game.callPartner', this.artificialIntelligence.callPartner(callableCards));
    });

    this.client.socket.on('game.asideRequest', (discardableCards) => {
      this.client.socket.emit('game.setAside', this.artificialIntelligence.setAside(discardableCards));
    });

    this.client.socket.on('game.cardRequest', (playableCards) => {
      this.client.socket.emit('game.playCard', this.artificialIntelligence.playCard(playableCards));
    });
  }

  stop(): void {
    this.client.socket.close();
  }

}
