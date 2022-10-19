import { Board } from './Board.js';
import { Player } from './models/Player.js';
import { ColorTile } from './tiles/ColorTile.js';
import { RailroadTile } from './tiles/RailroadTile.js';
import { UtilityTile } from './tiles/UtilityTile.js';

export class Game {
  constructor(players) {
    this.gameState = {
      started: false,
      finished: false,
      diceRoll1: 0,
      diceRoll2: 0,
      players,
    };
    this.board = new Board();
  }

  getGameState(user) {
    const gameState = {
      ...this.gameState,
      players: this.gameState.players.map((player) => ({
        ...player,
      })),
    };

    return gameState;
  }

  startGame() {
    this.gameState.players = this.gameState.players.sort(() => Math.random() - 0.5);
    this.gameState.players.forEach((player) => {
      player.position = 0;
    });
    this.gameState.started = true;
  }

  static createPlayer(name, id) {
    const player = new Player(name, id);
    return player;
  }

  currentPlayer() {
    return this.gameState.players[0];
  }

  rollDice(playerId) {
    const player = this.gameState.players.find((player) => player.id === playerId);
    if (!player) {
      throw new Error('Player not found');
    }
    if (player !== this.currentPlayer()) {
      throw new Error('Not your turn');
    }
    if (player.hasRolledDice) {
      throw new Error('You have already rolled the dice');
    }

    const diceRoll1 = Math.floor(Math.random() * 6) + 1;
    const diceRoll2 = Math.floor(Math.random() * 6) + 1;
    this.gameState.diceRoll1 = diceRoll1;
    this.gameState.diceRoll2 = diceRoll2;

    const diceRoll = diceRoll1 + diceRoll2;

    player.hasRolledDice = true;

    if (diceRoll1 === diceRoll2) {
      player.diceRollsInARow += 1;
      player.hasRolledDice = false; // Player gets another turn
    }

    if (player.diceRollsInARow > 2) {
      player.hasRolledDice = true;
      player.position = 10; // Jail
      player.isInJail = true;
    } else {
      player.position += diceRoll;
      if (player.position >= 40) {
        player.position = 0;
        player.money += 200; // Passed Go
      }
    }

    const propertySpaces = this.board.tiles
      .map((property, index) => {
        property.index = index;
        return property;
      })
      .filter((property) => property instanceof ColorTile ||
        property instanceof RailroadTile ||
        property instanceof UtilityTile);
    if (propertySpaces.some((property) => property.index === player.position)) {
      player.requiresPropertyAction = true;
    }

    return [diceRoll1, diceRoll2];
  }

  endTurn(playerId) {
    const player = this.gameState.players.find((player) => player.id === playerId);
    if (!player) {
      throw new Error('Player not found');
    }
    if (player !== this.currentPlayer()) {
      throw new Error('Not your turn');
    }
    if (!player.hasRolledDice) {
      throw new Error('You have not rolled the dice');
    }
    if (player.requiresPropertyAction) {
      throw new Error('You must take an action on the property you landed on');
    }

    player.hasRolledDice = false;
    this.gameState.players.push(this.gameState.players.shift());
  }

  buyProperty(playerId, tileIndex) {
    const player = this.gameState.players.find((player) => player.id === playerId);
    if (!player) {
      throw new Error('Player not found');
    }
    if (player !== this.currentPlayer()) {
      throw new Error('Not your turn');
    }
    if (!player.hasRolledDice) {
      throw new Error('You have not rolled the dice');
    }

    const property = this.board.tiles.find((property, index) => index === tileIndex);
    if (!property) {
      throw new Error('Property not found');
    }
    if (property.ownerId) {
      throw new Error('Property already owned');
    }
    if (!property.isBuyable) {
      throw new Error('Property not buyable');
    }
    if (player.money < property.price) {
      throw new Error('Not enough money');
    }

    player.requiresPropertyAction = false;
    player.money -= property.price;
    property.ownerId = player.id;
  }
}
