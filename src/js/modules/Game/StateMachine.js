export class StateMachine {
  constructor(gameStateUpdatedCallbackFn, playerMovementCallbackFn) {
    this.gameStateUpdatedCallbackFn = gameStateUpdatedCallbackFn;
    this.playerMovementCallbackFn = playerMovementCallbackFn;
    this.states = {};
    this.currentState = null;
    this.previousState = null;
  }

  addState(state) {
    this.states[state.name] = state;
  }

  getStates() {
    return Array.from(Object.values(this.states));
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
    this.currentState.onEnter(this, gameState, this.playerMovementCallbackFn);
    gameState.id++;
    this.gameStateUpdatedCallbackFn();
  }
}
