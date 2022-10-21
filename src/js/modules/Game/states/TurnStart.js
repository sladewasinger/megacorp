export class TurnStart {
  constructor() {
    this.name = 'TurnStart';
  }

  onEnter(stateMachine, gameState) {
    console.log('TurnStart');
    this.gameState = gameState;

    if (this.gameState.currentPlayer.inJail) {
      stateMachine.setState('Jail', gameState);
      return;
    }
  }

  onExit() {
    console.log('TurnStart exit');
  }

  rollDice(dice1Override, dice2Override) {
    console.log(`-- ${this.name}: rollDice`);

    this.gameState.dice1 = dice1Override || Math.floor(Math.random() * 6) + 1;
    this.gameState.dice2 = dice2Override || Math.floor(Math.random() * 6) + 1;
    const diceTotal = this.gameState.dice1 + this.gameState.dice2;

    this.gameState.currentPlayer.prevPosition = this.gameState.currentPlayer.position;
    this.gameState.currentPlayer.position += diceTotal;

    if (this.gameState.dice1 === this.gameState.dice2) {
      this.gameState.doubleDiceRollCount += 1;
    }

    if (this.gameState.doubleDiceRollCount >= 3) {
      this.gameState.doubleDiceRollCount = 0;
      return 'Go To Jail';
    }

    if (this.gameState.currentPlayer.position >= this.gameState.tiles.length) {
      this.gameState.currentPlayer.position -= this.gameState.tiles.length;
      this.gameState.currentPlayer.money += 200;
    }

    const tile = this.gameState.tiles[this.gameState.currentPlayer.position];
    return tile;
  }
}
