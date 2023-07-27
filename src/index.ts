import { Game } from './game';

const game = new Game();

game.start();
process.on('SIGINT', async () => {
  game.stop();
});
