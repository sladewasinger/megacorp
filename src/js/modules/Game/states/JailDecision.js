export class JailDecision {
  constructor() {
    this.name = 'JailDecision';
    this.exitJailFine = 100;
  }

  onEnter(stateMachine, gameState) {
    console.log('JailDecision');
    this.gameState = gameState;

    if (stateMachine.previousState.name == 'Go To Jail') {
      stateMachine.setState('TurnEnd', gameState);
    }
  }

  onExit() {
    console.log('JailDecision exit');
  }

  payFine() {
    if (!this.gameState) {
      throw new Error('Game state not set');
    }

    console.log('payFine');

    this.gameState.currentPlayer.money -= this.exitJailFine;
    this.gameState.currentPlayer.jailTurns = 0;
    return 'TurnEnd';
  }

  useCard() {
    if (!this.gameState) {
      throw new Error('Game state not set');
    }

    console.log('useCard');

    this.gameState.currentPlayer.getOutOfJailFreeCards--;
    this.gameState.currentPlayer.jailTurns = 0;
    return 'TurnEnd';
  }

  rollDice(dice1override, dice2override) {
    if (!this.gameState) {
      throw new Error('Game state not set');
    }

    this.gameState.currentPlayer.jailTurns--;

    console.log(`--${this.name}: rollDice`);

    this.gameState.dice1 = dice1override || Math.floor(Math.random() * 6) + 1;
    this.gameState.dice2 = dice2override || Math.floor(Math.random() * 6) + 1;
    const diceTotal = this.gameState.dice1 + this.gameState.dice2;

    if (this.gameState.doubleDiceRoll || this.gameState.currentPlayer.jailTurns <= 0) {
      if (!this.gameState.doubleDiceRoll) {
        console.log('Auto paying jail fine');
        this.gameState.currentPlayer.money -= this.exitJailFine;
      } else {
        console.log('Rolled doubles -- exiting jail');
      }

      this.gameState.currentPlayer.jailTurns = 3;
      this.gameState.currentPlayer.inJail = false;
      this.gameState.currentPlayer.prevPosition = this.gameState.currentPlayer.position;
      this.gameState.currentPlayer.position += diceTotal;

      if (this.gameState.currentPlayer.position >= this.gameState.tiles.length) {
        this.gameState.currentPlayer.position -= this.gameState.tiles.length;
        this.gameState.currentPlayer.money += 200;
      }

      const tile = this.gameState.tiles[this.gameState.currentPlayer.position];
      return tile;
    }

    return 'TurnEnd';
  }
}
