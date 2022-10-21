import { GameState } from "./GameState";
import { IState } from "./IState";

export class StateMachine {
  states: { [key: string]: IState } = {};
  currentState: IState;

  constructor(initialState: IState) {
    this.currentState = initialState;
    this.addState(initialState);
  }

  addState(state: IState) {
    this.states[state.name] = state;
  }

  setState(stateName: string, gameState: GameState) {
    if (this.currentState) {
      this.currentState.onExit();
    }
    this.currentState = this.states[stateName];
    console.log(stateName, this.currentState);
    this.currentState.onEnter(gameState);
  }
}
