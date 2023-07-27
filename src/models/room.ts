import type { User, UserId } from './user';

export type RoomId = string;

export type RoomName = string;

export type Room = {
  id: RoomId;
  name: RoomName;
  isSecure: boolean;
  users: Array<[UserId, User]>;
};
