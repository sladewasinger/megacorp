export class RollDiceState {
  constructor() {
    this.name = 'RollDice';
  }

  onEnter(stateMachine, gameState) {
    console.log(`${this.name} -- enter`);
    this.gameState = gameState;
    this.playerMovementCallbackFn = stateMachine.playerMovementCallbackFn;

    if (this.gameState.currentPlayer.inJail) {
      stateMachine.setState('Jail', gameState);
      return;
    }
  }

  onExit() {
    console.log(`${this.name} -- exit`);
  }

  rollDice(dice1Override, dice2Override) {
    console.log(`-- ${this.name}: rollDice`);

    this.gameState.dice1 = dice1Override || Math.floor(Math.random() * 6) + 1;
    this.gameState.dice2 = dice2Override || Math.floor(Math.random() * 6) + 1;
    const diceTotal = this.gameState.dice1 + this.gameState.dice2;

    this.gameState.currentPlayer.prevPosition = this.gameState.currentPlayer.position;
    this.gameState.currentPlayer.position += diceTotal;

    // get all positions between prev position and current position
    const positions = [];
    for (let i = this.gameState.currentPlayer.prevPosition; i <= this.gameState.currentPlayer.position; i++) {
      positions.push(i % this.gameState.tiles.length); // If we go past 40, wrap around to 0
    }
    this.playerMovementCallbackFn(this.gameState.currentPlayer, positions);

    if (this.gameState.currentPlayer.position >= this.gameState.tiles.length) {
      this.gameState.currentPlayer.position -= this.gameState.tiles.length;
      this.gameState.currentPlayer.money += 200;
    }

    this.gameState.currentPlayer.directMovement = false;

    if (this.gameState.dice1 === this.gameState.dice2) {
      this.gameState.doubleDiceRollCount += 1;
    } else {
      this.gameState.doubleDiceRollCount = 0;
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
