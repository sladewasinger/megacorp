import { Assert } from '../utils/Assert.js';
import { Game } from './Game.js';
import { Player } from './models/Player.js';

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

  buyPropertyTest() {
    const players = [
      new Player('1', 'Player 1'),
    ];
    const game = new Game(players);
    game.rollDice(1, 2); // Land on Baltic Avenue
    Assert.equal('Baltic Avenue', game.stateMachine.currentState.name);

    game.buyProperty();
    Assert.equal('TurnEnd', game.stateMachine.currentState.name);

    game.endTurn();
    Assert.equal('TurnStart', game.stateMachine.currentState.name);
    Assert.equal(players[0], game.gameState.currentPlayer);
    Assert.equal(1, game.gameState.currentPlayer.properties.length);

    game.rollDice(1, 39); // Land on same property
    Assert.equal('TurnEnd', game.stateMachine.currentState.name);
  }

  landOnOwnedPropertyTest() {
    const player1 = new Player('1', 'Player 1');
    const player2 = new Player('2', 'Player 2');
    const players = [
      player1,
      player2,
    ];
    const game = new Game(players);
    game.rollDice(1, 2); // Land on Baltic Avenue
    Assert.equal('Baltic Avenue', game.stateMachine.currentState.name);

    game.buyProperty();
    Assert.equal(1, game.gameState.currentPlayer.properties.length);
    Assert.equal('TurnEnd', game.stateMachine.currentState.name);

    game.endTurn();
    Assert.equal('TurnStart', game.stateMachine.currentState.name);
    Assert.equal(player2, game.gameState.currentPlayer);

    const player2Money = player2.money;
    game.rollDice(1, 2); // Land on Baltic Avenue
    Assert.equal('TurnEnd', game.stateMachine.currentState.name);
    Assert.equal(player2, game.gameState.currentPlayer);
    Assert.equal(player2Money - game.stateMachine.states[game.gameState.tiles[3]].rent, player2.money);
  }

  passGoTest() {
    const players = [
      new Player('1', 'Player 1'),
      new Player('2', 'Player 2'),
    ];
    const player1money = players[0].money;
    const game = new Game(players);
    game.rollDice(1, 40); // Pass GO
    Assert.equal('Mediterranean Avenue', game.stateMachine.currentState.name);
    Assert.equal(player1money + 200, game.gameState.currentPlayer.money);
  }

  goToJailForSpeedingTest() {
    const player = new Player('1', 'Player 1');
    const game = new Game([player]);
    game.rollDice(5, 5);
    game.endTurn();
    game.rollDice(5, 5);
    game.endTurn();
    game.rollDice(3, 3);
    Assert.equal('TurnEnd', game.stateMachine.currentState.name);
    Assert.true(game.gameState.currentPlayer.inJail);
  }

  goToJailTest_payFine() {
    const players = [
      new Player('1', 'Player 1'),
    ];
    const game = new Game(players);
    game.rollDice(1, 29); // Go to Jail
    Assert.equal('TurnEnd', game.stateMachine.currentState.name);
    Assert.true(game.gameState.currentPlayer.inJail);

    game.endTurn();
    Assert.equal('JailDecision', game.stateMachine.currentState.name);

    game.rollDice(1, 2); // Fail to roll doubles
    Assert.equal('TurnEnd', game.stateMachine.currentState.name);

    game.endTurn();
    Assert.equal('JailDecision', game.stateMachine.currentState.name);
    Assert.equal(players[0], game.gameState.currentPlayer);
    Assert.true(game.gameState.currentPlayer.inJail);

    game.rollDice(1, 2); // Fail to roll doubles
    Assert.equal('TurnEnd', game.stateMachine.currentState.name);

    game.endTurn();
    Assert.equal('JailDecision', game.stateMachine.currentState.name);
    Assert.equal(players[0], game.gameState.currentPlayer);
    Assert.true(game.gameState.currentPlayer.inJail);

    const player1Money = players[0].money;
    game.rollDice(1, 2); // Fail to roll doubles for final time - move player out of jail
    Assert.equal('States Avenue', game.stateMachine.currentState.name);
    Assert.equal(player1Money - game.stateMachine.states['JailDecision'].exitJailFine, players[0].money);
    Assert.false(game.gameState.currentPlayer.inJail);
  }

  goToJailTest_rollDoubles() {
    const players = [
      new Player('1', 'Player 1'),
    ];
    const game = new Game(players);
    game.rollDice(1, 29); // Go to Jail
    Assert.equal('TurnEnd', game.stateMachine.currentState.name);
    Assert.true(game.gameState.currentPlayer.inJail);

    game.endTurn();
    Assert.equal('JailDecision', game.stateMachine.currentState.name);

    game.rollDice(1, 2); // Fail to roll doubles
    Assert.equal('TurnEnd', game.stateMachine.currentState.name);

    game.endTurn();
    Assert.equal('JailDecision', game.stateMachine.currentState.name);
    Assert.equal(players[0], game.gameState.currentPlayer);
    Assert.true(game.gameState.currentPlayer.inJail);

    game.rollDice(1, 2); // Fail to roll doubles
    Assert.equal('TurnEnd', game.stateMachine.currentState.name);

    game.endTurn();
    Assert.equal('JailDecision', game.stateMachine.currentState.name);
    Assert.equal(players[0], game.gameState.currentPlayer);
    Assert.true(game.gameState.currentPlayer.inJail);

    const player1Money = players[0].money;
    game.rollDice(2, 2); // Successfully roll doubles - move player out of jail
    Assert.equal('Virginia Avenue', game.stateMachine.currentState.name);
    Assert.equal(player1Money, players[0].money);
    Assert.false(game.gameState.currentPlayer.inJail);
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
