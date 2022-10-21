import { IState } from './State.js';

export class TurnStart extends IState {
  constructor() {
    super();

    this.transitions = {
      rollDice: this.rollDice,
    };
    this.state = {
      dice1: 0,
      dice2: 0,
      diceTotal: 0,
      doublesInARow: 0,
    };
  }

  get name() {
    return 'TurnStart';
  }

  onEnter(gameState) {
    super.onEnter(gameState);
    console.log('TurnStart');
  }

  onExit() {
    super.onExit();
    console.log('TurnStart exit');
  }

  rollDice(dice1Override, dice2Override) {
    console.log('rollDice');

    this.dice1 = dice1Override || Math.floor(Math.random() * 6) + 1;
    this.dice2 = dice2Override || Math.floor(Math.random() * 6) + 1;
    this.diceTotal = this.dice1 + this.dice2;

    if (dice1 === dice2) {
      this.state.doublesInARow += 1;
    }

    if (this.state.doublesInARow >= 3) {
      this.state.doublesInARow = 0;
      return 'jail';
    }

    this.gameState.currentPlayer.position += this.state.diceTotal;
    if (this.gameState.currentPlayer.position >= 40) {
      this.gameState.currentPlayer.position -= 40;
      this.gameState.currentPlayer.money += 200;
    }

    const tile = this.gameState.board.tiles[this.gameState.currentPlayer.position];

    return tile.name;
  }
}
