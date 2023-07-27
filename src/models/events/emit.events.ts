import type { CreateRoomDto } from '../dto/create-room.dto';
import type { JoinRoomDto } from '../dto/join-room.dto';
import type { Room } from '../room';
import type { AuthenticateUserDto } from '../dto/authenticate-user.dto';
import type { Bid } from '../tarot/bid';
import type { Card } from '../tarot/card';
import { Acknowledge } from './events';

export type EmitEvents = {

  'user.updateProfile': (authenticateUserDto: AuthenticateUserDto, callback?: Acknowledge<void>) => void;

  'room.create': (createRoomDto: CreateRoomDto, callback?: Acknowledge<Room>) => void;

  'room.join': (joinRoomDto: JoinRoomDto, callback?: Acknowledge<void>) => void;

  'room.leave': (callback?: Acknowledge<void>) => void;

  'room.message': (message: string, callback?: Acknowledge<void>) => void;

  'game.addBot': (callback?: Acknowledge<void>) => void;

  'game.makeBid': (bid: Bid, callback?: Acknowledge<void>) => void;

  'game.callPartner': (card: Card, callback?: Acknowledge<void>) => void;

  'game.setAside': (aside: ReadonlyArray<Card>, callback?: Acknowledge<void>) => void;

  'game.playCard': (card: Card, callback?: Acknowledge<void>) => void;

};
