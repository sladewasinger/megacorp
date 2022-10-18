import { Game } from './Game/Game.js';

export class Assert {
  static equal(actual, expected) {
    if (actual !== expected) {
      console.error('\nAssert.equal failed');
      console.error('Expected:\n', expected, '\nActual:\n', actual);
      throw new Error(`Expected\n ${JSON.stringify(expected)}\n but got\n ${JSON.stringify(actual)}`);
    }
  }
}

export class GameTester {
  constructor() {
  }

  rollDiceTest() {
    const player1 = Game.createPlayer('Player 1');
    const player2 = Game.createPlayer('Player 2');
    this.game = new Game([player1, player2]);

    Assert.equal(this.game.currentPlayer(), player1);
    this.game.rollDice(player1.id);
    this.game.endTurn(player1.id);

    Assert.equal(this.game.currentPlayer(), player2);
    this.game.rollDice(player2.id);
    // this.game.endTurn(player2.id);

    Assert.equal(this.game.currentPlayer(), player1);
  }
}
