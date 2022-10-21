
export class IState {
  constructor() {
    this.transitions = {};
    this.state = {};
    this.name = 'BaseState';
  }

  enter(gameState) {
    this.gameState = gameState;
  }

  exit() { }
}
