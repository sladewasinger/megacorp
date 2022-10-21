export class Go {
  constructor() {
    this.name = 'Go';
    this.gameState = null;
  }

  onEnter(gameState) {
    console.log('Go');

    this.gameState = gameState;
  }

  onExit() {
    console.log('Go exit');
  }
}
