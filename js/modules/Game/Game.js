import { Board } from './Board.js';
import { Player } from './models/Player.js';

export class Game {
  constructor(players) {
    this.gameState = {
      started: false,
      finished: false,
      players,
    };
    this.board = new Board();
  }

  getGameState(user) {
    const gameState = {
      ...this.gameState,
      players: this.gameState.players.map((player) => ({
        name: player.name,
        money: player.money,
        position: player.position,
        id: player.id,
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

    player.hasRolledDice = true;

    const diceRoll = Math.floor(Math.random() * 6) + 1;
    player.position += diceRoll;
    if (player.position >= 40) {
      player.position = 0;
      player.money += 200;
    }
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

    player.hasRolledDice = false;
    this.gameState.players.push(this.gameState.players.shift());
  }

  buyProperty(playerId, propertyId) {
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

    const property = this.board.properties.find((property) => property.id === propertyId);
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

    player.money -= property.price;
    property.ownerId = player.id;
  }
}
