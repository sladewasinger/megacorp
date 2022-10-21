import { Assert } from '../utils/Assert.js';
import { Game } from './Game.js';
import { Player } from './Player.js';

export default class GameTests {
  endTurnTest() {
    const player1 = new Player('1', 'Player 1');
    const player2 = new Player('2', 'Player 2');

    const game = new Game([player1, player2]);
    game.rollDice(1, 3); // Land on Income Tax
    Assert.equal('TurnEnd', game.stateMachine.currentState.name);

    game.endTurn();
    Assert.equal('TurnStart', game.stateMachine.currentState.name);
    Assert.equal(player2, game.gameState.currentPlayer);
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
    game.rollDice(-1, 3); // Land on 1st Community Chest
    Assert.equal(players[0], game.gameState.currentPlayer);
    Assert.equal('TurnEnd', game.stateMachine.currentState.name);
    // First card is Advance to Go
    Assert.equal('Advance to Go', game.gameState.communityChestMessage);
    Assert.equal(0, game.gameState.currentPlayer.position);
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
}
