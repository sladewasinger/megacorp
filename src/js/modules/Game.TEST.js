import { Assert } from './utils/Assert.js';
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

  rollDiceTest2() {
    const players = [
      new Player('1', 'Player 1'),
      new Player('2', 'Player 2'),
    ];
    const game = new Game(players);
    game.rollDice(1, 3);
    let exceptionThrown = false;
    try {
      game.rollDice(1, 3);
    } catch (e) {
      exceptionThrown = true;
    }
    Assert.equal(true, exceptionThrown);
    Assert.equal('Go', game.stateMachine.currentState.name);
  }
}
