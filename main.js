import { Game } from './src/game.js';

const game = new Game();
game.init();

document.getElementById('restart').addEventListener('click', () => {
    location.reload();
});