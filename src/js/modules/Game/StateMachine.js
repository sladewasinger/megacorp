export class StateMachine {
  constructor() {
    this.states = {};
    this.currentState = null;
  }

  addState(state) {
    this.states[state.name] = state;
  }

  setState(stateName, gameState) {
    if (this.currentState) {
      this.currentState.onExit();
    }
    this.currentState = this.states[stateName];
    this.currentState.onEnter(this, gameState);
  }
}
