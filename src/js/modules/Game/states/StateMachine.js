export class StateMachine {
  constructor() {
    this.states = {};
    this.currentState = null;
  }

  addState(state) {
    this.states[state.name] = state;
  }

  setState(stateName) {
    if (this.currentState) {
      this.currentState.exit();
    }
    this.currentState = this.states[stateName];
    this.currentState.enter();
  }
}
