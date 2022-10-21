export class Utility {
  constructor() {
    this.name = 'Utility';
  }

  onEnter(stateMachine, gameState) {
    console.log('Utility');
    this.gameState = gameState;
  }

  onExit() {
    console.log('Utility exit');
  }
}
