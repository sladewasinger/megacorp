import { GameState } from "./GameState";
import { IState } from "./IState";

export class TurnEnd implements IState {
  name: string = 'TurnEnd';
  state: any;
  gameState: GameState | null = null;

  onEnter(gameState: GameState) {
    console.log('TurnEnd');
    this.gameState = gameState;
  }

  onExit() {
    console.log('TurnEnd exit');
  }

  transition(transitionName: string, ...args: any[]): string {
    throw new Error("Method not implemented.");
  }
}
