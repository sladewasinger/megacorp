export class GameOver {
  constructor() {
    this.name = 'GameOver';
  }

  onEnter(stateMachine, gameState) {
    console.log('GameOver');
    this.gameState = gameState;
  }

  onExit() {
    console.log('GameOver exit');
  }
}
