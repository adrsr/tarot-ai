import type { Avatar } from '../user';

export type AuthenticateUserDto = {
  userPseudo: string;
  userAvatar: Avatar;
};
