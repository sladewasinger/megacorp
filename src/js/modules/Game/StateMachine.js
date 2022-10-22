export class StateMachine {
  constructor(gameStateUpdatedCallbackFn) {
    this.gameStateUpdatedCallbackFn = gameStateUpdatedCallbackFn;
    this.states = {};
    this.currentState = null;
    this.previousState = null;
  }

  addState(state) {
    this.states[state.name] = state;
  }

  setState(stateName, gameState) {
    if (this.currentState) {
      this.currentState.onExit();
      gameState.id++;
      this.gameStateUpdatedCallbackFn();
    }
    this.previousState = this.currentState;

    this.currentState = this.states[stateName];
    if (!this.currentState) {
      throw new Error(`State ${stateName} not found! Did you forget to register it?`);
    }
    this.currentState.onEnter(this, gameState);
    gameState.id++;
    this.gameStateUpdatedCallbackFn();
  }
}
