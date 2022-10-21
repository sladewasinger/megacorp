import { Assert } from '../utils/Assert.js';
import { Game } from './Game.js';
import { Player } from './Player.js';

export class GameTests {
  constructor() {
  }

  propertyStateTest() {
    const players = [
      new Player('1', 'Player 1'),
      new Player('2', 'Player 2'),
    ];
    const game = new Game(players);
    game.rollDice(1, 2); // Land on Oriental Avenue
    Assert.equal('Baltic Avenue', game.stateMachine.currentState.name);

    game.buyProperty();
    Assert.equal('TurnEnd', game.stateMachine.currentState.name);
  }

  communityChestTest() {
    const players = [
      new Player('1', 'Player 1'),
      new Player('2', 'Player 2'),
    ];
    const game = new Game(players);
    game.rollDice(-1, 3); // Land on Community Chest
    Assert.equal(players[0], game.gameState.currentPlayer);
    Assert.equal('TurnEnd', game.stateMachine.currentState.name);
  }

  incomeTaxTest() {
    const players = [
      new Player('1', 'Player 1'),
      new Player('2', 'Player 2'),
    ];
    const game = new Game(players);
    game.rollDice(1, 3); // Land on GO
    Assert.equal('TurnEnd', game.stateMachine.currentState.name);
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
    Assert.equal('TurnEnd', game.stateMachine.currentState.name);
  }
}
