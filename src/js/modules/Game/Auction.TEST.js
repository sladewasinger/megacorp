import { Assert } from '../utils/Assert.js';
import { Game } from './Game.js';
import { Player } from './models/Player.js';

export default class AuctionTests {
  beginAuctionTest() {
    const player1 = new Player('1', 'Player 1');
    const player2 = new Player('2', 'Player 2');

    const game = new Game([player1, player2]);
    game.rollDice(1, 2);
    Assert.equal('Baltic Avenue', game.stateMachine.currentState.name);
    game.auctionProperty();
    Assert.equal('Auction', game.stateMachine.currentState.name);
    game.bid('1', 100);
    Assert.equal('Auction', game.stateMachine.currentState.name);
    game.bid('2', 200);
    Assert.equal('TurnEnd', game.stateMachine.currentState.name);
    Assert.equal(1, player2.properties.length);
  }

  auctionTieBidTest() {
    const player1 = new Player('1', 'Player 1');
    const player2 = new Player('2', 'Player 2');

    const game = new Game([player1, player2]);
    game.rollDice(1, 2);
    Assert.equal('Baltic Avenue', game.stateMachine.currentState.name);
    game.auctionProperty();
    Assert.equal('Auction', game.stateMachine.currentState.name);
    game.bid('1', 100);
    Assert.equal('Auction', game.stateMachine.currentState.name);
    game.bid('2', 100);
    Assert.equal('TurnEnd', game.stateMachine.currentState.name);
    Assert.equal(1, player1.properties.length);
  }

  beginAuctionTest_1bankruptPlayer() {
    const player1 = new Player('1', 'Player 1');
    const player2 = new Player('2', 'Player 2');
    const player3 = new Player('3', 'Player 3');
    player3.money = 0;

    const game = new Game([player1, player2, player3]);
    game.rollDice(1, 2);
    Assert.equal('Baltic Avenue', game.stateMachine.currentState.name);
    game.auctionProperty();
    Assert.equal('Auction', game.stateMachine.currentState.name);
    game.bid('1', 100);
    Assert.equal('Auction', game.stateMachine.currentState.name);
    game.bid('2', 200);
    Assert.equal('TurnEnd', game.stateMachine.currentState.name);
    Assert.equal(1, player2.properties.length);
  }
}
