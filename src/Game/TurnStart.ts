import { GameState } from "./GameState";
import { IState } from "./IState";

export class TurnStart implements IState {
  name: string = 'TurnStart';
  state: any;
  gameState: GameState | null = null;

  onEnter(gameState: GameState) {
    console.log('TurnStart');
    this.gameState = gameState;
  }

  onExit() {
    console.log('TurnStart exit');
  }

  rollDice(dice1Override: number, dice2Override: number): string {
    if (!this.gameState) {
      throw new Error('Game state not set');
    }

    let dice1 = dice1Override || Math.floor(Math.random() * 6) + 1;
    let dice2 = dice2Override || Math.floor(Math.random() * 6) + 1;

    this.gameState.dice1 = dice1;
    this.gameState.dice2 = dice2;

    if (dice1 === dice2) {
      this.gameState.doubleDiceRollCount++;
    }

    this.gameState.currentPlayer.position += dice1 + dice2;
    if (this.gameState.currentPlayer.position >= this.gameState.tiles.length) {
      this.gameState.currentPlayer.position -= this.gameState.tiles.length;
      this.gameState.currentPlayer.money += 200;
    }

    if (this.gameState.doubleDiceRollCount >= 3) {
      this.gameState.doubleDiceRollCount = 0;
      return 'GoToJail';
    }

    const tile = this.gameState.tiles[this.gameState.currentPlayer.position];
    return tile;
  }
}