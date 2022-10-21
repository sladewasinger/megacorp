export class Utility {
  constructor(name) {
    this.name = name;
    this.type = 'property';
  }

  onEnter(stateMachine, gameState) {
    console.log('Utility');
    this.gameState = gameState;
  }

  onExit() {
    console.log('Utility exit');
  }
}
