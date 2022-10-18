export class Player {
  constructor(name) {
    this.name = name;
    this.money = 1000;
    this.hasRolledDice = false;
    this.id =
      Math
        .random()
        .toString(36)
        .substring(2, 15) +
      Math
        .random()
        .toString(36)
        .substring(2, 15);
  }
}

export class Game {
  constructor(players) {
    this.gameState = {
      players,
    };
  }

  static createPlayer(name) {
    const player = new Player(name);
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
}
