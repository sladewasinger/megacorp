export class Go {
  constructor() {
    this.name = 'Go';
    this.gameState = null;
  }

  onEnter(stateMachine, gameState) {
    console.log('Go');
    this.gameState = gameState;
  }

  onExit() {
    console.log('Go exit');
  }
}
