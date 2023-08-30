import { ArtificialIntelligence } from './ai';
import { Client } from './client';
import { RoomSettings } from './models/dto/create-room.dto';
import { GameSize } from './models/tarot/game-state';
import { WinConditionType } from './models/tarot/win-condition';
import { Avatar } from './models/user';

export class Game {

  #gameSize: GameSize = 4;

  private readonly client = new Client({
    userPseudo: 'Tarot Bro',
    userAvatar: ['robot', 'robot-bis'].map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value)[0] as Avatar,
  });

  private readonly roomSettings: RoomSettings = {
    roomId: 'ai-test-empty',
    roomName: 'AI Test Empty',
    roomPassword: 'AI Password',
    gameSize: this.#gameSize,
    gameWinConditionValue: 10,
    gameWinConditionType: WinConditionType.GamesPlayed,
  };

  private readonly ai = new ArtificialIntelligence();

  async start(): Promise<void> {
    await this.client.createOrJoinRoom(this.roomSettings);

    /*
      ON
    */

    this.client.socket.on('game.state', (state) => {
      if (state.ownPosition)
        this.ai.position = state.ownPosition;
    });

    this.client.socket.on('game.handReceived', (hand) => {
      this.ai.hand = hand;
    });

    this.client.socket.on('game.newTaker', (takerPosition) => {
      this.ai.takerPosition = takerPosition;
    });

    this.client.socket.on('game.cardPlayed', (playerPosition, playedCard) => {
      this.ai.playedCard = { playerPosition, playedCard };
    });

    /*
      EMIT
    */

    this.client.socket.on('game.bidRequest', (validBids) => {
      this.client.socket.emit('game.makeBid', this.ai.makeBid(validBids));
    });

    this.client.socket.on('game.partnerCallRequest', (callableCards) => {
      this.client.socket.emit('game.callPartner', this.ai.callPartner(callableCards));
    });

    this.client.socket.on('game.asideRequest', (discardableCards) => {
      this.client.socket.emit('game.setAside', this.ai.setAside(discardableCards));
    });

    this.client.socket.on('game.cardRequest', (playableCards) => {
      this.client.socket.emit('game.playCard', this.ai.playCard(playableCards));
    });
  }

  stop(): void {
    this.client.socket.close();
  }

}
