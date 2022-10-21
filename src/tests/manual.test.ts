import { Game } from "../Game/Game";
import { Player } from "../Game/Player";

const players = [
  new Player('1', 'Player 1'),
  new Player('2', 'Player 2'),
];
const game = new Game(players);
game.rollDice(1, 1);
console.log(game.stateMachine.currentState.name);
