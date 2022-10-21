import { Assert } from './Assert.js';
import { Game } from './Game/Game.js';
import { Player } from './Game/Player.js';

export class GameTests {
  constructor() {
  }

  rollDiceTest() {
    const players = [
      new Player('1', 'Player 1'),
      new Player('2', 'Player 2'),
    ];
    const game = new Game(players);
    game.rollDice(1, 3);
    Assert.equal('Go', game.stateMachine.currentState.name);
  }
}
