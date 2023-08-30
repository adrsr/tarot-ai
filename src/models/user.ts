export const AVATARS = [
  'bee',
  'beef',
  'bird',
  'blowfish',
  'boar',
  'buffalo',
  'cat',
  'caterpillar',
  'chick',
  'chicken',
  'chipmunk',
  'cow',
  'crocodile',
  'dog',
  'dolphin',
  'hatching-chick',
  'koala',
  'ladybug',
  'leopard',
  'monkey',
  'mouse-bis',
  'mouse',
  'octopus',
  'owl',
  'penguin',
  'pig',
  'poodle',
  'rabbit',
  'rooster',
  'scorpion',
  'sheep',
  'shrimp',
  'snail',
  'spider',
  'spouting-whale',
  'tiger',
  'tropical-fish',
  'turkey',
  'turtle',
  'unicorn',
  'robot',
  'robot-bis',
] as const;

export type Avatar = typeof AVATARS[number];

export type UserId = string;

export type Profile = {
  pseudo: string;
  avatar: Avatar;
};

export type User = {
  id: UserId;
  profile?: Profile;
};
