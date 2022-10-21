import { GameState } from "./GameState";
import { IState } from "./IState";

export class Go implements IState {
  name: string = 'Go';
  state: any;
  gameState: GameState | null = null;

  onEnter(gameState: GameState) {
    console.log('Go');
    this.gameState = gameState;
  }

  onExit() {
    console.log('Go exit');
  }

  transition(transitionName: string, ...args: any[]): string {
    throw new Error("Method not implemented.");
  }
}