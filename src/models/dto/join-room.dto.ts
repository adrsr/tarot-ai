import { RoomId } from '../room';
import type { AuthenticateUserDto } from './authenticate-user.dto';

export type JoinRoomDto = AuthenticateUserDto & {
  roomId: RoomId;
  roomPassword?: string;
};
