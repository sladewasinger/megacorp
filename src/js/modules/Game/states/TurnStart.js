export class TurnStart {
  constructor() {
    this.name = 'TurnStart';
    this.dice1 = 0;
    this.dice2 = 0;
    this.diceTotal = 0;
    this.doublesInARow = 0;
  }

  onEnter(gameState) {
    console.log('TurnStart');
    this.gameState = gameState;
  }

  onExit() {
    console.log('TurnStart exit');
  }

  rollDice(dice1Override, dice2Override) {
    console.log('rollDice');

    this.dice1 = dice1Override || Math.floor(Math.random() * 6) + 1;
    this.dice2 = dice2Override || Math.floor(Math.random() * 6) + 1;
    this.diceTotal = this.dice1 + this.dice2;

    if (this.dice1 === this.dice2) {
      this.doublesInARow += 1;
    }

    if (this.doublesInARow >= 3) {
      this.doublesInARow = 0;
      return 'jail';
    }

    this.gameState.currentPlayer.position += this.diceTotal;
    if (this.gameState.currentPlayer.position >= this.gameState.tiles.length) {
      this.gameState.currentPlayer.position -= this.gameState.tiles.length;
      this.gameState.currentPlayer.money += 200;
    }

    const tile = this.gameState.tiles[this.gameState.currentPlayer.position];

    return tile;
  }
}
