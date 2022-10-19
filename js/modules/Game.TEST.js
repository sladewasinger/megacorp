import { Game } from './Game/Game.js';

export class Assert {
  static equal(actual, expected) {
    if (actual !== expected) {
      console.error('\nAssert.equal failed');
      console.error('Expected:\n', expected, '\nActual:\n', actual);
      throw new Error(`Expected\n ${JSON.stringify(expected)}\n but got\n ${JSON.stringify(actual)}`);
    }
  }

  static notEqual(actual, expected) {
    if (actual === expected) {
      console.error('\nAssert.notEqual failed');
      console.error('Expected:\n', expected, '\nActual:\n', actual);
      throw new Error(`Expected\n ${JSON.stringify(expected)}\n but got\n ${JSON.stringify(actual)}`);
    }
  }

  static notNull(actual) {
    if (actual === null || actual === undefined) {
      console.error('\nAssert.notNull failed');
      console.error('Expected:\n', 'not null', '\nActual:\n', actual);
      throw new Error(`Expected\n not null\n but got\n ${JSON.stringify(actual)}`);
    }
  }
}

export class GameTests {
  constructor() {
  }

  rollDiceTest() {
    const player1 = Game.createPlayer('Player 1');
    const player2 = Game.createPlayer('Player 2');
    const game = new Game([player1, player2]);

    game.rollDice(player1.id);

    Assert.equal(player1.hasRolledDice, true);
    Assert.equal(game.currentPlayer(), player1);
  }

  endTurnTest() {
    const player1 = Game.createPlayer('Player 1');
    const player2 = Game.createPlayer('Player 2');
    this.game = new Game([player1, player2]);
    Assert.equal(this.game.currentPlayer(), player1);

    const [diceRoll1, diceRoll2] = this.game.rollDice(player1.id);
    while (diceRoll1 === diceRoll2) {
      this.game.rollDice(player1.id);
    }
    if (player1.requiresPropertyAction) {
      this.game.buyProperty(player1.id, player1.position);
    }
    this.game.endTurn(player1.id);
    Assert.equal(this.game.currentPlayer(), player2);
    Assert.equal(player1.hasRolledDice, false);
  }

  startGameTest() {
    const player1 = Game.createPlayer('Player 1');
    const player2 = Game.createPlayer('Player 2');
    const game = new Game([player1, player2]);

    game.startGame();
    Assert.equal(game.getGameState().started, true);
    Assert.equal(game.getGameState().players.length, 2);
    Assert.notNull(game.currentPlayer());
  }

  // integration_startGameAndRollDiceTest() {
  //   const player1 = Game.createPlayer('Player 1');
  //   const player2 = Game.createPlayer('Player 2');
  //   const game = new Game([player1, player2]);

  //   game.startGame();
  //   let currentPlayer = game.currentPlayer();
  //   game.rollDice(currentPlayer.id);
  //   Assert.equal(currentPlayer.hasRolledDice, true);
  //   game.endTurn(currentPlayer.id);
  //   Assert.equal(currentPlayer.hasRolledDice, false);
  //   Assert.notEqual(game.currentPlayer(), currentPlayer);
  //   currentPlayer = game.currentPlayer();
  //   game.rollDice(currentPlayer.id);
  //   Assert.equal(currentPlayer.hasRolledDice, true);
  //   game.endTurn(currentPlayer.id);
  //   Assert.equal(currentPlayer.hasRolledDice, false);
  //   Assert.notEqual(game.currentPlayer(), currentPlayer);
  // }
}
