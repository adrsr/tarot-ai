import type { GameSize } from '../tarot/game-state';
import { RoomId, RoomName } from '../room';
import type { AuthenticateUserDto } from './authenticate-user.dto';
import { WinConditionType } from '../tarot/win-condition';

export type RoomDto = {
  roomName: RoomName;
  roomPassword?: string;
  gameSize: GameSize;
  gameWinConditionValue?: number;
  gameWinConditionType?: WinConditionType;
};

export type RoomSettings = RoomDto & {
  roomId: RoomId;
};

export type CreateRoomDto = AuthenticateUserDto & RoomDto;
