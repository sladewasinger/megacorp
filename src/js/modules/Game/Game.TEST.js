import { Assert } from '../utils/Assert.js';
import { Game } from './Game.js';
import { AdvanceToGo } from './models/communityChestCards/AdvanceToGo.js';
import { BankErrorInYourFavor } from './models/communityChestCards/BankErrorInYourFavor.js';
import { Player } from './models/Player.js';

export default class GameTests {
  endTurnTest() {
    const player1 = new Player('1', 'Player 1');
    const player2 = new Player('2', 'Player 2');

    const game = new Game([player1, player2]);
    game.rollDice(1, 3); // Land on Income Tax
    Assert.equal('TurnEnd', game.stateMachine.currentState.name);

    game.endTurn();
    Assert.equal('RollDice', game.stateMachine.currentState.name);
    Assert.equal(player2, game.gameState.currentPlayer);
  }


  tradePropertyTeset() {
    const players = [
      new Player('1', 'Player 1'),
      new Player('2', 'Player 2'),
    ];
    const game = new Game(players);
    game.rollDice(1, 2); // Land on Baltic Avenue
    Assert.equal('Baltic Avenue', game.stateMachine.currentState.name);
    game.buyProperty();

    game.createTrade(players[0], {
      targetPlayerId: players[1].id,
      authorPlayerId: players[0].id,
      offer: {
        properties: [game.stateMachine.getStates().find((tile) => tile.name === 'Baltic Avenue').id],
        money: 0,
      },
      request: {
        properties: [],
        money: 120,
      },
    });
    game.acceptTrade(game.gameState.trades[0].id);
    Assert.equal(0, game.gameState.trades.length);
    Assert.equal(0, players[0].properties.length);
    Assert.equal(1, players[1].properties.length);
  }

  buyPropertyTest() {
    const players = [
      new Player('1', 'Player 1'),
    ];
    const game = new Game(players);
    game.rollDice(1, 2); // Land on Baltic Avenue
    Assert.equal('Baltic Avenue', game.stateMachine.currentState.name);
    const cost = game.stateMachine.currentState.cost;
    const player1money = players[0].money;
    game.buyProperty();
    Assert.equal('TurnEnd', game.stateMachine.currentState.name);
    Assert.equal(player1money - cost, players[0].money);

    game.endTurn();
    Assert.equal('RollDice', game.stateMachine.currentState.name);
    Assert.equal(players[0], game.gameState.currentPlayer);
    Assert.equal(1, game.stateMachine.getStates().filter((tile) => tile.owner === players[0]).length);

    game.rollDice(1, 39); // Land on same property
    Assert.equal('TurnEnd', game.stateMachine.currentState.name);
  }

  buyRailroadTest() {
    const players = [
      new Player('1', 'Player 1'),
    ];
    const game = new Game(players);
    game.rollDice(1, 4);
    Assert.equal('Reading Railroad', game.stateMachine.currentState.name);
    const cost = game.stateMachine.currentState.cost;
    const player1money = players[0].money;
    game.buyProperty();
    Assert.equal('TurnEnd', game.stateMachine.currentState.name);
    Assert.equal(player1money - cost, players[0].money);

    game.endTurn();
    Assert.equal('RollDice', game.stateMachine.currentState.name);
    Assert.equal(players[0], game.gameState.currentPlayer);
    Assert.equal(1, game.stateMachine.getStates().filter((tile) => tile.owner === players[0]).length);

    game.rollDice(1, 39); // Land on same property
    Assert.equal('TurnEnd', game.stateMachine.currentState.name);
  }

  buyUtilityTest() {
    const players = [
      new Player('1', 'Player 1'),
    ];
    const game = new Game(players);
    game.rollDice(1, 11); // Land on Electric Company
    Assert.equal('Electric Company', game.stateMachine.currentState.name);
    const cost = game.stateMachine.currentState.cost;
    const player1money = players[0].money;
    game.buyProperty();
    Assert.equal('TurnEnd', game.stateMachine.currentState.name);
    Assert.equal(player1money - cost, players[0].money);

    game.endTurn();
    Assert.equal('RollDice', game.stateMachine.currentState.name);
    Assert.equal(players[0], game.gameState.currentPlayer);
    Assert.equal(1, game.stateMachine.getStates().filter((tile) => tile.owner === players[0]).length);

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
    Assert.equal(1, game.stateMachine.getStates().filter((tile) => tile.owner === player1).length);
    Assert.equal('TurnEnd', game.stateMachine.currentState.name);

    game.endTurn();
    Assert.equal('RollDice', game.stateMachine.currentState.name);
    Assert.equal(player2, game.gameState.currentPlayer);

    const player2Money = player2.money;
    game.rollDice(1, 2); // Land on Baltic Avenue
    Assert.equal('TurnEnd', game.stateMachine.currentState.name);
    Assert.equal(player2, game.gameState.currentPlayer);
    Assert.equal(player2Money - game.stateMachine.states[game.gameState.tiles[3]].rent, player2.money);
  }

  landOnOtherPlayerOwnedRailroadTest() {
    const player1 = new Player('1', 'Player 1');
    const player2 = new Player('2', 'Player 2');
    const players = [
      player1,
      player2,
    ];
    const game = new Game(players);
    game.rollDice(1, 4); // Land on Reading Railroad
    Assert.equal('Reading Railroad', game.stateMachine.currentState.name);

    game.buyProperty();
    Assert.equal(1, game.stateMachine.getStates().filter((tile) => tile.owner === player1).length);
    Assert.equal('TurnEnd', game.stateMachine.currentState.name);

    game.endTurn();
    Assert.equal('RollDice', game.stateMachine.currentState.name);
    Assert.equal(player2, game.gameState.currentPlayer);

    const player2Money = player2.money;
    game.rollDice(1, 4); // Land on Reading Railroad
    Assert.equal('TurnEnd', game.stateMachine.currentState.name);
    Assert.equal(player2, game.gameState.currentPlayer);
    Assert.equal(player2Money - game.stateMachine.states[game.gameState.tiles[5]].rent, player2.money);
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
    game.rollDice(5, 5);
    game.rollDice(5, 5);
    Assert.equal('TurnEnd', game.stateMachine.currentState.name);
    Assert.true(game.gameState.currentPlayer.inJail);
    game.endTurn();
    Assert.equal('JailDecision', game.stateMachine.currentState.name);
    game.rollDice(3, 3);
    Assert.equal('St. James Place', game.stateMachine.currentState.name);
    Assert.false(game.gameState.currentPlayer.inJail);
    game.buyProperty();
    game.rollDice(1, 2);
    Assert.equal('New York Avenue', game.stateMachine.currentState.name);
    game.buyProperty();
    Assert.equal('TurnEnd', game.stateMachine.currentState.name);
    game.endTurn();
    game.rollDice(1, 2);
    Assert.equal('TurnEnd', game.stateMachine.currentState.name);
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

  communityChest_AdvanceToGo_Test() {
    const players = [
      new Player('1', 'Player 1'),
      new Player('2', 'Player 2'),
    ];
    const game = new Game(players);
    const advanceToGo = new AdvanceToGo();
    game.gameState.communityChestDeck.cards = [
      advanceToGo,
    ];

    game.rollDice(-1, 3); // Land on 1st Community Chest

    Assert.equal(players[0], game.gameState.currentPlayer);
    Assert.equal('TurnEnd', game.stateMachine.currentState.name);

    Assert.equal(advanceToGo.name, game.gameState.communityChestCard.name);
    Assert.equal(advanceToGo.msg, game.gameState.communityChestCard.msg);
    Assert.equal(0, game.gameState.currentPlayer.position);
  }

  communityChest_BankErrorInYourFavor_Test() {
    const players = [
      new Player('1', 'Player 1'),
      new Player('2', 'Player 2'),
    ];
    const game = new Game(players);
    const bankError = new BankErrorInYourFavor();
    game.gameState.communityChestDeck.cards = [
      bankError,
    ];
    const player1money = players[0].money;

    game.rollDice(-1, 3); // Land on 1st Community Chest

    Assert.equal(players[0], game.gameState.currentPlayer);
    Assert.equal('TurnEnd', game.stateMachine.currentState.name);

    Assert.equal(bankError.name, game.gameState.communityChestCard.name);
    Assert.equal(bankError.msg, game.gameState.communityChestCard.msg);
    Assert.equal(player1money + 200, game.gameState.currentPlayer.money);
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
